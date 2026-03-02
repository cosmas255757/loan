import pool from '../config/db.js';

/**
 * Helper to log and throw Loan DB errors
 */
const handleLoanError = (operation, error) => {
    console.error(`Loan Database Error [${operation}]:`, error.message);
    throw error;
};

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

export const getAllLoans = async () => {
    try {
        const result = await pool.query(
            `SELECT * FROM loans
             ORDER BY id DESC`
        );
        return result.rows;
    } catch (error) {
        handleLoanError('getAllLoans', error);
    }
};

export const getLoanById = async (id) => {
    try {
        const result = await pool.query(
            `SELECT * FROM loans
             WHERE id = $1`,
            [id]
        );
        return result.rows[0] || null;
    } catch (error) {
        handleLoanError('getLoanById', error);
    }
};

export const getLoansByApplicant = async (applicant_id) => {
    try {
        const result = await pool.query(
            `SELECT * FROM loans
             WHERE applicant_id = $1
             ORDER BY id DESC`,
            [applicant_id]
        );
        return result.rows;
    } catch (error) {
        handleLoanError('getLoansByApplicant', error);
    }
};

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

export const deleteLoan = async (id) => {
    try {
        const result = await pool.query(
            `DELETE FROM loans
             WHERE id = $1
             RETURNING *`,
            [id]
        );
        return result.rows[0] || null;
    } catch (error) {
        handleLoanError('deleteLoan', error);
    }
};

export const searchLoansByStatus = async (status) => {
    try {
        const result = await pool.query(
            `SELECT * FROM loans
             WHERE status ILIKE $1
             ORDER BY id DESC`,
            [`%${status}%`]
        );
        return result.rows;
    } catch (error) {
        handleLoanError('searchLoansByStatus', error);
    }
};
