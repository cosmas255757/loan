const API_URL = '/api/loans';
const APP_API_URL = '/api/applicants';
const token = localStorage.getItem('token');

if (!token) window.location.href = '/login';

// 1. Initial Load: Get Applicants for the dropdown and then Loans for the table
async function init() {
    await populateApplicantsDropdown();
    await fetchLoans();
}

// 2. Fetch Applicants to fill the <select> dropdown
async function populateApplicantsDropdown() {
    try {
        const res = await fetch(APP_API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const applicants = await res.json();
        const select = document.getElementById('appId');
        
        select.innerHTML = '<option value="">-- Choose Applicant --</option>';
        applicants.forEach(app => {
            select.innerHTML += `<option value="${app.id}">${app.full_name}</option>`;
        });
    } catch (err) { console.error("Error loading applicants:", err); }
}

// 3. Fetch Loans and display in table
async function fetchLoans() {
    try {
        const res = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        const tbody = document.getElementById('loanTableBody');
        tbody.innerHTML = '';

        // Note: data.loans because our controller wraps it in { count, loans }
        data.loans.forEach(loan => {
            tbody.innerHTML += `
                <tr>
                    <td>${loan.applicant_name}</td>
                    <td>TSh ${Number(loan.amount).toLocaleString()}</td>
                    <td><span class="status-badge ${loan.status}">${loan.status}</span></td>
                    <td>${new Date(loan.created_at).toLocaleDateString()}</td>
                    <td>
                        <button class="btn-edit" onclick="editLoan(${loan.id}, ${loan.amount}, '${loan.status}')">Edit</button>
                        <button class="btn-delete" onclick="deleteLoan(${loan.id})">Delete</button>
                    </td>
                </tr>`;
        });
    } catch (err) { console.error("Load Error:", err); }
}

// 4. Create or Update Loan
document.getElementById('loanForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editLoanId').value;
    
    const loanData = {
        applicant_id: document.getElementById('appId').value,
        amount: document.getElementById('loanAmount').value,
        status: document.getElementById('loanStatus').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(loanData)
        });

        if (res.ok) {
            alert(id ? "Loan Updated!" : "Loan Issued!");
            resetForm();
            fetchLoans();
        }
    } catch (err) { alert("Action failed"); }
});

// 5. Setup Edit Mode
function editLoan(id, amount, status) {
    document.getElementById('editLoanId').value = id;
    document.getElementById('loanAmount').value = amount;
    document.getElementById('loanStatus').value = status;
    
    // Hide applicant selection (usually not changed after issuing)
    document.getElementById('appId').parentElement.style.display = "none";
    document.getElementById('statusContainer').style.display = "block";
    
    document.getElementById('formTitle').innerText = "Update Loan Status";
    document.getElementById('submitBtn').innerText = "Save Changes";
    document.getElementById('cancelBtn').style.display = "inline-block";
}

function resetForm() {
    document.getElementById('loanForm').reset();
    document.getElementById('editLoanId').value = '';
    document.getElementById('appId').parentElement.style.display = "block";
    document.getElementById('statusContainer').style.display = "none";
    document.getElementById('formTitle').innerText = "Issue New Loan";
    document.getElementById('submitBtn').innerText = "Create Loan";
    document.getElementById('cancelBtn').style.display = "none";
}

async function deleteLoan(id) {
    if (!confirm("Delete this loan?")) return;
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchLoans();
}

// Run on page load
init();
