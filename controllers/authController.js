import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// REGISTER: Create a new account
export const register = async (req, res) => {
    const { full_name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Security Fix: Only return id, name, and email (No password_hash!)
        const newUser = await pool.query(
            `INSERT INTO users (full_name, email, password_hash) 
             VALUES ($1, $2, $3) 
             RETURNING id, full_name, email`,
            [full_name, email, hashedPassword]
        );
        
        res.status(201).json({ 
            success: true, 
            message: "User created successfully!", 
            user: newUser.rows[0] 
        });
    } catch (error) {
        // Handle unique constraint (email already exists)
        if (error.code === '23505') {
            return res.status(400).json({ success: false, message: "Email already registered." });
        }
        res.status(500).json({ success: false, message: "Server error during registration." });
    }
};

// LOGIN: Verify user and give them a token
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (user.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Create a token containing the User ID
        const token = jwt.sign(
            { id: user.rows[0].id, email: user.rows[0].email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '8h' }
        );

        res.json({ 
            success: true, 
            token, 
            user: { id: user.rows[0].id, name: user.rows[0].full_name } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
