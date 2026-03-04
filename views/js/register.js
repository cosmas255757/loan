document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const full_name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name, email, password })
        });

        const result = await response.json();

        if (result.success) {
            alert("Account created! Please login.");
            window.location.href = 'login.html'; // Send them back to login
        } else {
            alert(result.message || "Registration failed.");
        }
    } catch (err) {
        console.error("Registration Error:", err);
    }
});
