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
// Import the gatekeeper
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * LOAN ROUTES (Protected)
 * Base Path: /api/loans
 */

// Apply authentication to ALL routes below
router.use(authenticateToken);

// 1. SEARCH & FILTER
router.get('/search', searchLoans);
router.get('/applicant/:applicant_id', listLoansByApplicant);

// 2. GENERAL READ/WRITE
router.get('/', listLoans);
router.post('/', addLoan);

// 3. ID-SPECIFIC OPERATIONS
router.get('/:id', getLoan);
router.put('/:id', editLoan);
router.delete('/:id', removeLoan);

export default router;
