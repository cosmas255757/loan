import {
    createLoan,
    getAllLoans,
    getLoanById,
    getLoansByApplicant,
    updateLoan,
    deleteLoan,
    searchLoansByStatus
} from '../models/loanModel.js';

// Success helper
const sendSuccess = (res, data, status = 200) => res.status(status).json(data);

// Error helper
const sendError = (res, error) => {
    console.error("Loan Controller Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
};

export const addLoan = async (req, res) => {
    try {
        const { applicant_id, amount } = req.body;

        if (!applicant_id || !amount) {
            return res.status(400).json({ message: "Applicant ID and Amount are required" });
        }

        const loan = await createLoan(applicant_id, amount);
        sendSuccess(res, { message: "Loan created successfully", loan }, 201);
    } catch (error) {
        sendError(res, error);
    }
};

export const listLoans = async (req, res) => {
    try {
        const loans = await getAllLoans();
        sendSuccess(res, loans);
    } catch (error) {
        sendError(res, error);
    }
};

export const getLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const loan = await getLoanById(id);

        if (!loan) {
            return res.status(404).json({ message: `Loan ID ${id} not found` });
        }

        sendSuccess(res, loan);
    } catch (error) {
        sendError(res, error);
    }
};

export const listLoansByApplicant = async (req, res) => {
    try {
        const { applicant_id } = req.params;
        const loans = await getLoansByApplicant(applicant_id);
        sendSuccess(res, { count: loans.length, loans });
    } catch (error) {
        sendError(res, error);
    }
};

export const editLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, status } = req.body;

        if (!amount || !status) {
            return res.status(400).json({ message: "Amount and Status are required for update" });
        }

        const updated = await updateLoan(id, amount, status);

        if (!updated) {
            return res.status(404).json({ message: "Loan not found" });
        }

        sendSuccess(res, { message: "Loan updated", updated });
    } catch (error) {
        sendError(res, error);
    }
};

export const removeLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteLoan(id);

        if (!deleted) {
            return res.status(404).json({ message: "Cannot delete: Loan not found" });
        }

        sendSuccess(res, { message: "Loan deleted successfully", deleted });
    } catch (error) {
        sendError(res, error);
    }
};

export const searchLoans = async (req, res) => {
    try {
        const { status } = req.query;

        if (!status) {
            return res.status(400).json({ message: "Status query parameter is required" });
        }

        const results = await searchLoansByStatus(status);
        sendSuccess(res, { count: results.length, results });
    } catch (error) {
        sendError(res, error);
    }
};
