import pool from '../config/db.js';

const handleRepaymentError = (operation, error) => {
    console.error(`Repayment DB Error [${operation}]:`, error.message);
    throw error;
};

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

export const getAllRepayments = async () => {
    try {
        const result = await pool.query(
            `SELECT * FROM repayments ORDER BY id DESC`
        );
        return result.rows;
    } catch (error) {
        handleRepaymentError('getAllRepayments', error);
    }
};

export const getRepaymentById = async (id) => {
    try {
        const result = await pool.query(
            `SELECT * FROM repayments WHERE id = $1`,
            [id]
        );
        return result.rows[0] || null;
    } catch (error) {
        handleRepaymentError('getRepaymentById', error);
    }
};

export const getRepaymentsByLoan = async (loan_id) => {
    try {
        const result = await pool.query(
            `SELECT * FROM repayments
             WHERE loan_id = $1
             ORDER BY payment_date DESC`,
            [loan_id]
        );
        return result.rows;
    } catch (error) {
        handleRepaymentError('getRepaymentsByLoan', error);
    }
};

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

export const getTotalPaidForLoan = async (loan_id) => {
    try {
        const result = await pool.query(
            `SELECT COALESCE(SUM(amount_paid), 0) AS total_paid
             FROM repayments
             WHERE loan_id = $1`,
            [loan_id]
        );
        // Returns just the number for easier math in the controller
        return parseFloat(result.rows[0].total_paid);
    } catch (error) {
        handleRepaymentError('getTotalPaidForLoan', error);
    }
};
