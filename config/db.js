import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Environment check for SSL (Required for Neon/Render)
const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('neon.tech');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  
  // Performance & Resilience settings
  connectionTimeoutMillis: 5000, 
  idleTimeoutMillis: 30000,
});

// Success Listener
pool.on('connect', () => {
  console.log('✅ PostgreSQL Cloud Database Connected');
});

// Error Listener
pool.on('error', (err) => {
  console.error('❌ Unexpected Database Error:', err.message);
  if (process.env.NODE_ENV === 'production') {
    process.exit(-1);
  }
});

export default pool;
