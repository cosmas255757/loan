import pool from '../config/db.js';

const handleRepaymentError = (operation, error) => {
    console.error(`Repayment DB Error [${operation}]:`, error.message);
    throw error;
};

// --- READ ALL (With Running Balance Logic) ---
export const getAllRepayments = async () => {
    try {
        const result = await pool.query(
            `SELECT 
                r.id,
                a.full_name as applicant_name,
                r.amount_paid,
                l.amount as original_loan_amount,
                -- CALCULATE RUNNING BALANCE (Amount Left at this specific point in time)
                (l.amount - (
                    SELECT COALESCE(SUM(amount_paid), 0) 
                    FROM repayments 
                    WHERE loan_id = l.id AND id <= r.id
                )) as amount_left,
                r.payment_date,
                -- STATUS: Based on the total paid for the whole loan
                CASE 
                    WHEN (SELECT COALESCE(SUM(amount_paid), 0) FROM repayments WHERE loan_id = l.id) >= l.amount THEN 'paid'
                    WHEN (SELECT COALESCE(SUM(amount_paid), 0) FROM repayments WHERE loan_id = l.id) > 0 THEN 'inprogress'
                    ELSE 'loading'
                END as status
             FROM repayments r
             JOIN loans l ON r.loan_id = l.id
             JOIN applicants a ON l.applicant_id = a.id
             ORDER BY r.id DESC`
        );
        return result.rows;
    } catch (error) {
        handleRepaymentError('getAllRepayments', error);
    }
};

// --- READ BY ID ---
export const getRepaymentById = async (id) => {
    try {
        const result = await pool.query(
            `SELECT r.*, a.full_name as applicant_name 
             FROM repayments r
             JOIN loans l ON r.loan_id = l.id
             JOIN applicants a ON l.applicant_id = a.id
             WHERE r.id = $1`,
            [id]
        );
        return result.rows[0] || null;
    } catch (error) {
        handleRepaymentError('getRepaymentById', error);
    }
};

// --- READ BY LOAN (Required by Controller) ---
export const getRepaymentsByLoan = async (loan_id) => {
    try {
        const result = await pool.query(
            `SELECT 
                r.id,
                a.full_name as applicant_name,
                r.amount_paid,
                (l.amount - (SELECT COALESCE(SUM(amount_paid), 0) FROM repayments WHERE loan_id = l.id AND id <= r.id)) as amount_left,
                r.payment_date,
                CASE 
                    WHEN (SELECT SUM(amount_paid) FROM repayments WHERE loan_id = l.id) >= l.amount THEN 'paid'
                    ELSE 'inprogress'
                END as status
             FROM repayments r
             JOIN loans l ON r.loan_id = l.id
             JOIN applicants a ON l.applicant_id = a.id
             WHERE r.loan_id = $1
             ORDER BY r.id DESC`,
            [loan_id]
        );
        return result.rows;
    } catch (error) {
        handleRepaymentError('getRepaymentsByLoan', error);
    }
};

// --- CREATE ---
export const createRepayment = async (loan_id, amount_paid, payment_date) => {
    try {
        const result = await pool.query(
            `INSERT INTO repayments (loan_id, amount_paid, payment_date)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [loan_id, amount_paid, payment_date]
        );
        return result.rows[0];
    } catch (error) {
        handleRepaymentError('createRepayment', error);
    }
};

// --- UPDATE ---
export const updateRepayment = async (id, amount_paid, payment_date) => {
    try {
        const result = await pool.query(
            `UPDATE repayments
             SET amount_paid = $1,
                 payment_date = $2
             WHERE id = $3
             RETURNING *`,
            [amount_paid, payment_date, id]
        );
        return result.rows[0] || null;
    } catch (error) {
        handleRepaymentError('updateRepayment', error);
    }
};

// --- DELETE ---
export const deleteRepayment = async (id) => {
    try {
        const result = await pool.query(
            `DELETE FROM repayments WHERE id = $1 RETURNING *`,
            [id]
        );
        return result.rows[0] || null;
    } catch (error) {
        handleRepaymentError('deleteRepayment', error);
    }
};

// --- HELPER FOR TOTAL PAID ---
export const getTotalPaidForLoan = async (loan_id) => {
    try {
        const result = await pool.query(
            `SELECT COALESCE(SUM(amount_paid), 0) AS total_paid
             FROM repayments
             WHERE loan_id = $1`,
            [loan_id]
        );
        return parseFloat(result.rows[0].total_paid);
    } catch (error) {
        handleRepaymentError('getTotalPaidForLoan', error);
    }
};
