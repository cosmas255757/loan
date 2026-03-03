import pool from '../config/db.js';

const handleLoanError = (operation, error) => {
    console.error(`Loan Database Error [${operation}]:`, error.message);
    throw error;
};

// --- READ ALL (With JOIN for Full Name) ---
export const getAllLoans = async () => {
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
             ORDER BY l.id DESC`
        );
        return result.rows;
    } catch (error) {
        handleLoanError('getAllLoans', error);
    }
};

// Get loan by id
export const getLoanById = async (id) => {
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
             WHERE l.id = $1`,
            [id]
        );
        return result.rows[0] || null;
    } catch (error) {
        handleLoanError('getLoanById', error);
    }
};

// --- READ BY APPLICANT (With JOIN) ---
export const getLoansByApplicant = async (applicant_id) => {
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
             WHERE l.applicant_id = $1
             ORDER BY l.id DESC`,
            [applicant_id]
        );
        return result.rows;
    } catch (error) {
        handleLoanError('getLoansByApplicant', error);
    }
};

// --- SEARCH BY STATUS (With JOIN) ---
export const searchLoansByStatus = async (status) => {
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
             WHERE l.status ILIKE $1
             ORDER BY l.id DESC`,
            [`%${status}%`]
        );
        return result.rows;
    } catch (error) {
        handleLoanError('searchLoansByStatus', error);
    }
};

// --- CREATE ---
export const createLoan = async (applicant_id, amount) => {
    try {
        const result = await pool.query(
            `INSERT INTO loans (applicant_id, amount)
             VALUES ($1, $2)
             RETURNING *`,
            [applicant_id, amount]
        );
        return result.rows[0];
    } catch (error) {
        handleLoanError('createLoan', error);
    }
};

// --- UPDATE ---
export const updateLoan = async (id, amount, status) => {
    try {
        const result = await pool.query(
            `UPDATE loans
             SET amount = $1,
                 status = $2
             WHERE id = $3
             RETURNING *`,
            [amount, status, id]
        );
        return result.rows[0] || null;
    } catch (error) {
        handleLoanError('updateLoan', error);
    }
};

// --- DELETE ---
export const deleteLoan = async (id) => {
    try {
        const result = await pool.query(
            `DELETE FROM loans WHERE id = $1 RETURNING *`,
            [id]
        );
        return result.rows[0] || null;
    } catch (error) {
        handleLoanError('deleteLoan', error);
    }
};
