
// Shows the signup section when the signup button is clicked
document.addEventListener('DOMContentLoaded', function() {
    const signupButton = document.getElementById('signup-button');
    const signupSection = document.getElementById('signup');
	const loginLink = document.querySelector('#signup a[href="#Login"]');

	// Add event listener to the signup button
    signupButton.addEventListener('click', function(event) {
		console.log("signup button clicked");
        event.preventDefault();
		window.location.href = "#Signup";
    });

	// Shows the login section when the login link is clicked
	loginLink.addEventListener('click', function(event) {
		console.log("login link clicked");
		event.preventDefault();
		window.location.href = "#Login";
	});
});

// Signup form submission
document.addEventListener('DOMContentLoaded', async function() {
    const signupForm = document.getElementById('signup-form');

	console.log("signupForm: ", signupForm);

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
		// Collect form data
		const username = document.getElementById('signup-username').value;
		const email = document.getElementById('signup-email').value;
		const password = document.getElementById('signup-password').value;
		const twoFactorAuth = document.getElementById('signup-toggle2FA').checked;

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
            window.location.href = "#Play";
        })
        .catch(error => {
            // Handle signup error
            console.error(error);
        });
    });
});

