//routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Menggunakan 'pool' secara konsisten
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Menggunakan satu nama konsisten
const multer = require('multer');
const path = require('path');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // TODO: Implement password hashing with bcrypt
        const role = 'user'; // hanya boleh mendaftar sebagai user
        const result = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, password, role]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userRes.rows[0];
    if (!user) return res.status(401).send('User tidak ditemukan');
    // TODO: Implement password comparison with bcrypt
    if (user.password !== password) return res.status(401).send('Password salah');
    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET || 'rahasia', { expiresIn: '1d' });

    res.json({ token, role: user.role, user_id: user.id }); // Mengembalikan user_id agar bisa disimpan di localStorage
});

// Profile
router.get('/profile', async (req, res) => {
    const authHeader = req.headers.authorization; // Gunakan nama yang lebih jelas
    if (!authHeader) return res.status(401).json({ message: 'Token diperlukan' });

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const result = await pool.query(`
        SELECT name, email, role, experience_years, education, price, profile_picture_url, trainer_wallet
        FROM users
        WHERE id = $1
        `, [decoded.id]);
        
        if (result.rows.length === 0) { // Perbaikan penanganan error
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Profile error:', err);
        res.status(401).json({ message: 'Token tidak valid' });
    }
});

//trainers
router.get('/trainers', authMiddleware, async (req, res) => { // Menggunakan authMiddleware
    try {
        const loggedInUserId = req.user.id; // Mengambil ID pengguna yang sedang login

        // Hanya menampilkan trainer yang bukan diri sendiri
        const result = await pool.query(`SELECT id, name, email, role, experience_years, education, price, profile_picture_url FROM users WHERE role = 'trainer' AND id != $1`, [loggedInUserId]);
        res.json(result.rows);
    } catch (err) {
        console.error("Gagal ambil daftar trainer:", err);
        res.status(500).json({ message: 'Gagal mengambil daftar trainer' });
    }
});

// Trainer Wallet (Konsolidasi dengan /trainer/me) - Rute ini bisa dihapus jika /trainer/me cukup
/*
router.get('/trainer-wallet', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'trainer') return res.status(403).json({ message: 'Akses ditolak. Hanya untuk trainer.' });

        // Mengambil dari kolom trainer_wallet di tabel users
        const result = await pool.query('SELECT trainer_wallet FROM users WHERE id = $1', [req.user.id]);
        const amount = result.rows[0]?.trainer_wallet || 0; // Menggunakan trainer_wallet
        res.json({ amount });
    } catch (err) {
        console.error("Gagal ambil saldo dompet:", err);
        res.status(500).json({ message: 'Gagal mengambil saldo dompet' });
    }
});
*/

// Folder untuk menyimpan gambar
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); // Nama file unik
    }
});
const upload = multer({ storage });

// Route: Upload profile picture
router.post('/upload-picture', authMiddleware, upload.single('profile_picture'), async (req, res) => { // Menggunakan authMiddleware
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'File tidak ditemukan' });
        }

        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User ID tidak ditemukan' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        await pool.query('UPDATE users SET profile_picture_url = $1 WHERE id = $2', [imageUrl, userId]); // Menggunakan 'pool'

        res.json({ message: 'Upload berhasil', url: imageUrl });
    } catch (err) {
        console.error('Upload picture error:', err);
        res.status(500).json({ message: 'Gagal upload', error: err.message });
    }
});

//Register Trainer
router.post('/register-trainer', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const { experience_years, education, price } = req.body;
    
    // console.log('Dapat data dari frontend:', { userId, experience_years, education, price }); // Dihapus

    if (!experience_years || !education || !price) {
        // console.log('Validasi gagal'); // Dihapus
        return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    try {
        await pool.query(`
            UPDATE users
            SET role = 'trainer',
                experience_years = $1,
                education = $2,
                price = $3
            WHERE id = $4
        `, [experience_years, education, price, userId]);

        // console.log('Update berhasil'); // Dihapus
        res.status(200).json({ message: 'Berhasil mendaftar sebagai trainer' });
    } catch (err) {
        console.error('DB error:', err);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
});

// Kirim pesan
router.post('/messages', authMiddleware, async (req, res) => { // Menggunakan authMiddleware
  const { receiver_id, content } = req.body;
  const sender_id = req.user.id;

  try {
    await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3)',
      [sender_id, receiver_id, content]
    );
    res.status(200).json({ message: 'Pesan dikirim' });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ message: 'Gagal kirim pesan' });
  }
});

// Ambil riwayat pesan
router.get('/messages/:receiverId', authMiddleware, async (req, res) => { // Menggunakan authMiddleware
  const userId = req.user.id;
  const receiverId = req.params.receiverId;

  try {
    const result = await pool.query(`
      SELECT * FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2)
         OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC
    `, [userId, receiverId]);

    res.json(result.rows);
  } catch (err) {
    console.error('Fetch message error:', err);
    res.status(500).json({ message: 'Gagal ambil pesan' });
  }
});

// 👨‍🏫 Trainer menambahkan jadwal
router.post('/trainer/schedule', authMiddleware, async (req, res) => { // Menggunakan authMiddleware
  try {
    const { date, start_time, end_time } = req.body;
    const trainerId = req.user.id;

    // Pastikan user adalah trainer
    const userCheck = await pool.query('SELECT role FROM users WHERE id = $1', [trainerId]);
    if (userCheck.rows[0]?.role !== 'trainer') {
      return res.status(403).json({ message: 'Akses ditolak. Hanya trainer yang bisa mengatur jadwal.' });
    }

    const startHour = parseInt(start_time.split(":")[0]);
    const endHour = parseInt(end_time.split(":")[0]);

    // Loop untuk setiap jam, pastikan waktu berakhir lebih besar dari waktu mulai
    if (startHour >= endHour) {
      return res.status(400).json({ message: "Waktu selesai harus setelah waktu mulai." });
    }

    for (let h = startHour; h < endHour; h++) { // Ubah <= menjadi < agar jam terakhir tidak terduplikasi jika end_time adalah jam penuh
      const hourStr = `${h.toString().padStart(2, '0')}:00`;
      await pool.query(`
        INSERT INTO schedules (trainer_id, schedule_date, schedule_time)
        VALUES ($1, $2, $3)
      `, [trainerId, date, hourStr]);
    }

    res.json({ message: "Jadwal berhasil dibuat." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// 🧑‍💻 User melihat jadwal trainer tertentu
router.get('/trainer/schedule/:trainerId', authMiddleware, async (req, res) => { // Menggunakan authMiddleware
  try {
    const trainerId = req.params.trainerId;
    const result = await pool.query(`
      SELECT * FROM schedules
      WHERE trainer_id = $1
      ORDER BY schedule_date, schedule_time
    `, [trainerId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil jadwal." });
  }
});

// Booking jadwal dan menambahkan saldo ke dompet trainer
router.post('/trainer/schedule/book/:scheduleId', authMiddleware, async (req, res) => { // Menggunakan authMiddleware
  try {
    const scheduleId = req.params.scheduleId;
    const userId = req.user.id;

    // Ambil detail jadwal + harga trainer
    const scheduleQuery = await pool.query(`
      SELECT s.*, u.price, u.id as trainer_id
      FROM schedules s
      JOIN users u ON s.trainer_id = u.id
      WHERE s.id = $1
    `, [scheduleId]);

    if (scheduleQuery.rows.length === 0) {
      return res.status(404).json({ message: "Jadwal tidak ditemukan." });
    }

    const schedule = scheduleQuery.rows[0];

    if (schedule.is_booked) {
      return res.status(400).json({ message: "Jadwal sudah dibooking." });
    }

    const trainerId = schedule.trainer_id;
    const price = schedule.price || 0;

    // Mulai transaksi database
    await pool.query('BEGIN');

    // Tandai jadwal sebagai booked
    await pool.query(`
      UPDATE schedules SET is_booked = TRUE WHERE id = $1
    `, [scheduleId]);

    // Tambahkan price ke wallet trainer
    await pool.query(`
      UPDATE users SET trainer_wallet = COALESCE(trainer_wallet, 0) + $1 WHERE id = $2
    `, [price, trainerId]);

    // Format waktu tampil user
    function formatDateTime(dateStr, timeStr) {
      try {
        const dateParts = dateStr.split('-');
        const timeParts = timeStr.split(':');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1;
        const day = parseInt(dateParts[2]);
        const hour = parseInt(timeParts[0]);
        const minute = parseInt(timeParts[1]);

        const dateObj = new Date(year, month, day, hour, minute);
        return dateObj.toLocaleString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      } catch {
        return `${dateStr} ${timeStr}`;
      }
    }

    const jadwalTampil = formatDateTime(schedule.schedule_date, schedule.schedule_time);

    // Kirim pesan sistem ke chat
    const chatMessage = `✅ Anda berhasil membooking jadwal pada ${jadwalTampil}`;
    await pool.query(`
      INSERT INTO messages (sender_id, receiver_id, content)
      VALUES ($1, $2, $3)
    `, [userId, trainerId, chatMessage]);

    // Commit transaksi
    await pool.query('COMMIT');

    res.json({ message: "Berhasil booking dan wallet trainer bertambah." });

  } catch (err) {
    // Rollback transaksi jika terjadi error
    await pool.query('ROLLBACK');
    console.error("Gagal booking:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat booking." });
  }
});


// history chat (rute ini dipertahankan dan diperbarui)
router.get('/trainer/chat-history', authMiddleware, async (req, res) => { // Menggunakan authMiddleware
  try {
    const trainerId = req.user.id;

    const result = await pool.query(`
      SELECT DISTINCT ON (u.id) u.id as user_id, u.name as user_name, u.email, m.created_at
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.receiver_id = $1
      ORDER BY u.id, m.created_at DESC
    `, [trainerId]);

    res.json(result.rows);
  } catch (err) {
    console.error("Gagal ambil chat history:", err);
    res.status(500).json({ message: "Gagal memuat riwayat chat." });
  }
});

// Mendapatkan wallet trainer berdasarkan token login
router.get('/trainer/me', authMiddleware, async (req, res) => { // Menggunakan authMiddleware
  try {
    const trainerId = req.user.id;
    // Mengambil trainer_wallet dari tabel users
    const result = await pool.query(`SELECT trainer_wallet FROM users WHERE id = $1`, [trainerId]); 
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Trainer tidak ditemukan." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Gagal ambil data wallet:", err);
    res.status(500).json({ message: "Terjadi kesalahan." });
  }
});

// routes/auth.js
// ... (bagian atas file tetap sama)

// Tambahkan rute baru untuk mendapatkan profil user berdasarkan ID
router.get('/profile-by-id/:userId', authMiddleware, async (req, res) => {
    try {
        const userIdToFetch = req.params.userId;
        const requestingUserId = req.user.id; // Pengguna yang membuat permintaan
        const requestingUserRole = req.user.role; // Peran pengguna yang membuat permintaan

        // Pastikan hanya trainer yang bisa melihat profil user lain, atau user bisa melihat profilnya sendiri
        if (String(userIdToFetch) !== String(requestingUserId) && requestingUserRole !== 'trainer') {
             return res.status(403).json({ message: 'Akses ditolak.' });
        }

        const result = await pool.query(`
            SELECT id, name, email, role, profile_picture_url
            FROM users
            WHERE id = $1
        `, [userIdToFetch]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching user profile by ID:', err);
        res.status(500).json({ message: 'Gagal mengambil profil user.' });
    }
});

// ... (sisa rute lainnya tetap sama seperti yang sudah diperbaiki sebelumnya)


module.exports = router;