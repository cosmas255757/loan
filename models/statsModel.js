import pool from '../config/db.js';

export const getDashboardStats = async () => {
    try {
        const stats = await pool.query(`
            SELECT 
                -- 1. Total loaned this year
                (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE status = 'approved' AND created_at >= DATE_TRUNC('year', CURRENT_DATE)) as loaned_this_year,
                
                -- 2. Total loaned this month
                (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE status = 'approved' AND created_at >= DATE_TRUNC('month', CURRENT_DATE)) as loaned_this_month,
                
                -- 3. Total loaned this week (Mon-Sun)
                (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE status = 'approved' AND created_at >= DATE_TRUNC('week', CURRENT_DATE)) as loaned_this_week,
                
                -- 4. Total loaned today
                (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE status = 'approved' AND created_at::date = CURRENT_DATE) as loaned_today,

                -- 5. Total collected this year
                (SELECT COALESCE(SUM(amount_paid), 0) FROM repayments WHERE payment_date >= DATE_TRUNC('year', CURRENT_DATE)) as collected_this_year,
                
                -- 6. Total collected this month
                (SELECT COALESCE(SUM(amount_paid), 0) FROM repayments WHERE payment_date >= DATE_TRUNC('month', CURRENT_DATE)) as collected_this_month,
                
                -- 7. Total collected this week (Mon-Sun)
                (SELECT COALESCE(SUM(amount_paid), 0) FROM repayments WHERE payment_date >= DATE_TRUNC('week', CURRENT_DATE)) as collected_this_week,
                
                -- 8. Total collected today
                (SELECT COALESCE(SUM(amount_paid), 0) FROM repayments WHERE payment_date = CURRENT_DATE) as collected_today,

                -- 9. Total number of applicants
                (SELECT COUNT(*) FROM applicants) as total_applicants,

                -- 10. Total number of applicants who loans are pending
                (SELECT COUNT(*) FROM loans WHERE status = 'pending') as pending_loans_count,

                -- 11. Total number of applicants who loans are approved/in progress
                (SELECT COUNT(*) FROM loans WHERE status = 'approved') as active_loans_count,

                -- 12. Total amount I need to collect from inprogress loans (Principal - Paid)
                (
                  (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE status = 'approved') - 
                  (SELECT COALESCE(SUM(amount_paid), 0) FROM repayments)
                ) as total_outstanding_balance,

                -- 13. Total monthly profit (This month amount loaned * 0.2)
                (
                  (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE status = 'approved' AND created_at >= DATE_TRUNC('month', CURRENT_DATE)) * 0.2
                ) as estimated_monthly_profit
        `);

        return stats.rows[0];
    } catch (error) {
        console.error("Dashboard Stats Error:", error.message);
        throw error;
    }
};
