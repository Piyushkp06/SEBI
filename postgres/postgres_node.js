// backend-node/postgres_check.js
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Supabase
});

async function connectAndCheck() {
  try {
    console.log("🔹 Attempting to connect to Postgres...");
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Connected successfully!");
    console.log("Current time in Postgres:", res.rows[0]);
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
  } finally {
    await pool.end();
  }
}

connectAndCheck();
