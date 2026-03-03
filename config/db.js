import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Only apply SSL if we are in production (Render) 
// or if explicitly required by the provider (Neon)
const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('neon.tech');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  
  // Best practice: add a timeout so the app doesn't hang if the DB is down
  connectionTimeoutMillis: 5000, 
  idleTimeoutMillis: 30000,
});

pool.on('connect', () => {
  console.log('✅ PostgreSQL Cloud Database Connected');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected Database Error:', err.message);
  // Don't exit in dev, but keep it for production safety
  if (process.env.NODE_ENV === 'production') process.env.exit(-1);
});

export default pool;
