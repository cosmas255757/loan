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
        const { full_name, phone } = req.body;

        // Basic Validation
        if (!full_name || !phone) {
            return res.status(400).json({ message: "Full name and phone are required" });
        }

        const applicant = await createApplicant(full_name, phone);
        sendSuccess(res, { message: "Applicant created", applicant }, 201);
    } catch (error) {
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

export const editApplicant = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, phone } = req.body;

        if (!full_name || !phone) {
            return res.status(400).json({ message: "Update failed: Missing name or phone" });
        }

        const updated = await updateApplicant(id, full_name, phone);

        if (!updated) {
            return res.status(404).json({ message: "Applicant not found" });
        }

        sendSuccess(res, { message: "Updated successfully", updated });
    } catch (error) {
        sendError(res, error);
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
