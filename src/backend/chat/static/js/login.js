
// Shows the login section when the login button is clicked
document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('login-button');
    const loginSection = document.getElementById('login');
    const signUpLink = document.querySelector('#login a[href="#Signup"]');

	// Add event listener to the login button
    loginButton.addEventListener('click', function(event) {
        event.preventDefault();
        // hide all the other sections
        hideAllSections();
		window.location.href = "#Login";
        // Toggle the display of the login section
        loginSection.style.display = 'block';
    });

	// Shows the signup section when the signup link is clicked
    signUpLink.addEventListener('click', function(event) {
		console.log("signup link clicked");
        event.preventDefault();
        // hide all the other sections
        hideAllSections();
		window.location.href = "#Signup";
        // Get the sign-up section and display it
        const signUpSection = document.getElementById('signup');
        signUpSection.style.display = 'block';
    });
});

// Function to hide all sections
function hideAllSections() {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
}
