import pool from '../config/db.js';

export const getDashboardStats = async () => {
    try {
        const stats = await pool.query(`
            SELECT 
                -- 1. Total Applicants
                (SELECT COUNT(*) FROM applicants) as total_applicants,

                -- 2. Total Approved/Active Loans
                (SELECT COUNT(*) FROM loans WHERE status = 'approved') as active_loans_count,
                (SELECT SUM(amount) FROM loans WHERE status = 'approved') as total_loan_value,

                -- 3. Total Money Left to Collect (Balance)
                (
                  (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE status = 'approved') - 
                  (SELECT COALESCE(SUM(amount_paid), 0) FROM repayments)
                ) as total_outstanding_balance,

                -- 4. Repayments (Time-based)
                (SELECT COALESCE(SUM(amount_paid), 0) FROM repayments WHERE payment_date = CURRENT_DATE) as repaid_today,
                (SELECT COALESCE(SUM(amount_paid), 0) FROM repayments WHERE payment_date >= DATE_TRUNC('week', CURRENT_DATE)) as repaid_this_week,
                (SELECT COALESCE(SUM(amount_paid), 0) FROM repayments WHERE payment_date >= DATE_TRUNC('month', CURRENT_DATE)) as repaid_this_month
        `);
        return stats.rows[0];
    } catch (error) {
        console.error("Dashboard Stats Error:", error.message);
        throw error;
    }
};
