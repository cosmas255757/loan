import pkg from 'pg';
import dotenv from 'dotenv';

// Load environment variables from your .env file
dotenv.config();

const { Pool } = pkg;

/**
 * DATABASE CONFIGURATION
 * Optimized for Neon/Render cloud hosting
 */
const pool = new Pool({
  // This uses the long connection string from your .env
  connectionString: process.env.DATABASE_URL,
  
  // Required for Cloud Databases (Neon, Render, AWS)
  ssl: {
    // Allows connection to verified cloud providers 
    // without needing a physical SSL certificate file
    rejectUnauthorized: false, 
  },
});

// Test the connection immediately on startup
pool.on('connect', () => {
  console.log('✅ PostgreSQL Cloud Database Connected');
});

// Catch errors on the idle client
pool.on('error', (err) => {
  console.error('❌ Unexpected Database Error:', err.message);
  process.exit(-1);
});

export default pool;
