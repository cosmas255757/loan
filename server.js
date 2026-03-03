import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import statsRoutes from './routes/statsRoutes.js'; 

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
   1. GLOBAL MIDDLEWARE
============================ */
app.use(cors({
  origin: ['https://loan-2-a2d1.onrender.com', 'http://localhost:3000'] 
}));

app.use(express.json());

// Serve all files in the 'views' folder (CSS, JS, etc.)
// This must stay ABOVE the routes
app.use(express.static(path.join(__dirname, 'views')));

// Mount the stats routes under a specific path (e.g., /api/stats)
app.use('/api/stats', statsRoutes);

/* ============================
   2. DATABASE CONNECTION TEST
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
   3. API ROUTES
============================ */
app.use('/api/applicants', applicantRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/repayments', repaymentRoutes);

// Health Check API
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Loan System API is healthy' });
});

/* ============================
   4. FRONTEND NAVIGATION
============================ */

// Serve applicants.html as the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'applicants.html'));
});

// Explicit routes for other pages (if you use direct links)
app.get('/loans', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'loans.html'));
});

app.get('/repayments', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'repayments.html'));
});

/* ============================
   5. ERROR HANDLING
============================ */

// 404 Handler (This must be the LAST route)
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
   6. START SERVER
============================ */
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
