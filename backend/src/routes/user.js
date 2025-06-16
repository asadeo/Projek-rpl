const express = require('express');
const pool = require('../db');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Menggunakan satu nama konsisten

router.post('/order-trainer', async (req, res) => {
    const { user_id, trainer_id, consultation_date, fee } = req.body;
    const result = await pool.query(
        'INSERT INTO transactions (user_id, trainer_id, consultation_date, status, fee) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [user_id, trainer_id, consultation_date, 'pending', fee]
    );
    res.json(result.rows[0]);
});

router.post('/buy-product', async (req, res) => {
    const { user_id, product_id, quantity, total_price } = req.body;
    const result = await pool.query(
        'INSERT INTO transaction_item (user_id, product_id, quantity, total_price) VALUES ($1, $2, $3, $4) RETURNING *',
        [user_id, product_id, quantity, total_price]
    );
    res.json(result.rows[0]);
});

// Rute ini dihapus karena sudah ada di routes/auth.js
/*
router.post('/register-trainer', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const { experience_years, education, price } = req.body;

    if (!experience_years || !education || !price) {
        return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    try {
        await pool.query(` // Menggunakan pool
            UPDATE users
            SET role = 'trainer',
                experience_years = $1,
                education = $2,
                price = $3
            WHERE id = $4
        `, [experience_years, education, price, userId]);

        res.status(200).json({ message: 'Berhasil mendaftar sebagai trainer' });
    } catch (err) {
        console.error('DB error:', err);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
});
*/

module.exports = router;