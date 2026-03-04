import { getDashboardStats } from '../models/statsModel.js';

export const getStats = async (req, res) => {
    try {
        // 1. Get the logged-in user's ID
        // This usually comes from a JWT/Session middleware (e.g., req.user.id)
        const userId = req.user?.id; 

        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized: No user ID found in request." 
            });
        }

        // 2. Pass the userId to the model
        const data = await getDashboardStats(userId);

        // stats.rows[0] check
        if (!data) {
            return res.status(404).json({ 
                success: false, 
                message: "No dashboard data found for this user." 
            });
        }

        // 3. Return the user-specific data
        res.status(200).json({ 
            success: true, 
            data: data 
        });
    } catch (error) {
        console.error("Controller Error (getStats):", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Failed to retrieve your dashboard statistics." 
        });
    }
};
