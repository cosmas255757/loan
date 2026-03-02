const API_URL = 'http://localhost:3000/api/loans';

document.addEventListener('DOMContentLoaded', fetchLoans);

// --- READ ALL ---
async function fetchLoans() {
    const res = await fetch(API_URL);
    const data = await res.json();
    renderTable(data);
}

// --- SEARCH BY STATUS ---
async function searchByStatus() {
    const status = document.getElementById('statusSearch').value;
    if (!status) return fetchLoans();
    
    const res = await fetch(`${API_URL}/search?status=${status}`);
    const data = await res.json();
    renderTable(data.results || []);
}

function renderTable(loans) {
    const tbody = document.getElementById('loanTableBody');
    tbody.innerHTML = loans.map(loan => `
        <tr>
            <td>${loan.id}</td>
            <td>${loan.applicant_id}</td>
            <td>$${parseFloat(loan.amount).toLocaleString()}</td>
            <td><span class="status-badge ${loan.status}">${loan.status}</span></td>
            <td>
                <button class="btn-edit" onclick="prepareEdit(${loan.id}, ${loan.applicant_id}, ${loan.amount}, '${loan.status}')">Edit/Approve</button>
                <button class="btn-delete" onclick="deleteLoan(${loan.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// --- CREATE & UPDATE ---
document.getElementById('loanForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editLoanId').value;
    const applicant_id = document.getElementById('appId').value;
    const amount = document.getElementById('loanAmount').value;
    const status = document.getElementById('loanStatus').value;

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;
    
    // Body changes based on whether it's a new loan or update
    const body = id ? { amount, status } : { applicant_id, amount };

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
        fetchLoans();
    }
});

// --- DELETE ---
async function deleteLoan(id) {
    if (confirm("Delete this loan record?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchLoans();
    }
}

// --- UI HELPERS ---
function prepareEdit(id, appId, amount, status) {
    document.getElementById('editLoanId').value = id;
    document.getElementById('appId').value = appId;
    document.getElementById('appId').disabled = true; // Cannot change applicant ID
    document.getElementById('loanAmount').value = amount;
    document.getElementById('loanStatus').value = status;
    
    document.getElementById('loanStatus').style.display = "inline-block";
    document.getElementById('submitBtn').innerText = "Update Loan";
    document.getElementById('formTitle').innerText = "Update Loan #" + id;
    document.getElementById('cancelBtn').style.display = "inline-block";
}

function resetForm() {
    document.getElementById('loanForm').reset();
    document.getElementById('editLoanId').value = "";
    document.getElementById('appId').disabled = false;
    document.getElementById('loanStatus').style.display = "none";
    document.getElementById('submitBtn').innerText = "Create Loan";
    document.getElementById('formTitle').innerText = "Issue New Loan";
    document.getElementById('cancelBtn').style.display = "none";
}
