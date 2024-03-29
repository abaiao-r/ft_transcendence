
// Shows the signup section when the signup button is clicked
document.addEventListener('DOMContentLoaded', function() {
    const signupButton = document.getElementById('signup-button');
    const signupSection = document.getElementById('signup');
	const loginLink = document.querySelector('#signup a[href="#Login"]');

	// Add event listener to the signup button
    signupButton.addEventListener('click', function(event) {
		console.log("signup button clicked");
        event.preventDefault();
		goToPage("#Signup");
    });

	// Shows the login section when the login link is clicked
	loginLink.addEventListener('click', function(event) {
		console.log("login link clicked");
		event.preventDefault();
		goToPage("#Login");
	});
});

// Signup form submission
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');

	console.log("signupForm: ", signupForm);

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
		// Collect form data
		const username = document.getElementById('signup-username').value;
		const email = document.getElementById('signup-email').value;
		const password = document.getElementById('signup-password').value;
		const twoFactorAuth = document.getElementById('signup-toggle2FA').checked;

		const data = {username, email, password, twoFactorAuth};

		if (twoFactorAuth) {
			data['type_of_2fa'] = 'google_authenticator'
		}
        
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
            // Redirect to dashboard or homepage
			hideAllSections();
			//showSection('#dashboard'); TODO
			changeSidebar();
            window.location.href = '#dashboard';
			// goToDashboard(); TODO
        })
        .catch(error => {
            // Handle signup error
            console.error(error);
        });
    });
});

// Change Sidebar from before login to after login
function changeSidebar() {
	console.log("changing sidebar");
	const sidebar_before_login = document.querySelector('#sidebar-before-login');
	const sidebar_after_login = document.querySelector('#sidebar-after-login');

	// Hide the sidebar before login and show the sidebar after login using bootstrap
	sidebar_before_login.classList.add('d-none');
	sidebar_after_login.classList.remove('d-none');
	sidebar_after_login.classList.add('d-block');
}

