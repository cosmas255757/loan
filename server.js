import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Routes
import statsRoutes from './routes/statsRoutes.js'; 
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
   1. GLOBAL MIDDLEWARE
============================ */
app.use(cors({
  origin: ['https://loan-2-a2d1.onrender.com', 'http://localhost:3000'] 
}));

app.use(express.json());

// Serve static files (CSS, JS, images) from the 'views' folder
app.use(express.static(path.join(__dirname, 'views')));

/* ============================
   2. API ROUTES
============================ */
// Mount the stats routes (This enables /api/stats/dashboard)
app.use('/api/stats', statsRoutes);
app.use('/api/applicants', applicantRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/repayments', repaymentRoutes);

// Health Check API
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Loan System API is healthy' });
});

/* ============================
   3. FRONTEND NAVIGATION (PAGE ROUTES)
============================ */

// CHANGE: Set stats.html (Dashboard) as the DEFAULT home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'stats.html'));
});

// Explicit route for dashboard/stats
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'stats.html'));
});

// Other pages
app.get('/applicants', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'applicants.html'));
});

app.get('/loans', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'loans.html'));
});

app.get('/repayments', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'repayments.html'));
});

/* ============================
   4. DATABASE CONNECTION TEST
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
   5. ERROR HANDLING
============================ */
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(`[Global Error]: ${err.message}`);
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

/* ============================
   6. START SERVER
============================ */
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Dashboard available at http://localhost:${PORT}`);
});
