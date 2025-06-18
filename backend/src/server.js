const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth');
const trainerRoutes = require('./routes/trainer'); // Masih ada, tapi pastikan tidak duplikasi fungsionalitas dengan authRoutes
const userRoutes = require('./routes/user'); // Pastikan ini di-require
const orderRoutes = require('./routes/order');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/user', userRoutes); // Rute untuk user.js
app.use(express.static('public'));
app.use('/trainer', trainerRoutes); // Rute untuk trainer.js
if (orderRoutes) { // Jika file order.js ada
    app.use('/order', orderRoutes);
}
app.use('/uploads', express.static('uploads'));
// app.use('/auth/trainer', trainerRoutes); // Ini mungkin duplikasi, karena /auth sudah ditangani oleh authRoutes
// Disarankan untuk menghapus baris ini jika semua rute trainer di bawah /auth sudah ditangani oleh authRoutes

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});