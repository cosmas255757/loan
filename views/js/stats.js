/**
 * Dashboard JavaScript - Fully Synced with 13 Backend Logics
 */

const STATS_API = '/api/stats/dashboard'; 

/**
 * FETCH AND DISPLAY DASHBOARD DATA
 */
async function loadDashboard() {
    try {
        const res = await fetch(STATS_API);
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        
        if (!result.success || !result.data) {
            console.error("API returned success:false or empty data");
            return;
        }

        // result.data contains our 13 keys from the SQL SELECT statement
        const data = result.data; 

        // --- 1. APPLICANTS & STATUS COUNTS ---
        document.getElementById('total_applicants').innerText = data.total_applicants || 0;
        document.getElementById('pending_loans_count').innerText = data.pending_loans_count || 0;
        document.getElementById('active_loans_count').innerText = data.active_loans_count || 0;

        // --- 2. LOANED AMOUNTS (CAPITAL OUT) ---
        document.getElementById('loaned_today').innerText = formatCurrency(data.loaned_today);
        document.getElementById('loaned_this_week').innerText = formatCurrency(data.loaned_this_week);
        document.getElementById('loaned_this_month').innerText = formatCurrency(data.loaned_this_month);
        document.getElementById('loaned_this_year').innerText = formatCurrency(data.loaned_this_year);

        // --- 3. COLLECTED AMOUNTS (REPAYMENTS IN) ---
        document.getElementById('collected_today').innerText = formatCurrency(data.collected_today);
        document.getElementById('collected_week').innerText = formatCurrency(data.collected_week);
        document.getElementById('collected_month').innerText = formatCurrency(data.collected_month);
        document.getElementById('collected_year').innerText = formatCurrency(data.collected_year);

        // --- 4. FINANCIAL CALCULATIONS ---
        // Total amount still needed to be collected
        document.getElementById('total_outstanding_balance').innerText = formatCurrency(data.total_outstanding_balance);
        
        // Logic 13: Monthly Profit Projection (20% of monthly loaned)
        document.getElementById('estimated_monthly_profit').innerText = formatCurrency(data.estimated_monthly_profit);

    } catch (err) {
        console.error("Dashboard failed to load:", err);
        // Optional: Update UI to show error state
    }
}

/**
 * HELPER: Format numbers to TZS Currency
 * PostgreSQL returns SUM/COUNT as strings, so parseFloat is required
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
