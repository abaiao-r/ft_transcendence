
document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('login-button');
    const loginSection = document.getElementById('login');

    loginButton.addEventListener('click', function(event) {
		console.log("login button clicked");
        event.preventDefault();
		// hide all the other sections
		hideAllSections()
        // Toggle the display of the login section
        loginSection.style.display = 'block';
    });
});

// Function to hide all sections
function hideAllSections() {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
}
