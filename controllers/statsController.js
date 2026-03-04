import { getDashboardStats } from '../models/statsModel.js';

export const getStats = async (req, res) => {
    try {
        // Fetch the raw data from your model (which returns stats.rows[0])
        const data = await getDashboardStats();

        // Check if data exists; if not, initialize with zeros to prevent frontend crashes
        if (!data) {
            return res.status(404).json({ 
                success: false, 
                message: "No dashboard data found." 
            });
        }

        // Return a successful response with the 13 data points
        res.status(200).json({ 
            success: true, 
            data: data // This contains all 13 keys defined in your SELECT query
        });
    } catch (error) {
        console.error("Controller Error (getStats):", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Failed to retrieve dashboard statistics." 
        });
    }
};
