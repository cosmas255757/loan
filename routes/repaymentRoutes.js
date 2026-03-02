import express from 'express';
import {
    addRepayment,
    listRepayments,
    getRepayment,
    listRepaymentsByLoan,
    editRepayment,
    removeRepayment
} from '../controllers/repaymentController.js';

const router = express.Router();

/**
 * REPAYMENT ROUTES
 * Base Path: /api/repayments
 */

// 1. FILTERS & GROUPING
// @route   GET /api/repayments/loan/:loan_id
// @desc    Get all payment history for a specific loan
router.get('/loan/:loan_id', listRepaymentsByLoan);

// 2. GENERAL READ/WRITE
// @route   GET /api/repayments/
router.get('/', listRepayments);

// @route   POST /api/repayments/
router.post('/', addRepayment);

// 3. ID-SPECIFIC OPERATIONS
// @route   GET /api/repayments/:id
router.get('/:id', getRepayment);

// @route   PUT /api/repayments/:id
router.put('/:id', editRepayment);

// @route   DELETE /api/repayments/:id
router.delete('/:id', removeRepayment);

export default router;
