// Decode JWT token
function jwt_decode(token) {
	const base64Url = token.split('.')[1];
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));
	return JSON.parse(jsonPayload);
}

// Check if user is logged in
function isLogin() {
	loggedIn =  localStorage.getItem('accessToken') !== null;
	console.log("access token exists: ", loggedIn);
	// check if token expired
	/* if (loggedIn) {
		const accessToken = localStorage.getItem('accessToken');
		const decoded = jwt_decode(accessToken);
		const exp = decoded.exp;
		const current_time = Date.now() / 1000;
		if (exp < current_time) {
			loggedIn = false;
		}
	} */
	console.log("isLogin: ", loggedIn);
	return loggedIn;
}

// Change Sidebar from before login to after login
function toggleLoginSidebar() {
	console.log("changing sidebar to login");
	const sidebar_before_login = document.querySelector('#sidebar-before-login');
	const sidebar_after_login = document.querySelector('#sidebar-after-login');

	// Hide the sidebar before login and show the sidebar after login using bootstrap
	sidebar_before_login.classList.add('d-none');
	sidebar_after_login.classList.remove('d-none');
}

// Change Sidebar from before login to after login
function toggleLogoutSidebar() {
	console.log("changing sidebar to logout");
	const sidebar_before_login = document.querySelector('#sidebar-before-login');
	const sidebar_after_login = document.querySelector('#sidebar-after-login');

	// Hide the sidebar before login and show the sidebar after login using bootstrap
	sidebar_before_login.classList.remove('d-none');
	sidebar_after_login.classList.add('d-none');
	//sidebar_before_login.classList.remove('d-block');
}

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
	if (isLogin()) {
		toggleLoginSidebar();
		console.log("is login");
	}
	else {
		toggleLogoutSidebar();
		console.log("is not login");
	}
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
