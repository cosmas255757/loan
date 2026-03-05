// 1. SECURITY: Check if user is logged in
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/login';
}

// 2. FETCH DASHBOARD DATA
async function loadDashboardStats() {
    try {
        const response = await fetch('/api/stats/dashboard', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401 || response.status === 403) {
            // Token expired or invalid
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }

        const result = await response.json();

        if (result.success) {
            updateUI(result.data);
        } else {
            console.error("Failed to load stats:", result.message);
        }
    } catch (error) {
        console.error("Network Error:", error);
    }
}

// 3. MAP DATA TO HTML IDs
function updateUI(stats) {
    // Helper to format numbers as TSh currency
    const formatCurrency = (val) => `TSh ${Number(val).toLocaleString()}`;

    // System Counts
    document.getElementById('total_applicants').innerText = stats.total_applicants || 0;
    document.getElementById('pending_loans_count').innerText = stats.pending_loans_count || 0;
    document.getElementById('active_loans_count').innerText = stats.active_loans_count || 0;
    document.getElementById('total_outstanding_balance').innerText = formatCurrency(stats.total_outstanding_balance);

    // Money Loaned (Outgoing)
    document.getElementById('loaned_today').innerText = formatCurrency(stats.loaned_today);
    document.getElementById('loaned_this_week').innerText = formatCurrency(stats.loaned_this_week);
    document.getElementById('loaned_this_month').innerText = formatCurrency(stats.loaned_this_month);
    document.getElementById('loaned_this_year').innerText = formatCurrency(stats.loaned_this_year);

    // Money Collected (Incoming)
    document.getElementById('collected_today').innerText = formatCurrency(stats.collected_today);
    document.getElementById('collected_week').innerText = formatCurrency(stats.collected_this_week || 0);
    document.getElementById('collected_month').innerText = formatCurrency(stats.collected_this_month || 0);
    document.getElementById('collected_year').innerText = formatCurrency(stats.collected_this_year || 0);

    // Profit Projection (Based on 20% of monthly loaning)
    const monthlyProfit = Number(stats.loaned_this_month) * 0.2;
    document.getElementById('estimated_monthly_profit').innerText = formatCurrency(monthlyProfit);
}

// Run on page load
loadDashboardStats();
