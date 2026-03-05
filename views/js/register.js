document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        full_name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPassword').value
    };

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            alert("Success! Please login.");
            window.location.href = '/login'; // Matches your Express route
        } else {
            // Displays "Email already registered" or other backend messages
            alert(result.message || "Registration failed");
        }
    } catch (err) {
        console.error("Registration error:", err);
        alert("Server error. Check your connection.");
    }
});
