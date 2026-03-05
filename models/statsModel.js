import pool from '../config/db.js';

export const getDashboardStats = async (userId) => {
    try {
        const stats = await pool.query(`
            SELECT 
                -- 1. Total loaned this year (Using 'active' status to match your schema)
                (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE user_id = $1 AND status = 'active' AND created_at >= DATE_TRUNC('year', CURRENT_DATE)) as loaned_this_year,
                
                -- 2. Total loaned this month
                (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE user_id = $1 AND status = 'active' AND created_at >= DATE_TRUNC('month', CURRENT_DATE)) as loaned_this_month,
                
                -- 3. Total loaned this week
                (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE user_id = $1 AND status = 'active' AND created_at >= DATE_TRUNC('week', CURRENT_DATE)) as loaned_this_week,
                
                -- 4. Total loaned today
                (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE user_id = $1 AND status = 'active' AND created_at::date = CURRENT_DATE) as loaned_today,

                -- 5. Total collected this year
                (SELECT COALESCE(SUM(amount_paid), 0) FROM repayments WHERE user_id = $1 AND payment_date >= DATE_TRUNC('year', CURRENT_DATE)) as collected_this_year,
                
                -- 6. Total collected this month
                (SELECT COALESCE(SUM(amount_paid), 0) FROM repayments WHERE user_id = $1 AND payment_date >= DATE_TRUNC('month', CURRENT_DATE)) as collected_this_month,
                
                -- 7. Total collected today
                (SELECT COALESCE(SUM(amount_paid), 0) FROM repayments WHERE user_id = $1 AND payment_date = CURRENT_DATE) as collected_today,

                -- 8. Total counts
                (SELECT COUNT(*) FROM applicants WHERE user_id = $1) as total_applicants,
                (SELECT COUNT(*) FROM loans WHERE user_id = $1 AND status = 'pending') as pending_loans_count,
                (SELECT COUNT(*) FROM loans WHERE user_id = $1 AND status = 'active') as active_loans_count,

                -- 9. Total amount to collect (Outstanding Balance)
                (
                  (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE user_id = $1 AND status = 'active') - 
                  (SELECT COALESCE(SUM(amount_paid), 0) FROM repayments WHERE user_id = $1)
                ) as total_outstanding_balance
        `, [userId]);

        return stats.rows[0];
    } catch (error) {
        console.error("Dashboard Stats Error:", error.message);
        throw error;
    }
};
