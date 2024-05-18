
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

// Get the signup form fields
const username = document.getElementById('sign-up-username');
const email = document.getElementById('sign-up-email');
const password = document.getElementById('sign-up-password');
const toggle2FA = document.getElementById('sign-up-toggle2FA');

// Hide the error message when the username field is focused
username.addEventListener('focus', function() {
    document.getElementById('username-error-message').style.display = 'none';
});

// Hide the error message when the email field is focused
email.addEventListener('focus', function() {
    document.getElementById('email-error-message').style.display = 'none';
});

// Hide the error message when the password field is focused
password.addEventListener('focus', function() {
    document.getElementById('password-error-message').style.display = 'none';
});

// Hide the error message when the 2FA toggle is clicked
toggle2FA.addEventListener('click', function() {
    document.getElementById('2FA-error-message').style.display = 'none';
});

//show password-requirements when password field is focused
password.addEventListener('focus', function() {
    document.getElementById('password-requirements').style.display = 'block';
});

document.getElementById('sign-up-password').addEventListener('input', function(event) {
    const password = event.target.value;

    const lengthRequirement = document.getElementById('length-requirement');
    const uppercaseRequirement = document.getElementById('uppercase-requirement');
    const lowercaseRequirement = document.getElementById('lowercase-requirement');
    const digitRequirement = document.getElementById('digit-requirement');
    const specialRequirement = document.getElementById('special-requirement');

    lengthRequirement.classList.remove('valid', 'invalid');
    lengthRequirement.classList.add(password.length >= 8 ? 'valid' : 'invalid');
    lengthRequirement.querySelector('.icon').textContent = password.length >= 8 ? '✓' : '✗';

    uppercaseRequirement.classList.remove('valid', 'invalid');
    uppercaseRequirement.classList.add(/[A-Z]/.test(password) ? 'valid' : 'invalid');
    uppercaseRequirement.querySelector('.icon').textContent = /[A-Z]/.test(password) ? '✓' : '✗';

    lowercaseRequirement.classList.remove('valid', 'invalid');
    lowercaseRequirement.classList.add(/[a-z]/.test(password) ? 'valid' : 'invalid');
    lowercaseRequirement.querySelector('.icon').textContent = /[a-z]/.test(password) ? '✓' : '✗';

    digitRequirement.classList.remove('valid', 'invalid');
    digitRequirement.classList.add(/\d/.test(password) ? 'valid' : 'invalid');
    digitRequirement.querySelector('.icon').textContent = /\d/.test(password) ? '✓' : '✗';

    specialRequirement.classList.remove('valid', 'invalid');
    specialRequirement.classList.add(/[\W_]/.test(password) ? 'valid' : 'invalid');
    specialRequirement.querySelector('.icon').textContent = /[\W_]/.test(password) ? '✓' : '✗';
});

// Signup form submission
document.addEventListener('DOMContentLoaded', async function() {
    const signupForm = document.getElementById('sign-up-form');
    console.log("signupForm: ", signupForm);

    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Collect form data
        const username = document.getElementById('sign-up-username').value;
        const usernameErrorMessage = document.getElementById('username-error-message');
        const email = document.getElementById('sign-up-email').value;
        const emailErrorMessage = document.getElementById('email-error-message');
        const password = document.getElementById('sign-up-password').value;
        const passwordErrorMessage = document.getElementById('password-error-message');
        const twoFactorAuth = document.getElementById('sign-up-toggle2FA').checked;

        let data = { username, email, password };

        if (twoFactorAuth) {
            data['type_of_2fa'] = 'google_authenticator';
        }

        console.log("data: ", data);

        try {
            // Send POST request to the server
            const response = await fetch('/api/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'X-CSRFToken': '{{ csrf_token }}', // This line can only be used in server-rendered templates
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();
            console.log("response: ", response);
            console.log("responseData: ", responseData);

            if (responseData.error) {
                console.log("SIGNUP ERROR");
        
                // Hide previous error messages
                emailErrorMessage.style.display = 'none';
                usernameErrorMessage.style.display = 'none';
                passwordErrorMessage.style.display = 'none';
        
                responseData.error.forEach(error => {
                    if (error.field === "email") {
                        emailErrorMessage.textContent = error.message;
                        emailErrorMessage.style.display = 'block';
                    } else if (error.field === "username") {
                        usernameErrorMessage.textContent = error.message;
                        usernameErrorMessage.style.display = 'block';
                    } else if (error.field === "password") {
                        passwordErrorMessage.textContent = error.message;
                        passwordErrorMessage.style.display = 'block';
                    }
                });
        
                throw new Error(responseData.error.map(e => e.message).join(' ') || 'Signup failed.');
            }
            console.log("OK")


            // Handle successful signup response
            clearFormSignUp();
            localStorage.setItem('accessToken', responseData.access);
            localStorage.setItem('refreshToken', responseData.refresh);
            window.location.href = HOME_HREF;
        } catch (error) {
            // Handle signup error
            console.error('Signup failed. Please try again: ', error);
           // alert(error.message);
        }
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



