import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Routes
import applicantRoutes from './routes/applicantRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import repaymentRoutes from './routes/repaymentRoutes.js';
import pool from './config/db.js';

// Setup for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* ============================
   MIDDLEWARE
============================ */
app.use(cors());
app.use(express.json());

// 1. Serve static files (CSS, JS, images) from the 'views' folder
app.use(express.static(path.join(__dirname, 'views')));

/* ============================
   DATABASE CONNECTION TEST
============================ */
const checkDbConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('✅ Database connected at:', res.rows[0].now);
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
    }
};
checkDbConnection();

/* ============================
   ROUTES
============================ */

// API Routes
app.use('/api/applicants', applicantRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/repayments', repaymentRoutes);

// Health Check API
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Loan System API is healthy' });
});

// FRONTEND ROUTE: Serve applicants.html as the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'applicants.html'));
});

/* ============================
   ERROR HANDLING
============================ */

// 404 Handler (Must be after all routes)
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(`[Global Error]: ${err.message}`);
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

/* ============================
   START SERVER
============================ */
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
