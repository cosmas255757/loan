import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import applicantRoutes from './routes/applicantRoutes.js';
import pool from './config/db.js';
import loanRoutes from './routes/loanRoutes.js';
import repaymentRoutes from './routes/repaymentRoutes.js';

// Load environment variables (from a .env file)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* ============================
   MIDDLEWARE
============================ */

// Enable CORS (Essential if your frontend is on a different port/domain)
app.use(cors());

// Body parser
app.use(express.json());

app.use('/api/applicants', applicantRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/repayments', repaymentRoutes);
app.use(express.static('views'));

/* ============================
   DATABASE CONNECTION TEST
============================ */

const checkDbConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('✅ Database connected at:', res.rows[0].now);
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        // We don't crash the app, but we log the major failure
    }
};
checkDbConnection();

/* ============================
   ROUTES
============================ */

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Loan System API is healthy' });
});

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Loan Management System API');
});

// Applicant routes - Standardized to /api prefix
app.use('/api/applicants', applicantRoutes);

/* ============================
   ERROR HANDLING
============================ */

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler (Catches all unexpected errors)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(`[Global Error]: ${err.message}`);
    
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        // Only show stack trace in development mode
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

/* ============================
   START SERVER
============================ */

app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`📡 Access via: http://localhost:${PORT}`);
});
