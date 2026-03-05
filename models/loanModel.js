import pool from '../config/db.js';

const handleLoanError = (operation, error) => {
    console.error(`Loan Database Error [${operation}]:`, error.message);
    throw error;
};

// --- READ ALL (Filtered by Logged-in User) ---
export const getAllLoans = async (user_id) => {
    try {
        const result = await pool.query(
            `SELECT 
                l.id, 
                a.full_name as applicant_name, 
                l.amount, 
                l.status, 
                l.created_at
             FROM loans l
             JOIN applicants a ON l.applicant_id = a.id
             WHERE l.user_id = $1
             ORDER BY l.id DESC`,
            [user_id]
        );
        return result.rows;
    } catch (error) {
        handleLoanError('getAllLoans', error);
    }
};

// --- READ BY ID (Secure check for owner) ---
export const getLoanById = async (id, user_id) => {
    try {
        const result = await pool.query(
            `SELECT 
                l.id, 
                a.full_name as applicant_name, 
                l.applicant_id,
                l.amount, 
                l.status, 
                l.created_at
             FROM loans l
             JOIN applicants a ON l.applicant_id = a.id
             WHERE l.id = $1 AND l.user_id = $2`,
            [id, user_id]
        );
        return result.rows[0] || null;
    } catch (error) {
        handleLoanError('getLoanById', error);
    }
};

// --- CREATE (Includes user_id) ---
export const createLoan = async (applicant_id, amount, user_id) => {
    try {
        const result = await pool.query(
            `INSERT INTO loans (applicant_id, amount, user_id)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [applicant_id, amount, user_id]
        );
        return result.rows[0];
    } catch (error) {
        handleLoanError('createLoan', error);
    }
};

// --- UPDATE (Includes user_id check) ---
export const updateLoan = async (id, amount, status, user_id) => {
    try {
        const result = await pool.query(
            `UPDATE loans
             SET amount = $1,
                 status = $2
             WHERE id = $3 AND user_id = $4
             RETURNING *`,
            [amount, status, id, user_id]
        );
        return result.rows[0] || null;
    } catch (error) {
        handleLoanError('updateLoan', error);
    }
};

// --- DELETE (Includes user_id check) ---
export const deleteLoan = async (id, user_id) => {
    try {
        const result = await pool.query(
            `DELETE FROM loans WHERE id = $1 AND user_id = $2 RETURNING *`,
            [id, user_id]
        );
        return result.rows[0] || null;
    } catch (error) {
        handleLoanError('deleteLoan', error);
    }
};

// --- SEARCH BY STATUS (Filtered by User) ---
export const searchLoansByStatus = async (status, user_id) => {
    try {
        const result = await pool.query(
            `SELECT 
                l.id, 
                a.full_name as applicant_name, 
                l.amount, 
                l.status, 
                l.created_at
             FROM loans l
             JOIN applicants a ON l.applicant_id = a.id
             WHERE l.status ILIKE $1 AND l.user_id = $2
             ORDER BY l.id DESC`,
            [`%${status}%`, user_id]
        );
        return result.rows;
    } catch (error) {
        handleLoanError('searchLoansByStatus', error);
    }
};

// --- READ BY APPLICANT (Secure check for owner) ---
export const getLoansByApplicant = async (applicant_id, user_id) => {
    try {
        const result = await pool.query(
            `SELECT 
                l.id, 
                a.full_name as applicant_name, 
                l.amount, 
                l.status, 
                l.created_at
             FROM loans l
             JOIN applicants a ON l.applicant_id = a.id
             WHERE l.applicant_id = $1 AND l.user_id = $2
             ORDER BY l.id DESC`,
            [applicant_id, user_id]
        );
        return result.rows;
    } catch (error) {
        handleLoanError('getLoansByApplicant', error);
    }
};
