import pool from '../config/db.js';

// Pass userId as an argument to the function
export const getDashboardStats = async (userId) => {
    try {
        const stats = await pool.query(`
            SELECT 
                -- 1. Total loaned this year (Filtered by user_id)
                (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE user_id = $1 AND status = 'approved' AND created_at >= DATE_TRUNC('year', CURRENT_DATE)) as loaned_this_year,
                
                -- 2. Total loaned this month (Filtered by user_id)
                (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE user_id = $1 AND status = 'approved' AND created_at >= DATE_TRUNC('month', CURRENT_DATE)) as loaned_this_month,
                
                -- 3. Total loaned this week (Filtered by user_id)
                (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE user_id = $1 AND status = 'approved' AND created_at >= DATE_TRUNC('week', CURRENT_DATE)) as loaned_this_week,
                
                -- 4. Total loaned today (Filtered by user_id)
                (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE user_id = $1 AND status = 'approved' AND created_at::date = CURRENT_DATE) as loaned_today,

                -- 5. Total collected this year (Filtered by user_id)
                (SELECT COALESCE(SUM(amount_paid), 0) FROM repayments WHERE user_id = $1 AND payment_date >= DATE_TRUNC('year', CURRENT_DATE)) as collected_this_year,
                
                -- 6. Total collected this month (Filtered by user_id)
                (SELECT COALESCE(SUM(amount_paid), 0) FROM repayments WHERE user_id = $1 AND payment_date >= DATE_TRUNC('month', CURRENT_DATE)) as collected_this_month,
                
                -- 7. Total collected this week (Filtered by user_id)
                (SELECT COALESCE(SUM(amount_paid), 0) FROM repayments WHERE user_id = $1 AND payment_date >= DATE_TRUNC('week', CURRENT_DATE)) as collected_this_week,
                
                -- 8. Total collected today (Filtered by user_id)
                (SELECT COALESCE(SUM(amount_paid), 0) FROM repayments WHERE user_id = $1 AND payment_date = CURRENT_DATE) as collected_today,

                -- 9. Total number of applicants (Filtered by user_id)
                (SELECT COUNT(*) FROM applicants WHERE user_id = $1) as total_applicants,

                -- 10. Total number of applicants who loans are pending (Filtered by user_id)
                (SELECT COUNT(*) FROM loans WHERE user_id = $1 AND status = 'pending') as pending_loans_count,

                -- 11. Total number of applicants who loans are approved/in progress (Filtered by user_id)
                (SELECT COUNT(*) FROM loans WHERE user_id = $1 AND status = 'approved') as active_loans_count,

                -- 12. Total amount to collect (Filtered by user_id)
                (
                  (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE user_id = $1 AND status = 'approved') - 
                  (SELECT COALESCE(SUM(amount_paid), 0) FROM repayments WHERE user_id = $1)
                ) as total_outstanding_balance,

                -- 13. Total monthly profit (Filtered by user_id)
                (
                  (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE user_id = $1 AND status = 'approved' AND created_at >= DATE_TRUNC('month', CURRENT_DATE)) * 0.2
                ) as estimated_monthly_profit
        `, [userId]); // $1 is replaced by userId here

        return stats.rows[0];
    } catch (error) {
        console.error("Dashboard Stats Error:", error.message);
        throw error;
    }
};
