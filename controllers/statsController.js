import { getDashboardStats } from '../models/statsModel.js';

export const getStats = async (req, res) => {
    try {
        const data = await getDashboardStats();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
