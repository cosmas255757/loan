import express from 'express';
import {
    addApplicant,
    listApplicants,
    getApplicant,
    editApplicant,
    removeApplicant,
    searchApplicants
} from '../controllers/applicantController.js';
// Import the gatekeeper
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * APPLICANT ROUTES (Protected)
 * Base Path: /api/applicants
 */

// Apply authentication to ALL routes below
router.use(authenticateToken);

// @route   GET /api/applicants/search
router.get('/search', searchApplicants);

// @route   GET /api/applicants/
router.get('/', listApplicants);

// @route   GET /api/applicants/:id
router.get('/:id', getApplicant);

// @route   POST /api/applicants/
router.post('/', addApplicant);

// @route   PUT /api/applicants/:id
router.put('/:id', editApplicant);

// @route   DELETE /api/applicants/:id
router.delete('/:id', removeApplicant);

export default router;
