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

// --- CREATE ---
export const addLoan = async (req, res) => {
    try {
        const { applicant_id, amount } = req.body;

        if (!applicant_id || !amount) {
            return res.status(400).json({ message: "Applicant ID and Amount are required" });
        }

        const loan = await createLoan(applicant_id, amount);
        // Note: createLoan returns the raw insert; the name join happens on 'list'
        sendSuccess(res, { message: "Loan created successfully", loan }, 201);
    } catch (error) {
        sendError(res, error);
    }
};

// --- LIST ALL (Now includes applicant_name from Model Join) ---
export const listLoans = async (req, res) => {
    try {
        const loans = await getAllLoans();
        // Wrapping in an object for easier frontend parsing
        sendSuccess(res, { count: loans.length, loans });
    } catch (error) {
        sendError(res, error);
    }
};

// --- GET SINGLE ---
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

// --- LIST BY APPLICANT ---
export const listLoansByApplicant = async (req, res) => {
    try {
        const { applicant_id } = req.params;
        const loans = await getLoansByApplicant(applicant_id);
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

        // Validation
        if (amount === undefined || !status) {
            return res.status(400).json({ message: "Amount and Status are required" });
        }

        const updated = await updateLoan(id, amount, status);

        if (!updated) {
            return res.status(404).json({ message: "Loan not found" });
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
        const deleted = await deleteLoan(id);

        if (!deleted) {
            return res.status(404).json({ message: "Cannot delete: Loan not found" });
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

        if (!status) {
            return res.status(400).json({ message: "Status query parameter is required" });
        }

        const results = await searchLoansByStatus(status);
        sendSuccess(res, { count: results.length, loans: results });
    } catch (error) {
        sendError(res, error);
    }
};
