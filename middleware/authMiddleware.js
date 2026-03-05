import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    // Safety check for the secret
    if (!process.env.JWT_SECRET) {
        console.error("❌ JWT_SECRET is missing in .env file");
        return res.status(500).json({ success: false, message: "Internal server configuration error." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (error) {
        return res.status(403).json({ success: false, message: "Invalid or expired token." });
    }
};
