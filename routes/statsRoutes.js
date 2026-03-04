import express from 'express';
import { getStats } from '../controllers/statsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only logged-in users can reach the dashboard
router.get('/dashboard', authenticateToken, getStats);

export default router;
