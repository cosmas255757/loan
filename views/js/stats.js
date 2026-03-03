const STATS_API = '/api/stats';

/**
 * FETCH AND DISPLAY DASHBOARD DATA
 */
async function loadDashboard() {
    try {
        const res = await fetch(STATS_API);
        const result = await res.json();
        
        // Ensure data exists before mapping
        if (!result.success || !result.data) {
            console.error("No data received from API");
            return;
        }

        // The model returns an array, we take the first row [0]
        const data = result.data[0]; 

        // 1. Update Core KPIs
        document.getElementById('totalApplicants').innerText = data.total_applicants || 0;
        document.getElementById('activeLoans').innerText = data.active_loans_count || 0;
        
        // 2. Format and Update Currency Values
        document.getElementById('totalLoanValue').innerText = 
            formatCurrency(data.total_loan_value);
        
        document.getElementById('totalBalance').innerText = 
            formatCurrency(data.total_outstanding_balance);

        // 3. Update Time-based Performance
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
 */
function formatCurrency(value) {
    const amount = parseFloat(value || 0);
    return 'TSh ' + amount.toLocaleString();
}

// Initial Load
document.addEventListener('DOMContentLoaded', loadDashboard);
