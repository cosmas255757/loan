//const API_URL = 'http://localhost:3000/api/applicants';


const API_URL = '/api/applicants'; 


document.addEventListener('DOMContentLoaded', fetchApplicants);

// --- READ ALL ---
function displayApplicants(applicants) {
    const tableBody = document.getElementById('applicantTableBody');
    tableBody.innerHTML = ''; // Clear previous data

    applicants.forEach(app => {
        const row = `
            <tr>
                <td class="font-bold">${app.full_name}</td>
                <td>${app.phone}</td>
                <td>${app.living_location || '-'}</td>
                <td>${app.occupation || '-'}</td>
                <td>${app.sex || '-'}</td>
                <td>${app.relationship_status || '-'}</td>
                <td class="actions">
                    <!-- Note: We still use app.id for the logic, just not for display -->
                    <button class="edit-btn" onclick="editApplicant(${app.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteApplicant(${app.id})">Delete</button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
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
    
    // ALL 6 values from the form
    const full_name = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const living_location = document.getElementById('livingLocation').value;
    const occupation = document.getElementById('occupation').value;
    const sex = document.getElementById('sex').value;
    const relationship_status = document.getElementById('relationshipStatus').value;

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    // Send all 6 values in the body
    await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            full_name, 
            phone, 
            living_location, 
            occupation, 
            sex, 
            relationship_status 
        })
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
