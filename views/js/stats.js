/**
 * Dashboard JavaScript - Fully Synced with 13 Backend Logics & Multi-User Auth
 */

const STATS_API = '/api/stats/dashboard'; 

/**
 * FETCH AND DISPLAY DASHBOARD DATA
 */
async function loadDashboard() {
    // 1. Get the token saved during login
    const token = localStorage.getItem('token');

    // 2. Redirect to login if not authenticated
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // 3. Send the token in the Authorization header
        const res = await fetch(STATS_API, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (res.status === 401 || res.status === 403) {
            // Token expired or invalid
            localStorage.removeItem('token');
            window.location.href = 'login.html';
            return;
        }

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        
        if (!result.success || !result.data) {
            console.error("API returned success:false or empty data");
            return;
        }

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
        document.getElementById('collected_week').innerText = formatCurrency(data.collected_this_week); 
        document.getElementById('collected_month').innerText = formatCurrency(data.collected_this_month); 
        document.getElementById('collected_year').innerText = formatCurrency(data.collected_this_year); 

        // --- 4. FINANCIAL CALCULATIONS ---
        document.getElementById('total_outstanding_balance').innerText = formatCurrency(data.total_outstanding_balance);
        document.getElementById('estimated_monthly_profit').innerText = formatCurrency(data.estimated_monthly_profit);

    } catch (err) {
        console.error("Dashboard failed to load:", err);
    }
}

/**
 * HELPER: Format numbers to TZS Currency
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
