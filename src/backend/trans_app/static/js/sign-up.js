
// Shows the signup section when the signup button is clicked
document.addEventListener('DOMContentLoaded', function() {
    const signupButton = document.getElementById('sign-up-button');
    const signupSection = document.getElementById('sign-up');
    const loginLink = document.querySelector(`#sign-up a[href="${LOGIN_HREF}"]`);

	// Add event listener to the signup button
    signupButton.addEventListener('click', function(event) {
		console.log("signup button clicked");
        event.preventDefault();
		window.location.href = SIGNUP_HREF;
    });

	// Shows the login section when the login link is clicked
	loginLink.addEventListener('click', function(event) {
		console.log("login link clicked");
		event.preventDefault();
		window.location.href = LOGIN_HREF;
	});
});

// Signup form submission
document.addEventListener('DOMContentLoaded', async function() {
    const signupForm = document.getElementById('sign-up-form');

	console.log("signupForm: ", signupForm);

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
		// Collect form data
		const username = document.getElementById('sign-up-username').value;
		const email = document.getElementById('sign-up-email').value;
		const password = document.getElementById('sign-up-password').value;
		const twoFactorAuth = document.getElementById('sign-up-toggle2FA').checked;

		let data = {username, email, password}

		if (twoFactorAuth) {
			data['type_of_2fa'] = 'google_authenticator'
		}

		console.log("data: ", data);
        
		// Send POST request to the server
        fetch('/api/signup/', {
            method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': '{{ csrf_token }}',
			},
            body: JSON.stringify(data),
        })
        .then(response => {
			console.log("response: ", response);
            if (!response.ok) {
                throw new Error('Signup failed.');
            }
            return response.json();
        })
        .then(data => {
            // Handle successful signup response
            console.log(data);
            // Store tokens in local storage
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            window.location.href = PLAY_HREF;
        })
        .catch(error => {
            // Handle signup error
            console.error(error);
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const passwordInput = document.querySelector("#sign-up #sign-up-password");
    const showPasswordButton = document.querySelector("#sign-up .show-password");
    const hidePasswordButton = document.querySelector("#sign-up .hide-password");

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