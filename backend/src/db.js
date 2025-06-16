require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

console.log("Connecting to DB:", process.env.DATABASE_URL);

// Tes koneksi
pool
  .query("SELECT NOW()")
  .then((res) => {
    console.log("✅ DB connected at:", res.rows[0].now);
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
  });

module.exports = pool;
