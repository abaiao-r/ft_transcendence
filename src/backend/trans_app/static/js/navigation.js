// Add section href here to be able to show them
const HOME_HREF = '#Home';
const HISTORY_HREF = '#History';
const FAQ_HREF = '#FAQ';
const ABOUT_HREF = '#About';
const LOGIN_HREF = '#Login';
const SIGNUP_HREF = '#Sign-up';
const PLAY_HREF = '#Play';
const ONE_VS_ONE_LOCAL_HREF = '#Play-1-vs-1-local';
const DOUBLE_PONG_HREF = '#Play-double-pong';
const MY_PROFILE_HREF = '#My-profile';
const STATS_HREF = '#Stats';
const SOCIAL_HREF = '#Social';
const TWO_FACTOR_AUTH_HREF = '#Two-factor-auth';
const SETTINGS_HREF = '#Settings'

// Add section id here to be able to show them
const HOME_ID = '#home'
const HISTORY_ID = '#history'
const FAQ_ID = '#faq'
const ABOUT_ID = '#about'
const LOGIN_ID = '#login'
const SIGNUP_ID = '#sign-up'
const PLAY_ID = '#play'
const ONE_VS_ONE_LOCAL_ID = '#play-1-vs-1-local'
const DOUBLE_PONG_ID = '#play-double-pong'
const MY_PROFILE_ID = '#my-profile'
const STATS_ID = '#stats'
const SOCIAL_ID = '#social'
const TWO_FACTOR_AUTH_ID = '#two-factor-auth'
const SETTINGS_ID = '#settings'

// Map the href to the section id
const sectionMap = {
	HOME_HREF: HOME_ID,
	HISTORY_HREF: HISTORY_ID,
	FAQ_HREF: FAQ_ID,
	ABOUT_HREF: ABOUT_ID,
	LOGIN_HREF: LOGIN_ID,
	SIGNUP_HREF: SIGNUP_ID,
	PLAY_HREF: PLAY_ID,
	ONE_VS_ONE_LOCAL_HREF: ONE_VS_ONE_LOCAL_ID,
	DOUBLE_PONG_HREF: DOUBLE_PONG_ID,
	MY_PROFILE_HREF: MY_PROFILE_ID,
	STATS_HREF: STATS_ID,
	SOCIAL_HREF: SOCIAL_ID,
	TWO_FACTOR_AUTH_HREF: TWO_FACTOR_AUTH_ID,
	SETTINGS_HREF: SETTINGS_ID
}

const logo = document.querySelector('.my-navbar-brand');
const historyNavItem = document.querySelector('#history-nav');
const faqNavItem = document.querySelector('#faq-nav');
const aboutNavItem = document.querySelector('#about-nav');

const navItems = [historyNavItem, faqNavItem, aboutNavItem];

// Decode JWT token
function jwt_decode(token) {
	// Decode token
	const base64Url = token.split('.')[1];
	// Decode base64
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	// Decode JSON
	const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));
	// Return JSON object
	return JSON.parse(jsonPayload);
}

// Check if user is logged in
function isAuthenticated() {
	const token = localStorage.getItem('accessToken');
	const refreshToken = localStorage.getItem('refreshToken');
	console.log("token is auth: ", token);
	console.log("refreshToken is auth: ", refreshToken);

	if (token === null || refreshToken === null) {
		console.log("Either token or refreshToken is null.");
		return false;
	}

	try {
		// Check if the token is expired
		const decodedToken = jwt_decode(token);
		const isTokenExpired = Date.now() > decodedToken.exp * 1000;
		if (isTokenExpired) {
			console.log("Token has expired.");
			return false;
		}
		return true; // Token is valid and not expired
	} catch (error) {
		// Handle possible errors from decoding an invalid token
		console.error("Error decoding token:", error);
		return false;
	}
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

//function to show sidebar-nested
function showSidebarNested() {
	const sidebar_nested = document.querySelector('.sidebar-nested');
	sidebar_nested.style.display = 'block';
}

//function to hide sidebar-nested
function hideSidebarNested() {
	const sidebar_nested = document.querySelector('.sidebar-nested');
	sidebar_nested.style.display = 'none';
}

// Function to hide sidebar play-menu
function hidePlayMenu() {
	const play_menu = document.querySelector('#play-menu');
	hideSidebarNested();
	play_menu.style.display = 'none';
}

// Function to show sidebar play-menu
function showPlayMenu() {
	const play_menu = document.querySelector('#play-menu');
	showSidebarNested();
	play_menu.style.display = 'block';

	console.log("showing play menu");
}

// function to hide or show play menu
function togglePlayMenu() {
    const play_menu = document.querySelector('#play-menu');
    if (play_menu.style.display === 'block') {
        hidePlayMenu();
    } else {
        showPlayMenu();
    }
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
function goToPage(href = window.location.hash) {
	// Hide all sections
    hideAllSections();
	// Remove active class from all navbar items
	removeNavbarActiveClass();
	// If the user is authenticated, show the login sidebar, otherwise show the logout sidebar
	const isAuth = isAuthenticated();
    if (isAuth) {
        toggleLoginSidebar();
    } else {
        toggleLogoutSidebar();
    }

	// Store the current href in localStorage
    localStorage.setItem('currentHref', href);
	console.log("href: ", href);

    // Define pages accessible when logged in or logged out
    const pages = isAuth ? {
		// Pages accessible to logged in users
        [HOME_HREF]: { sectionId: HOME_ID },
        [HISTORY_HREF]: { sectionId: HISTORY_ID, needsNavbarActive: true },
        [FAQ_HREF]: { sectionId: FAQ_ID, needsNavbarActive: true },
        [ABOUT_HREF]: { sectionId: ABOUT_ID, needsNavbarActive: true },
        [PLAY_HREF]: { sectionId: PLAY_ID },
		[ONE_VS_ONE_LOCAL_HREF]: { sectionId: ONE_VS_ONE_LOCAL_ID },
		[DOUBLE_PONG_HREF]: { sectionId: DOUBLE_PONG_ID },
		[MY_PROFILE_HREF]: { sectionId: MY_PROFILE_ID },
		[STATS_HREF]: { sectionId: STATS_ID },
        [SOCIAL_HREF]: { sectionId: SOCIAL_ID, needsFetchFriends: true},
        [SETTINGS_HREF]: { sectionId: SETTINGS_ID, updateSettings: true }
    } : {
		// Pages accessible to logged out users
        [HOME_HREF]: { sectionId: HOME_ID },
        [HISTORY_HREF]: { sectionId: HISTORY_ID, needsNavbarActive: true },
        [FAQ_HREF]: { sectionId: FAQ_ID , needsNavbarActive: true },
        [ABOUT_HREF]: { sectionId: ABOUT_ID, needsNavbarActive: true },
        [LOGIN_HREF]: { sectionId: LOGIN_ID  },
        [SIGNUP_HREF]: { sectionId: SIGNUP_ID  },
        [TWO_FACTOR_AUTH_HREF]: { sectionId: TWO_FACTOR_AUTH_ID }
    };

    // Determine the page details based on the href
    const page = pages[href] || { sectionId: HOME_ID };

    // If the user is not authenticated and the href is not in the pages accessible for logged out users, redirect to HOME_HREF
    if (!isAuth && !pages[href]) {
        history.pushState(null, null, HOME_HREF);
    } else if (!pages[href]) {
        history.pushState(null, null, HOME_HREF);
    }

    // Show the selected section
    showSection(page.sectionId);

    if (page.needsNavbarActive) {
		let navItem = document.querySelector(`${page.sectionId}-nav`);
        selectNavItem(navItem);
    }
	if (page.updateSettings) {
		updateSettingsPlaceholders();
	}
	if (page.needsFetchFriends) {
		addFriendsToPage();
	}
}

// Load the page with the last stored href when the page is reloaded
window.addEventListener('load', function() {
	hideAllSections();
	addNavItemsListeners();

    const currentHref = localStorage.getItem('currentHref');

	if (currentHref == null) {
		this.history.pushState(null, null, HOME_HREF);
    	goToPage(HOME_HREF);
	} else {
		goToPage(currentHref);
	}
});

// Listen for hashchange event
window.addEventListener('hashchange', function(event) {
    // If href not in section_hrefs go to home page
    console.log("hashchange event triggered");
    console.log("event.newURL: " + event.newURL);
    goToPage((new URL(event.newURL)).hash);
});