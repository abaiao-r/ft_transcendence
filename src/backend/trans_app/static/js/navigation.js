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
const SOCIAL_ID = '#social'
const TWO_FACTOR_AUTH_ID = '#two-factor-auth'
const SETTINGS_ID = '#settings'

const logo = document.querySelector('.my-navbar-brand');
const historyNavItem = document.querySelector('#history-nav');
const faqNavItem = document.querySelector('#faq-nav');
const aboutNavItem = document.querySelector('#about-nav');

const navItems = [historyNavItem, faqNavItem, aboutNavItem];

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

// Define page functions
// how to add a new function to a page:
// 1. Add the href to the pageFunctions object
// 2. Add the function to the pageFunctions object
// 3. Add the arguments to the function in the pageFunctions object
// 4. You can add more functions to the pageFunctions object
const pageFunctions = {
    [HISTORY_HREF]: [{ func: selectNavItem, args: [historyNavItem] }, /* Add more trigger functions here for example */],
	[PLAY_HREF]: [{func: showPlayMenu, args: []}],
    [FAQ_HREF]: [{ func: selectNavItem, args: [faqNavItem] }],
    [ABOUT_HREF]: [{ func: selectNavItem, args: [aboutNavItem] }],
    [SOCIAL_HREF]: [{ func: addFriendsToPage, args: [] }],
    [SETTINGS_HREF]: [{ func: updateSettingsPlaceholders, args: [] }]
};

// Function to execute page functions
function executePageFunctions(page) {
    const functions = pageFunctions[page];
    if (functions) {
        functions.forEach(({ func, args }) => func(...args));
    }
}

// Function to go to a specific page
async function goToPage(href = window.location.hash) {
	// Hide all sections
    hideAllSections();
	hidePlayMenu();
	// Remove active class from all navbar items
	removeNavbarActiveClass();

	console.log("href at gotopage: ", href);
	// Check if the user is authenticated
	const refreshSuccess = await refreshToken();
    if (refreshSuccess) {
		if (href != "#Two-factor-auth")
        	toggleLoginSidebar();
    } else {
		console.log("we entered in the else clause (navigation)")
        toggleLogoutSidebar();
    }

	// Store the current href in localStorage
    localStorage.setItem('currentHref', href);

    // Define pages accessible when logged in or logged out
	const pages = refreshSuccess ? {
        // Pages accessible to logged in users
        [HOME_HREF]: HOME_ID,
        [HISTORY_HREF]: HISTORY_ID,
        [FAQ_HREF]: FAQ_ID,
        [ABOUT_HREF]: ABOUT_ID,
        [PLAY_HREF]: PLAY_ID,
        [ONE_VS_ONE_LOCAL_HREF]: ONE_VS_ONE_LOCAL_ID,
        [DOUBLE_PONG_HREF]: DOUBLE_PONG_ID,
        [MY_PROFILE_HREF]: MY_PROFILE_ID,
        [SOCIAL_HREF]: SOCIAL_ID,
        [SETTINGS_HREF]: SETTINGS_ID,
		[TWO_FACTOR_AUTH_HREF]: TWO_FACTOR_AUTH_ID
    } : {
        // Pages accessible to logged out users
        [HOME_HREF]: HOME_ID,
        [HISTORY_HREF]: HISTORY_ID,
        [FAQ_HREF]: FAQ_ID,
        [ABOUT_HREF]: ABOUT_ID,
        [LOGIN_HREF]: LOGIN_ID,
        [SIGNUP_HREF]: SIGNUP_ID,
        [TWO_FACTOR_AUTH_HREF]: TWO_FACTOR_AUTH_ID
    };

	if (pages[href]) {
		console.log("href at redir sucess: ", pages[href]);
    }

	// Redirect to home page if page not found
    if (!pages[href]) {
		console.log("href at redir fail: ", pages[href]);
        history.pushState(null, null, HOME_HREF);
		href = HOME_HREF;
    }

	showSection(pages[href]);
	executePageFunctions(href);
}

// Load the page with the last stored href when the page is reloaded
window.addEventListener('load', function() {
	hideAllSections();
	addNavItemsListeners();

    const currentHref = localStorage.getItem('currentHref');
	//const currentHref = window.location.hash;
	console.log("href at reload: ", currentHref);
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
    goToPage((new URL(event.newURL)).hash);
});

/******** Page trigger functions ********/

// Select the active navigation item
function selectNavItem(navItem) {
	navItems.forEach(item => {
		item.classList.remove('my-nav-item-active');
	});
	navItem.classList.add('my-nav-item-active');
}

// Add friends to social page
async function addFriendsToPage() {
    const friendsContainer = document.getElementById('list-friends');
    friendsContainer.innerHTML = ''; // Clear the existing friends

    const response = await fetchFriends();

    if (response.error) {
        console.log(response.message);
        return;
    }

    friends = response.data;

    console.log("Friends: ", friends);


    Object.entries(friends).forEach(([friendId, friendData]) => {
        // Create friend element
        const friendElement = document.createElement('li');
        friendElement.className = 'list-group-item d-flex justify-content-between align-items-center';

        // Create inner HTML for friend element
        friendElement.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${friendData['profile-image']}" alt="Friend's Profile Picture" class="rounded-circle mr-3" style="width: 50px; height: 50px;">
                <span class="friend-name ml-2">${friendData['username']}</span>
                <span class="badge badge-success ml-2 text-dark">${friendData['is-online'] ? 'Online' : 'Offline'}</span>
            </div>
            <div>
                <button class="btn btn-primary mr-2" type="button" style="width: 115px;">View Profile</button>
<button class="btn btn-danger" type="button" onclick="removeFriend(this)" style="width: 115px;">Remove</button>
            </div>
        `;

        // Append friend element to container
        friendsContainer.appendChild(friendElement);
    });
}

// Update the settings placeholders
async function updateSettingsPlaceholders() {
	const data = await getUserStats();
	if (data == null) {
		console.log("sidebar info is null");
		return;
	}

	console.log("updateSettingsPlaceholders info: ", data);
	console.log("username: ", data.username);
	console.log("profile_image: ", data.profile_image);
	// Change the placeholder values
	document.getElementById('inputUsername').value = data.username;
	document.getElementById('inputName').value = data.name;
	document.getElementById('inputSurname').value = data.surname;
	document.getElementById('settings-profile-img').setAttribute('src', data.profile_image);
}