import pool from '../config/db.js';

const handleDbError = (operation, error) => {
    console.error(`Database Error during ${operation}:`, error.message);
    throw error;
};

// 1. ADDED user_id HERE
export const createApplicant = async (
    full_name, 
    phone, 
    living_location, 
    occupation, 
    sex, 
    relationship_status,
    user_id 
) => {
    try {
        const result = await pool.query(
            `INSERT INTO applicants (
                full_name, phone, living_location, occupation, sex, relationship_status, user_id
             )
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [full_name, phone, living_location, occupation, sex, relationship_status, user_id]
        );
        return result.rows[0];
    } catch (error) {
        handleDbError('createApplicant', error);
    }
};

// 2. FILTER BY user_id so users only see their own data
export const getAllApplicants = async (user_id) => {
    try {
        const result = await pool.query(
            `SELECT * FROM applicants WHERE user_id = $1 ORDER BY id DESC`,
            [user_id]
        );
        return result.rows;
    } catch (error) {
        handleDbError('getAllApplicants', error);
    }
};

// 3. SECURE BY user_id
export const getApplicantById = async (id, user_id) => {
    try {
        const result = await pool.query(
            `SELECT * FROM applicants WHERE id = $1 AND user_id = $2`,
            [id, user_id]
        );
        return result.rows[0] || null;
    } catch (error) {
        handleDbError('getApplicantById', error);
    }
};

export const updateApplicant = async (id, full_name, phone, living_location, occupation, sex, relationship_status, user_id) => {
    try {
        const result = await pool.query(
            `UPDATE applicants 
             SET full_name = $1, phone = $2, living_location = $3, 
                 occupation = $4, sex = $5, relationship_status = $6
             WHERE id = $7 AND user_id = $8
             RETURNING *`,
            [full_name, phone, living_location, occupation, sex, relationship_status, id, user_id]
        );
        return result.rows[0];
    } catch (error) {
        handleDbError('updateApplicant', error);
    }
};

export const deleteApplicant = async (id, user_id) => {
    try {
        const result = await pool.query(
            `DELETE FROM applicants WHERE id = $1 AND user_id = $2 RETURNING *`,
            [id, user_id]
        );
        return result.rows[0] || null;
    } catch (error) {
        handleDbError('deleteApplicant', error);
    }
};

export const searchApplicantsByName = async (name, user_id) => {
    try {
        const result = await pool.query(
            `SELECT * FROM applicants WHERE full_name ILIKE $1 AND user_id = $2 ORDER BY id DESC`,
            [`%${name}%`, user_id]
        );
        return result.rows;
    } catch (error) {
        handleDbError('searchApplicantsByName', error);
    }
};
