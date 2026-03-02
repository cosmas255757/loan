import pkg from 'pg';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

const { Pool } = pkg;

// Use environment variables or fallback to defaults
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'loan',
  //password: process.env.DB_PASSWORD, // Loaded from .env file
  password: 'jose2002##',
  port: process.env.DB_PORT || 5432,
});

// Optional: Log when the pool connects or hits an error
pool.on('connect', () => {
  console.log('🐘 PostgreSQL Pool connected');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

export default pool;
