import {
    createLoan,
    getAllLoans,
    getLoanById,
    getLoansByApplicant,
    updateLoan,
    deleteLoan,
    searchLoansByStatus
} from '../models/loanModel.js';

const sendSuccess = (res, data, status = 200) => res.status(status).json(data);

const sendError = (res, error) => {
    console.error("Loan Controller Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
};

// --- CREATE ---
export const addLoan = async (req, res) => {
    try {
        const { applicant_id, amount } = req.body;
        const userId = req.user.id; // <--- Mandatory for data ownership

        if (!applicant_id || !amount) {
            return res.status(400).json({ message: "Applicant ID and Amount are required" });
        }

        // Pass userId to the model
        const loan = await createLoan(applicant_id, amount, userId);
        sendSuccess(res, { message: "Loan created successfully", loan }, 201);
    } catch (error) {
        sendError(res, error);
    }
};

// --- LIST ALL (Filters by user) ---
export const listLoans = async (req, res) => {
    try {
        const userId = req.user.id;
        const loans = await getAllLoans(userId);
        sendSuccess(res, { count: loans.length, loans });
    } catch (error) {
        sendError(res, error);
    }
};

// --- GET SINGLE ---
export const getLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const loan = await getLoanById(id, userId);

        if (!loan) {
            return res.status(404).json({ message: "Loan not found or unauthorized" });
        }

        sendSuccess(res, loan);
    } catch (error) {
        sendError(res, error);
    }
};

// --- LIST BY APPLICANT ---
export const listLoansByApplicant = async (req, res) => {
    try {
        const { applicant_id } = req.params;
        const userId = req.user.id;
        const loans = await getLoansByApplicant(applicant_id, userId);
        sendSuccess(res, { count: loans.length, loans });
    } catch (error) {
        sendError(res, error);
    }
};

// --- UPDATE ---
export const editLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, status } = req.body;
        const userId = req.user.id;

        if (amount === undefined || !status) {
            return res.status(400).json({ message: "Amount and Status are required" });
        }

        const updated = await updateLoan(id, amount, status, userId);

        if (!updated) {
            return res.status(404).json({ message: "Loan not found or unauthorized" });
        }

        sendSuccess(res, { message: "Loan updated successfully", loan: updated });
    } catch (error) {
        sendError(res, error);
    }
};

// --- DELETE ---
export const removeLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const deleted = await deleteLoan(id, userId);

        if (!deleted) {
            return res.status(404).json({ message: "Cannot delete: Not found or unauthorized" });
        }

        sendSuccess(res, { message: "Loan deleted successfully", deleted });
    } catch (error) {
        sendError(res, error);
    }
};

// --- SEARCH BY STATUS ---
export const searchLoans = async (req, res) => {
    try {
        const { status } = req.query;
        const userId = req.user.id;

        if (!status) return res.status(400).json({ message: "Status required" });

        const results = await searchLoansByStatus(status, userId);
        sendSuccess(res, { count: results.length, loans: results });
    } catch (error) {
        sendError(res, error);
    }
};
