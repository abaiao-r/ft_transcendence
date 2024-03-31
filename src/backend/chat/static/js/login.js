
// Shows the login section when the login button is clicked
document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('login-button');
    const loginSection = document.getElementById('login');
    const signUpLink = document.querySelector('#login a[href="#Signup"]');

	// Add event listener to the login button
    loginButton.addEventListener('click', function(event) {
        event.preventDefault();
        goToPage("#Login");
    });

	// Shows the signup section when the signup link is clicked
    signUpLink.addEventListener('click', function(event) {
		console.log("signup link clicked");
        event.preventDefault();
        goToPage("#Signup");
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

        if (await login(username, password)) {
            console.log("Successful Logged in");
            goToPage("#Play");
        }
        else {
            console.log("Failed to login");
        }
    });
});

// Add listener to logout button
document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logout-button');

    logoutButton.addEventListener('click', async function(event) {
        event.preventDefault();
        await logout();
        goToPage("#Login");
    });
});

