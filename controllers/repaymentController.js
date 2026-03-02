import {
    createRepayment,
    getAllRepayments,
    getRepaymentById,
    getRepaymentsByLoan,
    updateRepayment,
    deleteRepayment,
    getTotalPaidForLoan
} from '../models/repaymentModel.js';

// Helpers
const sendSuccess = (res, data, status = 200) => res.status(status).json(data);
const sendError = (res, error) => {
    console.error("Repayment Controller Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
};

export const addRepayment = async (req, res) => {
    try {
        const { loan_id, amount_paid, payment_date } = req.body;

        if (!loan_id || !amount_paid || !payment_date) {
            return res.status(400).json({ message: "Loan ID, Amount, and Date are required" });
        }

        const repayment = await createRepayment(loan_id, amount_paid, payment_date);
        
        // Get new total to show progress
        const totalPaid = await getTotalPaidForLoan(loan_id);

        sendSuccess(res, { 
            message: "Repayment recorded successfully", 
            repayment,
            total_paid_to_date: totalPaid 
        }, 201);
    } catch (error) {
        sendError(res, error);
    }
};

export const listRepayments = async (req, res) => {
    try {
        const repayments = await getAllRepayments();
        sendSuccess(res, repayments);
    } catch (error) {
        sendError(res, error);
    }
};

export const getRepayment = async (req, res) => {
    try {
        const { id } = req.params;
        const repayment = await getRepaymentById(id);

        if (!repayment) {
            return res.status(404).json({ message: "Repayment record not found" });
        }

        sendSuccess(res, repayment);
    } catch (error) {
        sendError(res, error);
    }
};

export const listRepaymentsByLoan = async (req, res) => {
    try {
        const { loan_id } = req.params;
        const repayments = await getRepaymentsByLoan(loan_id);
        const total = await getTotalPaidForLoan(loan_id);

        sendSuccess(res, { 
            loan_id,
            count: repayments.length, 
            total_paid: total,
            history: repayments 
        });
    } catch (error) {
        sendError(res, error);
    }
};

export const editRepayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount_paid, payment_date } = req.body;

        const updated = await updateRepayment(id, amount_paid, payment_date);

        if (!updated) {
            return res.status(404).json({ message: "Repayment record not found" });
        }

        sendSuccess(res, { message: "Repayment updated", updated });
    } catch (error) {
        sendError(res, error);
    }
};

export const removeRepayment = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteRepayment(id);

        if (!deleted) {
            return res.status(404).json({ message: "Cannot delete: Record not found" });
        }

        sendSuccess(res, { message: "Repayment deleted", deleted });
    } catch (error) {
        sendError(res, error);
    }
};
