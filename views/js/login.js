const loginForm = document.getElementById('loginForm');
const loginBtn = loginForm.querySelector('.btn-auth');

// 1. Pre-check: Use the clean /dashboard route instead of the .html file
// if (localStorage.getItem('token')) {
//     window.location.href = '/dashboard'; 
// }

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // UI Feedback
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

        if (response.ok && result.success) {
            // ✅ SUCCESS: Save JWT and go to Dashboard
            localStorage.setItem('token', result.token);
            // Redirect to the route defined in your server.js
            window.location.href = '/dashboard';
        } else {
            // ❌ FAIL
            alert(result.message || "Invalid email or password.");
            document.getElementById('loginPassword').value = ''; 
        }
    } catch (err) {
        console.error("Login Error:", err);
        alert("Connection error. Is the server running?");
    } finally {
        loginBtn.disabled = false;
        loginBtn.innerText = "Login to Dashboard";
    }
});
