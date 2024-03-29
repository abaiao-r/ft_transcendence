// Function to hide all sections
function hideAllSections() {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
}

// Function to show a specific section
function showSection(id) {
    const section = document.querySelector(id);
    if (section) {
        section.style.display = 'block';
    }
}

// Remove active class from navbar items
function removeNavbarActiveClass() {
	const navItems = document.querySelectorAll('.my-nav-item');
	navItems.forEach(item => {
		item.classList.remove('my-nav-item-active');
	});
}

// Function to go to a specific page
function goToPage(href) {
	hideAllSections();
	window.location.href = href;
	switch (href) {
		case "#Home":
			showSection('#home');
			break;
		case "#History":
			showSection('#history');
			break;
		case "#FAQ":
			showSection('#faq');
			break;
		case "#About":
			showSection('#about');
			break;
		case "#Login":
			removeNavbarActiveClass();
			showSection('#login');
			break;
		case "#Signup":
			removeNavbarActiveClass();
			showSection('#signup');
			break;
		case "#Play":
			removeNavbarActiveClass();
			showSection('#play');
			break;
	}
}