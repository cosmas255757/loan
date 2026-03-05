import {
    createApplicant,
    getAllApplicants,
    getApplicantById,
    updateApplicant,
    deleteApplicant,
    searchApplicantsByName
} from '../models/applicantModel.js';

const sendSuccess = (res, data, status = 200) => res.status(status).json(data);

const sendError = (res, error) => {
    console.error("Controller Error:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
};

export const addApplicant = async (req, res) => {
    try {
        const { full_name, phone, living_location, occupation, sex, relationship_status } = req.body;
        const userId = req.user.id; // <--- CRITICAL: Get from Auth Middleware

        if (!full_name || !phone) {
            return res.status(400).json({ message: "Full name and phone are required" });
        }

        const applicant = await createApplicant(
            full_name, phone, living_location, occupation, sex, relationship_status, userId
        );

        sendSuccess(res, { message: "Applicant created successfully", applicant }, 201);
    } catch (error) {
        sendError(res, error);
    }
};

export const listApplicants = async (req, res) => {
    try {
        const userId = req.user.id; // <--- Filter by owner
        const applicants = await getAllApplicants(userId);
        sendSuccess(res, applicants);
    } catch (error) {
        sendError(res, error);
    }
};

export const getApplicant = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const applicant = await getApplicantById(id, userId);

        if (!applicant) {
            return res.status(404).json({ message: "Applicant not found or unauthorized" });
        }

        sendSuccess(res, applicant);
    } catch (error) {
        sendError(res, error);
    }
};

export const editApplicant = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { full_name, phone, living_location, occupation, sex, relationship_status } = req.body;

        const updated = await updateApplicant(
            id, full_name, phone, living_location, occupation, sex, relationship_status, userId
        );

        if (!updated) {
            return res.status(404).json({ message: "Applicant not found or unauthorized" });
        }

        sendSuccess(res, { message: "Updated successfully", applicant: updated });
    } catch (error) {
        sendError(res, error);
    }
};

export const removeApplicant = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const deleted = await deleteApplicant(id, userId);

        if (!deleted) {
            return res.status(404).json({ message: "Cannot delete: Not found or unauthorized" });
        }

        sendSuccess(res, { message: "Applicant deleted successfully", deleted });
    } catch (error) {
        sendError(res, error);
    }
};

export const searchApplicants = async (req, res) => {
    try {
        const { name } = req.query;
        const userId = req.user.id;

        if (!name) return res.status(400).json({ message: "Provide a name" });

        const results = await searchApplicantsByName(name, userId);
        sendSuccess(res, { count: results.length, results });
    } catch (error) {
        sendError(res, error);
    }
};
