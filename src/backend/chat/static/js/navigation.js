const section_hrefs = ['#Home', '#History', '#FAQ', '#About', '#Login', '#Signup', '#Play'];
const HOME_HREF = '#Home';
const HISTORY_HREF = '#History';
const FAQ_HREF = '#FAQ';
const ABOUT_HREF = '#About';
const LOGIN_HREF = '#Login';
const SIGNUP_HREF = '#Signup';
const PLAY_HREF = '#Play';

const HOME_ID = '#home'
const HISTORY_ID = '#history'
const FAQ_ID = '#faq'
const ABOUT_ID = '#about'
const LOGIN_ID = '#login'
const SIGNUP_ID = '#signup'
const PLAY_ID = '#play'

const logo = document.querySelector('.my-navbar-brand');
const homeNavItem = document.querySelector('#home-nav');
const historyNavItem = document.querySelector('#history-nav');
const faqNavItem = document.querySelector('#faq-nav');
const aboutNavItem = document.querySelector('#about-nav');

const navItems = [homeNavItem, historyNavItem, faqNavItem, aboutNavItem];

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
function isAuthenticated() {
	const token = localStorage.getItem('accessToken');
	const refreshToken = localStorage.getItem('refreshToken');
	if (token == null || refreshToken == null) {
		console.log("token or refreshToken is null");
		return false;
	}
	// Check if token is expired
	return Date.now() <= (jwt_decode(token)).exp * 1000
}

// Change Sidebar from before login to after login
async function toggleLoginSidebar() {
	console.log("changing sidebar to login");
	const sidebar_before_login = document.querySelector('#sidebar-before-login');
	const sidebar_after_login = document.querySelector('#sidebar-after-login');

	// Hide the sidebar before login and show the sidebar after login using bootstrap
	sidebar_before_login.classList.add('d-none');
	sidebar_after_login.classList.remove('d-none');

	const username_placeholder = document.getElementById('username-sidebar');
	const profile_image_placeholder = document.getElementById('profile-image-sidebar');
	const wins_placeholder = document.getElementById('wins-sidebar');
	const losses_placeholder = document.getElementById('losses-sidebar');

	const data = await getUserStats();
	if (data == null) {
		console.log("sidebar info is null");
		return;
	}

	console.log("sidebar info: ", data);
	console.log("username: ", data.username);
	console.log("profile_image: ", data.profile_image);
	console.log("wins: ", data.wins);
	// Change the placeholder values
	username_placeholder.textContent = data.username;
	if (data.profile_image == null) {
		data.profile_image = '/static/images/profile_pic_icon.png';
	}
	profile_image_placeholder.setAttribute('src', data.profile_image);
	wins_placeholder.textContent = data.wins;
	losses_placeholder.textContent = data.losses;
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

// Function to go to a specific page
function goToPage(href = window.location.href) {
	hideAllSections();
	console.log("href: ", href);
	// Check if user is logged in and refresh token
	if (isAuthenticated() && refreshToken()) {
		toggleLoginSidebar();
		console.log("User is logged in");
	} else {
		toggleLogoutSidebar();
		console.log("User is not logged in");
	}
	switch (href) {
		case HOME_HREF:
			selectNavItem(homeNavItem);
			showSection(HOME_ID);
			break;
		case HISTORY_HREF:
			showSection(HISTORY_ID);
			break;
		case FAQ_HREF:
			showSection(FAQ_ID);
			break;
		case ABOUT_HREF:
			showSection(ABOUT_ID);
			break;
		case LOGIN_HREF:
			removeNavbarActiveClass();
			showSection(LOGIN_ID);
			break;
		case SIGNUP_HREF:
			removeNavbarActiveClass();
			showSection(SIGNUP_ID);
			break;
		case PLAY_HREF:
			removeNavbarActiveClass();
			showSection(PLAY_ID);
			break;
		default:
			selectNavItem(homeNavItem);
			showSection(HOME_ID);
			break;
	}
}