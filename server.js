import dotenv from 'dotenv';
dotenv.config(); // Must be at the very top

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. IMPORT ALL ROUTES
import authRoutes from './routes/authRoutes.js';
import statsRoutes from './routes/statsRoutes.js'; 
import applicantRoutes from './routes/applicantRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import repaymentRoutes from './routes/repaymentRoutes.js';
import pool from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

/* ============================
   2. GLOBAL MIDDLEWARE
============================ */
app.use(cors());

app.use(express.json());
// Serve static files from the 'views' folder
app.use(express.static(path.join(__dirname, 'views')));

/* ============================
   3. API ROUTES
============================ */
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/applicants', applicantRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/repayments', repaymentRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Loan System API is healthy' });
});

/* ============================
   4. PAGE ROUTES
============================ */
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'views', 'register.html')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'stats.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'views', 'stats.html')));
app.get('/applicants', (req, res) => res.sendFile(path.join(__dirname, 'views', 'applicants.html')));
app.get('/loans', (req, res) => res.sendFile(path.join(__dirname, 'views', 'loans.html')));
app.get('/repayments', (req, res) => res.sendFile(path.join(__dirname, 'views', 'repayments.html')));

/* ============================
   5. DB CONNECTION CHECK
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
   6. ERROR HANDLING
============================ */
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(`[Global Error]: ${err.message}`);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
