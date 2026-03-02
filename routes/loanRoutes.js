import express from 'express';
import {
    addLoan,
    listLoans,
    getLoan,
    listLoansByApplicant,
    editLoan,
    removeLoan,
    searchLoans
} from '../controllers/loanController.js';

const router = express.Router();

/**
 * LOAN ROUTES
 * Base Path: /api/loans
 */

// 1. SEARCH & FILTER (Specific routes first)
// @route   GET /api/loans/search?status=pending
router.get('/search', searchLoans);

// @route   GET /api/loans/applicant/:applicant_id
router.get('/applicant/:applicant_id', listLoansByApplicant);

// 2. GENERAL READ/WRITE
// @route   GET /api/loans/
router.get('/', listLoans);

// @route   POST /api/loans/
router.post('/', addLoan);

// 3. ID-SPECIFIC OPERATIONS (Generic routes last)
// @route   GET /api/loans/:id
router.get('/:id', getLoan);

// @route   PUT /api/loans/:id
router.put('/:id', editLoan);

// @route   DELETE /api/loans/:id
router.delete('/:id', removeLoan);

export default router;
