import pool from '../config/db.js';

/**
 * Helper to log and throw DB errors
 */
const handleDbError = (operation, error) => {
    console.error(`Database Error during ${operation}:`, error.message);
    throw error;
};

// create a new applicant..
export const createApplicant = async (
    full_name, 
    phone, 
    living_location, 
    occupation, 
    sex, 
    relationship_status
) => {
    try {
        const result = await pool.query(
            `INSERT INTO applicants (
                full_name, 
                phone, 
                living_location, 
                occupation, 
                sex, 
                relationship_status
             )
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [full_name, phone, living_location, occupation, sex, relationship_status]
        );
        return result.rows[0];
    } catch (error) {
        handleDbError('createApplicant', error);
    }
};

// get all applicants...
export const getAllApplicants = async () => {
    try {
        const result = await pool.query(
            `SELECT * FROM applicants
             ORDER BY id DESC`
        );
        return result.rows;
    } catch (error) {
        handleDbError('getAllApplicants', error);
    }
};

export const getApplicantById = async (id) => {
    try {
        const result = await pool.query(
            `SELECT * FROM applicants
             WHERE id = $1`,
            [id]
        );
        // Returns null if no applicant found, which is easier to check in your routes
        return result.rows[0] || null;
    } catch (error) {
        handleDbError('getApplicantById', error);
    }
};


export const updateApplicant = async (id, full_name, phone, living_location, occupation, sex, relationship_status) => {
    try {
        const result = await pool.query(
            `UPDATE applicants 
             SET full_name = $1, 
                 phone = $2, 
                 living_location = $3, 
                 occupation = $4, 
                 sex = $5, 
                 relationship_status = $6
             WHERE id = $7
             RETURNING *`,
            [full_name, phone, living_location, occupation, sex, relationship_status, id]
        );
        return result.rows[0];
    } catch (error) {
        handleDbError('updateApplicant', error);
    }
};


export const deleteApplicant = async (id) => {
    try {
        const result = await pool.query(
            `DELETE FROM applicants
             WHERE id = $1
             RETURNING *`,
            [id]
        );
        return result.rows[0] || null;
    } catch (error) {
        handleDbError('deleteApplicant', error);
    }
};

export const searchApplicantsByName = async (name) => {
    try {
        const result = await pool.query(
            `SELECT * FROM applicants
             WHERE full_name ILIKE $1
             ORDER BY id DESC`,
            [`%${name}%`]
        );
        return result.rows;
    } catch (error) {
        handleDbError('searchApplicantsByName', error);
    }
};
