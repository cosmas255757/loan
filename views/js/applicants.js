//const API_URL = 'http://localhost:3000/api/applicants';


const API_URL = '/api/applicants'; 



document.addEventListener('DOMContentLoaded', fetchApplicants);

// --- READ ALL ---
async function fetchApplicants() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        // Access the array inside the response (adjust based on your sendSuccess format)
        renderTable(data.applicants || data || []);
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

// --- RENDER TABLE (One consistent function for Search & List) ---
function renderTable(applicants) {
    const tbody = document.getElementById('applicantTableBody');
    tbody.innerHTML = ''; // Clear previous data

    if (applicants.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No applicants found.</td></tr>';
        return;
    }

    tbody.innerHTML = applicants.map(app => `
        <tr>
            <td class="font-bold">${app.full_name}</td>
            <td>${app.phone}</td>
            <td>${app.living_location || '-'}</td>
            <td>${app.occupation || '-'}</td>
            <td>${app.sex || '-'}</td>
            <td>${app.relationship_status || '-'}</td>
            <td class="actions">
                <button class="btn-edit" onclick='prepareEdit(${JSON.stringify(app)})'>Edit</button>
                <button class="btn-delete" onclick="deleteApp(${app.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// --- SEARCH ---
async function searchApp() {
    const name = document.getElementById('searchInput').value;
    if (!name) return fetchApplicants();
    
    const res = await fetch(`${API_URL}/search?name=${name}`);
    const data = await res.json();
    renderTable(data.results || data || []);
}

// --- CREATE & UPDATE ---
document.getElementById('applicantForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('editId').value;
    
    const payload = {
        full_name: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        living_location: document.getElementById('livingLocation').value,
        occupation: document.getElementById('occupation').value,
        sex: document.getElementById('sex').value,
        relationship_status: document.getElementById('relationshipStatus').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            resetForm();
            fetchApplicants();
        } else {
            const err = await res.json();
            alert("Error: " + err.message);
        }
    } catch (err) {
        console.error("Submission error:", err);
    }
});

// --- DELETE ---
async function deleteApp(id) {
    if (confirm("Permanently delete this applicant?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchApplicants();
    }
}

// --- UI HELPERS ---
function prepareEdit(app) {
    // Fill ALL fields in the form
    document.getElementById('editId').value = app.id;
    document.getElementById('fullName').value = app.full_name;
    document.getElementById('phone').value = app.phone;
    document.getElementById('livingLocation').value = app.living_location || "";
    document.getElementById('occupation').value = app.occupation || "";
    document.getElementById('sex').value = app.sex || "";
    document.getElementById('relationshipStatus').value = app.relationship_status || "";

    // Update UI Labels
    document.getElementById('submitBtn').innerText = "Update Applicant";
    document.getElementById('formTitle').innerText = "Editing: " + app.full_name;
    document.getElementById('cancelBtn').style.display = "inline-block";
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('applicantForm').reset();
    document.getElementById('editId').value = "";
    document.getElementById('submitBtn').innerText = "Save Applicant";
    document.getElementById('formTitle').innerText = "Register New Applicant";
    document.getElementById('cancelBtn').style.display = "none";
}
