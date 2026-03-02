import express from 'express';
import {
    addApplicant,
    listApplicants,
    getApplicant,
    editApplicant,
    removeApplicant,
    searchApplicants
} from '../controllers/applicantController.js';

const router = express.Router();

/**
 * APPLICANT ROUTES
 * Base Path: /api/applicants (assuming this is mounted in server.js)
 */

// @route   GET /api/applicants/search
// @desc    Search applicants by name
router.get('/search', searchApplicants);

// @route   GET /api/applicants/
// @desc    Get all applicants
router.get('/', listApplicants);

// @route   GET /api/applicants/:id
// @desc    Get a single applicant by ID
router.get('/:id', getApplicant);

// @route   POST /api/applicants/
// @desc    Create a new applicant
router.post('/', addApplicant);

// @route   PUT /api/applicants/:id
// @desc    Update applicant details
router.put('/:id', editApplicant);

// @route   DELETE /api/applicants/:id
// @desc    Remove an applicant
router.delete('/:id', removeApplicant);

export default router;
