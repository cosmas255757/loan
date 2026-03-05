const API_URL = '/api/repayments';
const LOAN_API_URL = '/api/loans';
const token = localStorage.getItem('token');

if (!token) window.location.href = '/login';

// 1. Initial Load
async function init() {
    await populateLoansDropdown();
    await fetchRepayments();
    // Set default date to today
    document.getElementById('paymentDate').valueAsDate = new Date();
}

// 2. Fetch Loans for the dropdown (so user selects by Applicant Name)
async function populateLoansDropdown() {
    try {
        const res = await fetch(LOAN_API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        const select = document.getElementById('loanId');
        
        select.innerHTML = '<option value="">-- Choose Loan/Applicant --</option>';
        // Filter for 'active' or 'pending' loans so they don't keep paying for 'paid' loans
        data.loans.forEach(loan => {
            if (loan.status !== 'paid') {
                select.innerHTML += `<option value="${loan.id}">${loan.applicant_name} (TSh ${Number(loan.amount).toLocaleString()})</option>`;
            }
        });
    } catch (err) { console.error("Error loading loans:", err); }
}

// 3. Fetch Repayments and display in table
async function fetchRepayments() {
    try {
        const res = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        const tbody = document.getElementById('repaymentTableBody');
        tbody.innerHTML = '';

        data.repayments.forEach(r => {
            // Determine status color based on amount_left
            let statusClass = 'status-inprogress';
            let statusText = 'In Progress';
            
            if (Number(r.amount_left) <= 0) {
                statusClass = 'status-paid';
                statusText = 'Fully Paid';
            }

            tbody.innerHTML += `
                <tr>
                    <td>${r.applicant_name}</td>
                    <td>TSh ${Number(r.amount_paid).toLocaleString()}</td>
                    <td class="${Number(r.amount_left) > 0 ? 'text-danger' : ''}">
                        TSh ${Number(r.amount_left).toLocaleString()}
                    </td>
                    <td>${new Date(r.payment_date).toLocaleDateString()}</td>
                    <td><span class="${statusClass}">${statusText}</span></td>
                    <td>
                        <button class="btn-edit" onclick="editRepayment(${r.id}, ${r.amount_paid}, '${r.payment_date.split('T')[0]}', ${r.loan_id})">Edit</button>
                        <button class="btn-delete" onclick="deleteRepayment(${r.id})">Delete</button>
                    </td>
                </tr>`;
        });
    } catch (err) { console.error("Load Error:", err); }
}

// 4. Save or Update Repayment
document.getElementById('repaymentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editRepaymentId').value;
    
    const paymentData = {
        loan_id: document.getElementById('loanId').value,
        amount_paid: document.getElementById('amountPaid').value,
        payment_date: document.getElementById('paymentDate').value
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
            body: JSON.stringify(paymentData)
        });

        if (res.ok) {
            alert(id ? "Payment Updated!" : "Payment Recorded!");
            resetForm();
            fetchRepayments();
        } else {
            const errData = await res.json();
            alert("Error: " + errData.message);
        }
    } catch (err) { alert("Save failed"); }
});

// 5. Setup Edit Mode
function editRepayment(id, amount, date, loanId) {
    document.getElementById('editRepaymentId').value = id;
    document.getElementById('amountPaid').value = amount;
    document.getElementById('paymentDate').value = date;
    document.getElementById('loanId').value = loanId;
    
    document.getElementById('formTitle').innerText = "Update Payment Record";
    document.getElementById('submitBtn').innerText = "Save Changes";
    document.getElementById('cancelBtn').style.display = "inline-block";
}

function resetForm() {
    document.getElementById('repaymentForm').reset();
    document.getElementById('editRepaymentId').value = '';
    document.getElementById('paymentDate').valueAsDate = new Date();
    document.getElementById('formTitle').innerText = "Record New Payment";
    document.getElementById('submitBtn').innerText = "Save Payment";
    document.getElementById('cancelBtn').style.display = "none";
}

async function deleteRepayment(id) {
    if (!confirm("Remove this payment record?")) return;
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchRepayments();
}

// 6. Basic Search Filter
function filterByName() {
    const input = document.getElementById('nameSearch').value.toUpperCase();
    const rows = document.getElementById('repaymentTableBody').getElementsByTagName('tr');
    
    for (let row of rows) {
        const nameCol = row.getElementsByTagName('td')[0];
        if (nameCol) {
            const textValue = nameCol.textContent || nameCol.innerText;
            row.style.display = textValue.toUpperCase().indexOf(input) > -1 ? "" : "none";
        }
    }
}

init();
