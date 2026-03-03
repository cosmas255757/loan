/**
 * Dashboard JavaScript - Fully Synced with Backend
 */

// Updated to match your router.get('/dashboard', ...) path
// This assumes your main server mounts the stats router at /api/stats
const STATS_API = '/api/stats/dashboard'; 

/**
 * FETCH AND DISPLAY DASHBOARD DATA
 */
async function loadDashboard() {
    try {
        const res = await fetch(STATS_API);
        
        // Handle HTTP errors (e.g., 404 or 500)
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        
        // Check for the success flag sent by your controller
        if (!result.success || !result.data) {
            console.error("API returned success:false or empty data");
            return;
        }

        /**
         * FIX: Your model already returns "stats.rows[0]".
         * result.data is now the object itself, NOT an array.
         */
        const data = result.data; 

        // 1. Update Core KPIs (matching SQL keys)
        document.getElementById('totalApplicants').innerText = data.total_applicants || 0;
        document.getElementById('activeLoans').innerText = data.active_loans_count || 0;
        
        // 2. Format and Update Currency Values
        document.getElementById('totalLoanValue').innerText = 
            formatCurrency(data.total_loan_value);
        
        document.getElementById('totalBalance').innerText = 
            formatCurrency(data.total_outstanding_balance);

        // 3. Update Time-based Performance (matching SQL aliases)
        document.getElementById('repaidToday').innerText = 
            formatCurrency(data.repaid_today);
        
        document.getElementById('repaidWeek').innerText = 
            formatCurrency(data.repaid_this_week);
        
        document.getElementById('repaidMonth').innerText = 
            formatCurrency(data.repaid_this_month);

    } catch (err) {
        console.error("Dashboard failed to load:", err);
    }
}

/**
 * HELPER: Format numbers to TZS Currency
 * Handles the fact that PostgreSQL returns SUM/COUNT as strings
 */
function formatCurrency(value) {
    const amount = parseFloat(value || 0);
    return 'TSh ' + amount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

// Initial Load when the page is ready
document.addEventListener('DOMContentLoaded', loadDashboard);
