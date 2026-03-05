import {
    createRepayment,
    getAllRepayments,
    getRepaymentById,
    getRepaymentsByLoan,
    updateRepayment,
    deleteRepayment,
    getTotalPaidForLoan
} from '../models/repaymentModel.js';

const sendSuccess = (res, data, status = 200) => res.status(status).json(data);
const sendError = (res, error) => {
    console.error("Repayment Controller Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
};

export const addRepayment = async (req, res) => {
    try {
        const { loan_id, amount_paid, payment_date } = req.body;
        const userId = req.user.id; // <--- Critical for security

        if (!loan_id || !amount_paid || !payment_date) {
            return res.status(400).json({ message: "Loan ID, Amount, and Date are required" });
        }

        const repayment = await createRepayment(loan_id, amount_paid, payment_date, userId);
        const totalPaid = await getTotalPaidForLoan(loan_id, userId);

        sendSuccess(res, { message: "Repayment recorded", repayment, total_paid_to_date: totalPaid }, 201);
    } catch (error) {
        sendError(res, error);
    }
};

export const listRepayments = async (req, res) => {
    try {
        const userId = req.user.id;
        const repayments = await getAllRepayments(userId);
        sendSuccess(res, { count: repayments.length, repayments });
    } catch (error) {
        sendError(res, error);
    }
};

export const getRepayment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const repayment = await getRepaymentById(id, userId);

        if (!repayment) {
            return res.status(404).json({ message: "Repayment not found or unauthorized" });
        }
        sendSuccess(res, repayment);
    } catch (error) {
        sendError(res, error);
    }
};

export const listRepaymentsByLoan = async (req, res) => {
    try {
        const { loan_id } = req.params;
        const userId = req.user.id;
        const history = await getRepaymentsByLoan(loan_id, userId);
        const total = await getTotalPaidForLoan(loan_id, userId);

        sendSuccess(res, { loan_id, count: history.length, total_paid: total, history });
    } catch (error) {
        sendError(res, error);
    }
};

export const editRepayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount_paid, payment_date } = req.body;
        const userId = req.user.id;

        const updated = await updateRepayment(id, amount_paid, payment_date, userId);
        if (!updated) return res.status(404).json({ message: "Not found or unauthorized" });

        sendSuccess(res, { message: "Repayment updated", repayment: updated });
    } catch (error) {
        sendError(res, error);
    }
};

export const removeRepayment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const deleted = await deleteRepayment(id, userId);

        if (!deleted) return res.status(404).json({ message: "Not found or unauthorized" });
        sendSuccess(res, { message: "Repayment deleted", deleted });
    } catch (error) {
        sendError(res, error);
    }
};
