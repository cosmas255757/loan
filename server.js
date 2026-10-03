import dotenv from 'dotenv';
dotenv.config(); 

import express from 'express';
import cors from 'cors';

// 1. IMPORT ALL ROUTES
import authRoutes from './routes/authRoutes.js';
import statsRoutes from './routes/statsRoutes.js'; 
import applicantRoutes from './routes/applicantRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import repaymentRoutes from './routes/repaymentRoutes.js';
import pool from './config/db.js';

const app = express();
const PORT = process.env.PORT || 10000;

/* ============================
   2. GLOBAL MIDDLEWARE & CORS
============================ */
const corsOptions = {
    // Allows live Render frontend and local Vite environment to make API calls
    origin: ['https://onrender.com', 'http://localhost:5173'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

/* ============================
   3. API ENDPOINTS
============================ */
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/applicants', applicantRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/repayments', repaymentRoutes);

// Health check endpoint for monitoring uptime
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Loan System API is healthy and connected to Render' });
});

/* ============================
   4. DB CONNECTION CHECK
============================ */
const checkDbConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('✅ Database connected at:', res.rows[0].now);
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
    }
};

/* ============================
   5. ERROR HANDLING
============================ */
// Catch-all for undefined API paths
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'API Route not found' });
});

// Global internal server error boundary
app.use((err, req, res, next) => {
    console.error(`[Global Error]: ${err.message}`);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

/* ============================
   6. START APPLICATION SERVER
============================ */
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 API-Only Server running on port ${PORT}`);
    checkDbConnection();
});
