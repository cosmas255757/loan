const REPAYMENT_API = '/api/repayments';
const LOAN_API = '/api/loans';

document.addEventListener('DOMContentLoaded', () => {
    fetchRepayments();
    loadLoanDropdown(); // Fill the dropdown when page loads
});

// --- LOAD LOANS INTO DROPDOWN ---
async function loadLoanDropdown() {
    try {
        const res = await fetch(LOAN_API);
        const data = await res.json();
        const loans = data.loans || data || [];
        
        const select = document.getElementById('loanId');
        select.innerHTML = '<option value="">-- Select Loan Record --</option>';
        
        loans.forEach(loan => {
            // Only show loans that aren't fully paid if you prefer, 
            // but for now, we show all approved loans
            const option = document.createElement('option');
            option.value = loan.id;
            option.textContent = `${loan.applicant_name} (Loan: TSh ${parseFloat(loan.amount).toLocaleString()})`;
            select.appendChild(option);
        });
    } catch (err) {
        console.error("Error loading loans:", err);
    }
}

// --- READ ALL ---
async function fetchRepayments() {
    try {
        const res = await fetch(REPAYMENT_API);
        const data = await res.json();
        // Matching the { count, repayments } format from your updated controller
        renderTable(data.repayments || data || []);
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

// --- SEARCH/FILTER BY NAME ---
function filterByName() {
    const searchTerm = document.getElementById('nameSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#repaymentTableBody tr');
    
    rows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        row.style.display = name.includes(searchTerm) ? "" : "none";
    });
}

function renderTable(repayments) {
    const tbody = document.getElementById('repaymentTableBody');
    tbody.innerHTML = ''; 

    if (repayments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No repayments recorded.</td></tr>';
        return;
    }

    tbody.innerHTML = repayments.map(rp => `
        <tr>
            <td class="font-bold">${rp.applicant_name}</td>
            <td>TSh ${parseFloat(rp.amount_paid).toLocaleString()}</td>
            <td class="text-danger">TSh ${parseFloat(rp.amount_left).toLocaleString()}</td>
            <td>${new Date(rp.payment_date).toLocaleDateString()}</td>
            <td>
                <span class="status-${rp.status}">
                    ${rp.status.toUpperCase()}
                </span>
            </td>
            <td class="actions">
                <button class="btn-edit" onclick='prepareEdit(${JSON.stringify(rp)})'>Edit</button>
                <button class="btn-delete" onclick="deleteRepayment(${rp.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// --- CREATE & UPDATE ---
document.getElementById('repaymentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('editRepaymentId').value;
    const loan_id = document.getElementById('loanId').value;
    const amount_paid = document.getElementById('amountPaid').value;
    const payment_date = document.getElementById('paymentDate').value;

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${REPAYMENT_API}/${id}` : REPAYMENT_API;
    
    const body = id 
        ? { amount_paid, payment_date } 
        : { loan_id, amount_paid, payment_date };

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const err = await res.json();
            alert("Error: " + err.message);
        } else {
            resetForm();
            fetchRepayments();
        }
    } catch (err) {
        console.error("Submission error:", err);
    }
});

// --- DELETE ---
async function deleteRepayment(id) {
    if (confirm("Permanently delete this payment record?")) {
        await fetch(`${REPAYMENT_API}/${id}`, { method: 'DELETE' });
        fetchRepayments();
    }
}

// --- UI HELPERS ---
function prepareEdit(rp) {
    // Format date to YYYY-MM-DD for the input type="date"
    const formattedDate = new Date(rp.payment_date).toISOString().split('T')[0];

    document.getElementById('editRepaymentId').value = rp.id;
    document.getElementById('loanId').value = rp.loan_id;
    document.getElementById('loanId').disabled = true; 
    document.getElementById('amountPaid').value = rp.amount_paid;
    document.getElementById('paymentDate').value = formattedDate;
    
    document.getElementById('submitBtn').innerText = "Update Payment";
    document.getElementById('formTitle').innerText = "Editing: " + rp.applicant_name;
    document.getElementById('cancelBtn').style.display = "inline-block";
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('repaymentForm').reset();
    document.getElementById('editRepaymentId').value = "";
    document.getElementById('loanId').disabled = false;
    document.getElementById('submitBtn').innerText = "Save Payment";
    document.getElementById('formTitle').innerText = "Record New Payment";
    document.getElementById('cancelBtn').style.display = "none";
}
