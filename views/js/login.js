const loginForm = document.getElementById('loginForm');
const loginBtn = loginForm.querySelector('.btn-auth');

// 1. Pre-check: If already logged in, skip the login page
if (localStorage.getItem('token')) {
    window.location.href = 'stats.html';
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // UI Feedback: Disable button to prevent double-clicks
    loginBtn.disabled = true;
    loginBtn.innerText = "Authenticating...";

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
            // ✅ SUCCESS: Save JWT and go to Dashboard
            localStorage.setItem('token', result.token);
            window.location.href = 'stats.html';
        } else {
            // ❌ FAIL: Show error and clear password for security
            alert(result.message || "Invalid email or password.");
            document.getElementById('loginPassword').value = ''; 
        }
    } catch (err) {
        console.error("Login Error:", err);
        alert("Connection error. Is the server running?");
    } finally {
        // Reset button state
        loginBtn.disabled = false;
        loginBtn.innerText = "Login to Dashboard";
    }
});
