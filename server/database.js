// database.js
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config(); // Load .env variables

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }        // required for Supabase
});

export default pool;
