import {
    createApplicant,
    getAllApplicants,
    getApplicantById,
    updateApplicant,
    deleteApplicant,
    searchApplicantsByName
} from '../models/applicantModel.js';

// Success helper to keep responses consistent
const sendSuccess = (res, data, status = 200) => res.status(status).json(data);

// Error helper to reduce repetitive code
const sendError = (res, error) => {
    console.error("Controller Error:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
};
export const addApplicant = async (req, res) => {
    try {
        const { 
            full_name, 
            phone, 
            living_location, 
            occupation, 
            sex, 
            relationship_status 
        } = req.body;

        // Validation: Check for required fields
        if (!full_name || !phone) {
            return res.status(400).json({ message: "Full name and phone are required" });
        }

        // Pass all fields to the model function
        const applicant = await createApplicant(
            full_name, 
            phone, 
            living_location, 
            occupation, 
            sex, 
            relationship_status
        );

        sendSuccess(res, { message: "Applicant created successfully", applicant }, 201);
    } catch (error) {
        // If the database CHECK constraint fails (e.g., wrong 'sex' value), 
        // sendError will catch it here.
        sendError(res, error);
    }
};


export const listApplicants = async (req, res) => {
    try {
        const applicants = await getAllApplicants();
        sendSuccess(res, applicants);
    } catch (error) {
        sendError(res, error);
    }
};

export const getApplicant = async (req, res) => {
    try {
        const { id } = req.params;
        const applicant = await getApplicantById(id);

        if (!applicant) {
            return res.status(404).json({ message: `Applicant with ID ${id} not found` });
        }

        sendSuccess(res, applicant);
    } catch (error) {
        sendError(res, error);
    }
};

export const editApplicant = async (id, full_name, phone, living_location, occupation, sex, relationship_status) => {
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

export const removeApplicant = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteApplicant(id);

        if (!deleted) {
            return res.status(404).json({ message: "Cannot delete: Applicant not found" });
        }

        sendSuccess(res, { message: "Applicant deleted successfully", deleted });
    } catch (error) {
        sendError(res, error);
    }
};

export const searchApplicants = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            // If no search term, maybe just return all? Or error:
            return res.status(400).json({ message: "Please provide a name to search" });
        }

        const results = await searchApplicantsByName(name);
        sendSuccess(res, { count: results.length, results });
    } catch (error) {
        sendError(res, error);
    }
};
