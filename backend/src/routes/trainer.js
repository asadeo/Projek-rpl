// routes/trainer.js
const express = require('express'); 
const pool = require('../db');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const auth = require("../middleware/auth");

// Mendapatkan list semua trainer
router.get('/trainers', authMiddleware, async (req, res) => {
    try {
        const loggedInUserId = req.user.id;

        const result = await pool.query(`
            SELECT 
                id, name, email, role, experience_years, education, price, profile_picture_url
            FROM users 
            WHERE role = 'trainer' AND id != $1
        `, [loggedInUserId]);

        res.json(result.rows);
    } catch (err) {
        console.error("Gagal ambil daftar trainer:", err);
        res.status(500).json({ message: 'Gagal mengambil daftar trainer' });
    }
});



module.exports = router;
