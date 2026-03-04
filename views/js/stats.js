/**
 * Dashboard JavaScript - Fully Synced with HTML and Backend Model
 */

const API_URL = '/api/stats/dashboard';

async function fetchDashboardStats() {
    const token = localStorage.getItem('token');

    // 1. Security Check: Redirect if no token
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // 2. Handle Session Expiry
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
            return;
        }

        const result = await response.json();

        if (result.success) {
            const data = result.data;

            // Helper to format currency
            const fmt = (val) => 'TSh ' + parseFloat(val || 0).toLocaleString('en-US');

            // --- SECTION 1: SYSTEM STATUS & COUNTS ---
            document.getElementById('total_applicants').innerText = data.total_applicants || 0;
            document.getElementById('pending_loans_count').innerText = data.pending_loans_count || 0;
            document.getElementById('active_loans_count').innerText = data.active_loans_count || 0;
            document.getElementById('total_outstanding_balance').innerText = fmt(data.total_outstanding_balance);

            // --- SECTION 2: CAPITAL ISSUED (LOANED) ---
            document.getElementById('loaned_today').innerText = fmt(data.loaned_today);
            document.getElementById('loaned_this_week').innerText = fmt(data.loaned_this_week);
            document.getElementById('loaned_this_month').innerText = fmt(data.loaned_this_month);
            document.getElementById('loaned_this_year').innerText = fmt(data.loaned_this_year);

            // --- SECTION 3: REVENUE COLLECTED (REPAYMENTS) ---
            // Note: Mapping backend "collected_this_..." to your HTML "collected_..."
            document.getElementById('collected_today').innerText = fmt(data.collected_today);
            document.getElementById('collected_week').innerText = fmt(data.collected_this_week);
            document.getElementById('collected_month').innerText = fmt(data.collected_this_month);
            document.getElementById('collected_year').innerText = fmt(data.collected_this_year);

            // --- SECTION 4: PROFIT PROJECTION ---
            document.getElementById('estimated_monthly_profit').innerText = fmt(data.estimated_monthly_profit);

        } else {
            console.error("Server Error:", result.message);
        }

    } catch (error) {
        console.error("Connection Error:", error);
    }
}

// Execute on page load
document.addEventListener('DOMContentLoaded', fetchDashboardStats);
