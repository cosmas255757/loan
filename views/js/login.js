document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
            // 1. Save the JWT Token to LocalStorage
            localStorage.setItem('token', result.token);
            // 2. Redirect to Dashboard
            window.location.href = 'stats.html';
        } else {
            alert(result.message || "Login failed. Check your credentials.");
        }
    } catch (err) {
        console.error("Login Error:", err);
        alert("Server connection failed.");
    }
});
