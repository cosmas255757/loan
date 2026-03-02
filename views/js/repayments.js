const API_URL = 'http://localhost:3000/api/repayments';

document.addEventListener('DOMContentLoaded', fetchRepayments);

// --- READ ALL ---
async function fetchRepayments() {
    const res = await fetch(API_URL);
    const data = await res.json();
    renderTable(data);
}

// --- SEARCH BY LOAN ID ---
async function searchByLoan() {
    const loanId = document.getElementById('loanSearchId').value;
    if (!loanId) return fetchRepayments();
    
    const res = await fetch(`${API_URL}/loan/${loanId}`);
    const data = await res.json();
    // Our API returns { history: [...] } for this route
    renderTable(data.history || []);
}

function renderTable(repayments) {
    const tbody = document.getElementById('repaymentTableBody');
    tbody.innerHTML = repayments.map(rp => `
        <tr>
            <td>${rp.id}</td>
            <td>${rp.loan_id}</td>
            <td>$${parseFloat(rp.amount_paid).toLocaleString()}</td>
            <td>${new Date(rp.payment_date).toLocaleDateString()}</td>
            <td>
                <button class="btn-edit" onclick="prepareEdit(${rp.id}, ${rp.loan_id}, ${rp.amount_paid}, '${rp.payment_date}')">Edit</button>
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
    const url = id ? `${API_URL}/${id}` : API_URL;
    
    const body = id 
        ? { amount_paid, payment_date } 
        : { loan_id, amount_paid, payment_date };

    const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if(!res.ok) {
        const err = await res.json();
        alert("Error: " + err.message);
    } else {
        resetForm();
        fetchRepayments();
    }
});

// --- DELETE ---
async function deleteRepayment(id) {
    if (confirm("Delete this payment record?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchRepayments();
    }
}

// --- UI HELPERS ---
function prepareEdit(id, loanId, amount, date) {
    // Format date to YYYY-MM-DD for the input type="date"
    const formattedDate = new Date(date).toISOString().split('T')[0];

    document.getElementById('editRepaymentId').value = id;
    document.getElementById('loanId').value = loanId;
    document.getElementById('loanId').disabled = true; 
    document.getElementById('amountPaid').value = amount;
    document.getElementById('paymentDate').value = formattedDate;
    
    document.getElementById('submitBtn').innerText = "Update Payment";
    document.getElementById('formTitle').innerText = "Edit Payment #" + id;
    document.getElementById('cancelBtn').style.display = "inline-block";
}

function resetForm() {
    document.getElementById('repaymentForm').reset();
    document.getElementById('editRepaymentId').value = "";
    document.getElementById('loanId').disabled = false;
    document.getElementById('submitBtn').innerText = "Save Payment";
    document.getElementById('formTitle').innerText = "Record New Payment";
    document.getElementById('cancelBtn').style.display = "none";
}
