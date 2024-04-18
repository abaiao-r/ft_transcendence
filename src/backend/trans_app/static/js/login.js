
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

// Add listener to logout button
document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logout-button');

    logoutButton.addEventListener('click', async function(event) {
        event.preventDefault();
        await logout();
        window.location.href = LOGIN_HREF;
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const passwordInput = document.getElementById("login-password");
    const showPasswordButton = document.querySelector(".show-password");
    const hidePasswordButton = document.querySelector(".hide-password");

    hidePasswordButton.style.display = "none"; // Initially hide the "Hide Password" button

    showPasswordButton.addEventListener("click", function() {
        passwordInput.type = "text";
        showPasswordButton.style.display = "none";
        hidePasswordButton.style.display = "inline";
    });

    hidePasswordButton.addEventListener("click", function() {
        passwordInput.type = "password";
        showPasswordButton.style.display = "inline";
        hidePasswordButton.style.display = "none";
    });
});


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

// Get the login form fields
const usernameField = document.getElementById('login-username');
const passwordField = document.getElementById('login-password');
const errorMessage = document.getElementById('error-message');

// Hide error message when user starts typing in the login form
usernameField.addEventListener('input', function() {
    errorMessage.style.display = 'none';
});
passwordField.addEventListener('input', function() {
    errorMessage.style.display = 'none';
});

// Login form submission
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const usernameInput = document.getElementById('login-username');
        const passwordInput = document.getElementById('login-password');

        const username = usernameInput.value;
        const password = passwordInput.value;

        const response = await login(username, password);

        if (response.error) {
            //alert(response.message);
            errorMessage.textContent = "Username or password is incorrect.";
            errorMessage.style.display = "block"; // Show the error message
            return;
        }

        const loginResponse = response.data;
        if (loginResponse.message === "Login successful") {
            localStorage.setItem('accessToken', loginResponse.access);
            localStorage.setItem('refreshToken', loginResponse.refresh);
            window.location.href = PLAY_HREF;
        } else if (loginResponse.message === "Two-factor authentication activated successfully") {
            localStorage.setItem('username', username);
            window.location.href = TWO_FACTOR_AUTH_HREF;
            showQRCode(loginResponse.qr_code);
        } else {
            errorMessage.textContent = "Login failed. Please try again.";
            errorMessage.style.display = "block"; // Show the error message
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
            console.log("2fa access token: ", localStorage.getItem('accessToken'));
            console.log("2fa refresh token: ", localStorage.getItem('refreshToken'));
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

document.addEventListener('DOMContentLoaded', function() {
    const loginButtons = document.querySelectorAll('.login-42 button');
    loginButtons.forEach(button => {
        button.addEventListener('click', event => {
            // Navigate to the OAuth login URL
            window.location.href = '/oauth/login/';
        });
    });
});

// When the page loads, check if there are JWT tokens in the URL
window.onload = function() {
    // Parse the query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);

    // Get the JWT tokens from the query parameters
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');

    // If there are JWT tokens and they're not already stored, store them and fetch the user's data
    if (accessToken && refreshToken && localStorage.getItem('accessToken') !== accessToken) {
        // Store the JWT tokens in local storage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Fetch the user's data
        fetch('getuser/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        }).then(response => response.json()).then(data => {
            console.log('User data:', data);

            // Store the user data in local storage
            localStorage.setItem('userData', JSON.stringify(data));

            
            // Clean url
            let currentURL = window.location.href;

            // Create a URL object
            let url = new URL(currentURL);
            
            // Remove the message and token parameters
            url.searchParams.delete('message');
            url.searchParams.delete('access_token');
            url.searchParams.delete('refresh_token');
            
            // Get the cleaned URL
            let cleanedURL = url.toString();
            
            // Replace the URL in the address bar
            console.log("Replaced: ", cleanedURL);
            window.history.replaceState(null, null, cleanedURL);

            // Refresh the page
            window.location.href = HOME_HREF;
            window.location.reload();
        });
    }
};