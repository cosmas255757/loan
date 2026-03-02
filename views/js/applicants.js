const API_URL = 'http://localhost:3000/api/applicants';

document.addEventListener('DOMContentLoaded', fetchApplicants);

// --- READ ALL ---
async function fetchApplicants() {
    const res = await fetch(API_URL);
    const data = await res.json();
    renderTable(data);
}

// --- SEARCH (READ with query) ---
async function searchApp() {
    const name = document.getElementById('searchInput').value;
    if (!name) return fetchApplicants();
    
    const res = await fetch(`${API_URL}/search?name=${name}`);
    const data = await res.json();
    renderTable(data.results || []);
}

function renderTable(applicants) {
    const tbody = document.getElementById('applicantTableBody');
    tbody.innerHTML = applicants.map(app => `
        <tr>
            <td>${app.id}</td>
            <td>${app.full_name}</td>
            <td>${app.phone}</td>
            <td>
                <button class="btn-edit" onclick="prepareEdit(${app.id}, '${app.full_name}', '${app.phone}')">Edit</button>
                <button class="btn-delete" onclick="deleteApp(${app.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// --- CREATE & UPDATE ---
document.getElementById('applicantForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const full_name = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name, phone })
    });

    resetForm();
    fetchApplicants();
});

// --- DELETE ---
async function deleteApp(id) {
    if (confirm("Permanently delete this applicant?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchApplicants();
    }
}

// --- UI HELPERS ---
function prepareEdit(id, name, phone) {
    document.getElementById('editId').value = id;
    document.getElementById('fullName').value = name;
    document.getElementById('phone').value = phone;
    document.getElementById('submitBtn').innerText = "Update Applicant";
    document.getElementById('formTitle').innerText = "Editing Applicant #" + id;
    document.getElementById('cancelBtn').style.display = "inline-block";
}

function resetForm() {
    document.getElementById('applicantForm').reset();
    document.getElementById('editId').value = "";
    document.getElementById('submitBtn').innerText = "Save Applicant";
    document.getElementById('formTitle').innerText = "Register New Applicant";
    document.getElementById('cancelBtn').style.display = "none";
}
