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

// Function to go to a specific page
function goToPage(href = window.location.href) {
	hideAllSections();
	console.log("href: ", href);
	if (isLogin()) {
		toggleLoginSidebar();
		console.log("is login");
	}
	else {
		toggleLogoutSidebar();
		console.log("is not login");
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