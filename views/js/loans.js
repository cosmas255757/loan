const LOAN_API = '/api/loans'; 
const APP_API = '/api/applicants'; 

document.addEventListener('DOMContentLoaded', () => {
    fetchLoans();
    loadApplicantDropdown(); // Fill the dropdown when page loads
});

// --- LOAD APPLICANTS INTO DROPDOWN ---
async function loadApplicantDropdown() {
    try {
        const res = await fetch(APP_API);
        const data = await res.json();
        const applicants = data.applicants || data || [];
        
        const select = document.getElementById('appId');
        select.innerHTML = '<option value="">-- Select Applicant --</option>';
        
        applicants.forEach(app => {
            const option = document.createElement('option');
            option.value = app.id;
            option.textContent = `${app.full_name} (${app.phone})`;
            select.appendChild(option);
        });
    } catch (err) {
        console.error("Error loading applicants:", err);
    }
}

// --- READ ALL ---
async function fetchLoans() {
    try {
        const res = await fetch(LOAN_API);
        const data = await res.json();
        // Adjusting for the { count, loans } format from your controller
        renderTable(data.loans || data || []);
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

// --- FILTER BY STATUS ---
async function filterByStatus() {
    const status = document.getElementById('statusFilter').value;
    if (!status) return fetchLoans();
    
    try {
        const res = await fetch(`${LOAN_API}/search?status=${status}`);
        const data = await res.json();
        renderTable(data.loans || data.results || []);
    } catch (err) {
        console.error("Search error:", err);
    }
}

function renderTable(loans) {
    const tbody = document.getElementById('loanTableBody');
    tbody.innerHTML = ''; 

    if (loans.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No loans found.</td></tr>';
        return;
    }

    tbody.innerHTML = loans.map(loan => `
        <tr>
            <td class="font-bold">${loan.applicant_name}</td>
            <td>TSh ${parseFloat(loan.amount).toLocaleString()}</td>
            <td><span class="status-badge ${loan.status}">${loan.status}</span></td>
            <td>${new Date(loan.created_at).toLocaleDateString()}</td>
            <td class="actions">
                <button class="btn-edit" onclick='prepareEdit(${JSON.stringify(loan)})'>Edit</button>
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
    const url = id ? `${LOAN_API}/${id}` : LOAN_API;
    
    // Body changes based on whether it's a new loan or update
    const body = id ? { amount, status } : { applicant_id, amount };

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
            fetchLoans();
        }
    } catch (err) {
        console.error("Submit error:", err);
    }
});

// --- DELETE ---
async function deleteLoan(id) {
    if (confirm("Delete this loan record?")) {
        await fetch(`${LOAN_API}/${id}`, { method: 'DELETE' });
        fetchLoans();
    }
}

// --- UI HELPERS ---
function prepareEdit(loan) {
    document.getElementById('editLoanId').value = loan.id;
    
    // Select the correct applicant in the dropdown
    document.getElementById('appId').value = loan.applicant_id || "";
    document.getElementById('appId').disabled = true; 
    
    document.getElementById('loanAmount').value = loan.amount;
    document.getElementById('loanStatus').value = loan.status;
    
    // Show the status container and update labels
    document.getElementById('statusContainer').style.display = "block";
    document.getElementById('submitBtn').innerText = "Update Loan";
    document.getElementById('formTitle').innerText = "Edit Loan for " + loan.applicant_name;
    document.getElementById('cancelBtn').style.display = "inline-block";
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('loanForm').reset();
    document.getElementById('editLoanId').value = "";
    document.getElementById('appId').disabled = false;
    document.getElementById('statusContainer').style.display = "none";
    document.getElementById('submitBtn').innerText = "Create Loan";
    document.getElementById('formTitle').innerText = "Issue New Loan";
    document.getElementById('cancelBtn').style.display = "none";
}
