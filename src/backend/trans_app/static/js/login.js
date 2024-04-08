
// Shows the login section when the login button is clicked
document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('login-button');
    const loginSection = document.getElementById('login');
    const signUpLink = document.querySelector(`#login a[href="${SIGNUP_HREF}"]`);

	// Add event listener to the login button
    loginButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = LOGIN_HREF;
    });

	// Shows the signup section when the signup link is clicked
    signUpLink.addEventListener('click', function(event) {
		console.log("signup link clicked");
        event.preventDefault();
        window.location.href = SIGNUP_HREF;
    });
});

// Login form submission
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Collect form data
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const data = await login(username, password);
        if (!data) {
            console.log("Failed to login");
        }
        else if (data.message && data.message == "Login successful") {
            console.log("Successful Logged in");
            window.location.href = PLAY_HREF;
        }
        else if (data.message && data.message == "Two-factor authentication activated successfully") {
            console.log("Two-factor authentication activated successfully");
            localStorage.setItem('username', username);
            window.location.href = TWO_FACTOR_AUTH_HREF;
            showQRCode(data.qr_code);
        }
        else {
            alert("Login failed. Please try again.");
        }
    });
});

// Show QR code
function showQRCode(qrCode) {
    console.log("QR code: ", qrCode);
    const container = document.getElementById('qr-code-img');
    container.innerHTML = qrCode;
}

// Handles 2fa submit code button
async function submitCode() {
    const code = document.getElementById('auth-code-input').value;

    const payload = {'type_of_2fa': 'google_authenticator', 'verification_code': code, 'username': localStorage.getItem('username')};

    const response = await fetch('/2fa/verify/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': '{{ csrf_token }}',
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        alert("Failed to verify code");
    } else {
        const response_data = await response.json();
        console.log("data: ", response_data);
        // If the response is successful, store the tokens in local storage and redirect to the play page
        if (response_data.message && response_data.message == "Two-factor authentication verified successfully") {
            console.log("Two-factor authentication activated successfully");
            localStorage.setItem('accessToken', response_data.access);
            localStorage.setItem('refreshToken', response_data.refresh);
            window.location.href = PLAY_HREF;
        }
    }
}


// Add listener to logout button
document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logout-button');

    logoutButton.addEventListener('click', async function(event) {
        event.preventDefault();
        await logout();
        window.location.href = LOGIN_HREF;
    });
});


