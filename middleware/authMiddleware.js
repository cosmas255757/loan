import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    // Look for the token in the "Authorization" header (Format: Bearer <token>)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    try {
        // Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // This adds { id: 123 } to the request
        next(); // Move to the controller
    } catch (error) {
        res.status(403).json({ success: false, message: "Invalid or expired token." });
    }
};
