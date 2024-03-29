
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

