import express from 'express';
import {
    addRepayment,
    listRepayments,
    getRepayment,
    listRepaymentsByLoan,
    editRepayment,
    removeRepayment
} from '../controllers/repaymentController.js';
// Import your gatekeeper middleware
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * REPAYMENT ROUTES (Protected)
 * Base Path: /api/repayments
 */

// Use middleware for ALL routes in this file
router.use(authenticateToken);

// 1. FILTERS & GROUPING
router.get('/loan/:loan_id', listRepaymentsByLoan);

// 2. GENERAL READ/WRITE
router.get('/', listRepayments);
router.post('/', addRepayment);

// 3. ID-SPECIFIC OPERATIONS
router.get('/:id', getRepayment);
router.put('/:id', editRepayment);
router.delete('/:id', removeRepayment);

export default router;
