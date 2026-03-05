import pool from '../config/db.js';

const handleRepaymentError = (operation, error) => {
    console.error(`Repayment DB Error [${operation}]:`, error.message);
    throw error;
};

// --- READ ALL (Filtered by Logged-in User) ---
export const getAllRepayments = async (userId) => {
    try {
        const result = await pool.query(
            `SELECT 
                r.id,
                a.full_name as applicant_name,
                r.amount_paid,
                l.amount as original_loan_amount,
                (l.amount - (
                    SELECT COALESCE(SUM(amount_paid), 0) 
                    FROM repayments 
                    WHERE loan_id = l.id AND id <= r.id
                )) as amount_left,
                r.payment_date
             FROM repayments r
             JOIN loans l ON r.loan_id = l.id
             JOIN applicants a ON l.applicant_id = a.id
             WHERE r.user_id = $1
             ORDER BY r.id DESC`,
            [userId]
        );
        return result.rows;
    } catch (error) {
        handleRepaymentError('getAllRepayments', error);
    }
};

// --- CREATE (Includes user_id) ---
export const createRepayment = async (loan_id, amount_paid, payment_date, userId) => {
    try {
        const result = await pool.query(
            `INSERT INTO repayments (loan_id, amount_paid, payment_date, user_id)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [loan_id, amount_paid, payment_date, userId]
        );
        return result.rows[0];
    } catch (error) {
        handleRepaymentError('createRepayment', error);
    }
};

// --- READ BY LOAN (Secure check for owner) ---
export const getRepaymentsByLoan = async (loan_id, userId) => {
    try {
        const result = await pool.query(
            `SELECT r.* FROM repayments r 
             WHERE r.loan_id = $1 AND r.user_id = $2 
             ORDER BY r.id DESC`,
            [loan_id, userId]
        );
        return result.rows;
    } catch (error) {
        handleRepaymentError('getRepaymentsByLoan', error);
    }
};

// --- UPDATE (Secure check for owner) ---
export const updateRepayment = async (id, amount_paid, payment_date, userId) => {
    try {
        const result = await pool.query(
            `UPDATE repayments
             SET amount_paid = $1, payment_date = $2
             WHERE id = $3 AND user_id = $4
             RETURNING *`,
            [amount_paid, payment_date, id, userId]
        );
        return result.rows[0] || null;
    } catch (error) {
        handleRepaymentError('updateRepayment', error);
    }
};

// --- DELETE (Secure check for owner) ---
export const deleteRepayment = async (id, userId) => {
    try {
        const result = await pool.query(
            `DELETE FROM repayments WHERE id = $1 AND user_id = $2 RETURNING *`,
            [id, userId]
        );
        return result.rows[0] || null;
    } catch (error) {
        handleRepaymentError('deleteRepayment', error);
    }
};

// --- HELPER FOR TOTAL PAID (Filtered by User) ---
export const getTotalPaidForLoan = async (loan_id, userId) => {
    try {
        const result = await pool.query(
            `SELECT COALESCE(SUM(amount_paid), 0) AS total_paid
             FROM repayments
             WHERE loan_id = $1 AND user_id = $2`,
            [loan_id, userId]
        );
        return parseFloat(result.rows[0].total_paid);
    } catch (error) {
        handleRepaymentError('getTotalPaidForLoan', error);
    }
};

// --- READ SINGLE BY ID (Secure check for owner) ---
export const getRepaymentById = async (id, userId) => {
    try {
        const result = await pool.query(
            `SELECT 
                r.*, 
                a.full_name as applicant_name 
             FROM repayments r
             JOIN loans l ON r.loan_id = l.id
             JOIN applicants a ON l.applicant_id = a.id
             WHERE r.id = $1 AND r.user_id = $2`,
            [id, userId]
        );
        return result.rows[0] || null;
    } catch (error) {
        handleRepaymentError('getRepaymentById', error);
    }
};

to