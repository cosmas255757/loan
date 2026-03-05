const API_URL = '/api/applicants';
const token = localStorage.getItem('token');

// 1. Auth Guard
if (!token) window.location.href = '/login';

// 2. Fetch and Display
async function fetchApplicants() {
    try {
        const res = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        const tbody = document.getElementById('applicantTableBody');
        tbody.innerHTML = '';

        data.forEach(app => {
            tbody.innerHTML += `
                <tr>
                    <td>${app.full_name}</td>
                    <td>${app.phone}</td>
                    <td>${app.living_location || '-'}</td>
                    <td>${app.occupation || '-'}</td>
                    <td>${app.sex || '-'}</td>
                    <td>${app.relationship_status || '-'}</td>
                    <td>
                        <button class="btn-edit" onclick="editApp(${app.id}, '${app.full_name}', '${app.phone}', '${app.living_location}', '${app.occupation}', '${app.sex}', '${app.relationship_status}')">Edit</button>
                        <button class="btn-delete" onclick="deleteApp(${app.id})">Delete</button>
                    </td>
                </tr>`;
        });
    } catch (err) { console.error("Load Error:", err); }
}

// 3. Save or Update
document.getElementById('applicantForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    
    const applicantData = {
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
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(applicantData)
        });

        if (res.ok) {
            alert(id ? "Updated!" : "Saved!");
            resetForm();
            fetchApplicants();
        }
    } catch (err) { alert("Save failed"); }
});

// 4. Delete Logic
async function deleteApp(id) {
    if (!confirm("Delete this applicant?")) return;
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchApplicants();
}

// 5. Helper: Fill form for editing
function editApp(id, name, phone, loc, occ, sex, rel) {
    document.getElementById('editId').value = id;
    document.getElementById('fullName').value = name;
    document.getElementById('phone').value = phone;
    document.getElementById('livingLocation').value = loc;
    document.getElementById('occupation').value = occ;
    document.getElementById('sex').value = sex;
    document.getElementById('relationshipStatus').value = rel;
    
    document.getElementById('formTitle').innerText = "Update Applicant";
    document.getElementById('submitBtn').innerText = "Update Changes";
    document.getElementById('cancelBtn').style.display = "inline-block";
}

function resetForm() {
    document.getElementById('applicantForm').reset();
    document.getElementById('editId').value = '';
    document.getElementById('formTitle').innerText = "Register New Applicant";
    document.getElementById('submitBtn').innerText = "Save Applicant";
    document.getElementById('cancelBtn').style.display = "none";
}

// Initial Load
fetchApplicants();
