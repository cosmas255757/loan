import express from 'express';
import { getStats } from '../controllers/statsController.js';

const router = express.Router();

// Define the route for dashboard statistics
router.get('/dashboard', getStats);

export default router;
