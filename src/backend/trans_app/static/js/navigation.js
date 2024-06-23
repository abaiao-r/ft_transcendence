// Add section href here to be able to show them
const HOME_HREF = '#Home';
const HISTORY_HREF = '#History';
const FAQ_HREF = '#FAQ';
const ABOUT_HREF = '#About';
const LOGIN_HREF = '#Login';
const SIGNUP_HREF = '#Sign-up';
const ONE_VS_ONE_MATCH_OPTIONS_HREF = '#One-vs-one-match-options';
const DOUBLE_PONG_MATCH_OPTIONS_HREF = '#Double-pong-match-options';
const TOURNAMENT_HREF = '#Tournament';
const TOURNAMENT_BRACKET_HREF = '#Tournament-bracket';
const TOURNAMENT_MATCH_HREF = '#Tournament-match';
const ONE_VS_ONE_LOCAL_HREF = '#Play-1-vs-1-local';
const DOUBLE_PONG_HREF = '#Play-double-pong';
const PROFILE_HREF = '#Profile';
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
const ONE_VS_ONE_MATCH_OPTIONS_ID = '#one-vs-one-match-options'
const DOUBLE_PONG_MATCH_OPTIONS_ID = '#double-pong-match-options'
const TOURNAMENT_ID = '#tournament-options'
const TOURNAMENT_BRACKET_ID = '#tournament-bracket'
const TOURNAMENT_MATCH_ID = '#tournament-match'
const ONE_VS_ONE_LOCAL_ID = '#play-1-vs-1-local'
const DOUBLE_PONG_ID = '#play-double-pong'
const MY_PROFILE_ID = '#my-profile'
const SOCIAL_ID = '#social'
const TWO_FACTOR_AUTH_ID = '#two-factor-auth'
const SETTINGS_ID = '#settings'

// Global data store for additional event data
window.eventDataStore = {};

const logo = document.querySelector('.my-navbar-brand');
const historyNavItem = document.querySelector('#history-nav');
const faqNavItem = document.querySelector('#faq-nav');
const aboutNavItem = document.querySelector('#about-nav');

const navItems = [historyNavItem, faqNavItem, aboutNavItem];

// Change Sidebar from before login to after login
async function toggleLoginSidebar() {
	const sidebar_before_login = document.querySelector('#sidebar-before-login');
	const sidebar_after_login = document.querySelector('#sidebar-after-login');

	// Hide the sidebar before login and show the sidebar after login using bootstrap
	sidebar_before_login.classList.add('d-none');
	sidebar_after_login.classList.remove('d-none');

	const username_placeholder = document.getElementById('username-sidebar');
	const profile_image_placeholder = document.getElementById('profile-image-sidebar');
	const wins_placeholder = document.getElementById('wins-sidebar');
	const losses_placeholder = document.getElementById('losses-sidebar');

	const response = await getCurrentUser();
	if (response.error) {
		return;
	}
	const data = response.data;

	// Change the placeholder values
	updateLoginSideBar();
	// username is > 10 characters, add ellipsis to username_placeholder
	if (data.username.length > 10) {
		username_placeholder.innerHTML = data.username.substring(0, 10) + '...';
	} else {
		username_placeholder.innerHTML = data.username;
	}

	if (data.profile_image == null) {
		data.profile_image = '/static/images/profile_pic_icon.png';
	}
	profile_image_placeholder.setAttribute('src', data.profile_image);
}

// Change Sidebar from before login to after login
function toggleLogoutSidebar() {
	
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
    [FAQ_HREF]: [{ func: selectNavItem, args: [faqNavItem] }],
    [ABOUT_HREF]: [{ func: selectNavItem, args: [aboutNavItem] }],
    [SOCIAL_HREF]: [{ func: addFriendsToPage, args: [] }],
    [SETTINGS_HREF]: [{ func: updateSettingsPlaceholders, args: [] }],
	[PROFILE_HREF]: [{ func: showPlayerProfile, args: [] }],
	[TOURNAMENT_HREF]: [{ func: initializeTournamentOptions, args: [] }],
};


// Function to execute page functions
function executePageFunctions(page, newArgs) {
    const functions = pageFunctions[page];
    if (functions) {
        //functions.forEach(({ func, args }) => func(...args));
		// if args is not null then override default args
		if (newArgs != null) {
			functions.forEach(({ func, args }) => func(...newArgs));
		}
		else {
			functions.forEach(({ func, args }) => func(...args));
		}
    }
}

// Function to go to a specific page
async function goToPage(href = window.location.hash, args = null) {
	// call clear loginform and signup form
	clearFormLogin();
	clearFormSignUp();
	// reset players State Pong
	resetPlayerStatesPong();
	// reset players State Double Pong
	resetPlayersStateDoublePong();
	// Hide all sections
    hideAllSections();
	hidePlayMenu();
	// Remove active class from all navbar items
	removeNavbarActiveClass();
	// Clear all display errors
	clearAllPlayerNameErrors();
	// Check if the user is authenticated
	const refreshSuccess = await refreshToken();
    if (refreshSuccess) {
		if (href != "#Two-factor-auth")
        	toggleLoginSidebar();
    } else {
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
		[ONE_VS_ONE_MATCH_OPTIONS_HREF]: ONE_VS_ONE_MATCH_OPTIONS_ID,
		[DOUBLE_PONG_MATCH_OPTIONS_HREF]: DOUBLE_PONG_MATCH_OPTIONS_ID,
		[TOURNAMENT_HREF]: TOURNAMENT_ID,
		[TOURNAMENT_BRACKET_HREF]: TOURNAMENT_BRACKET_ID,
		[TOURNAMENT_MATCH_HREF]: TOURNAMENT_MATCH_ID,
        [ONE_VS_ONE_LOCAL_HREF]: ONE_VS_ONE_LOCAL_ID,
        [DOUBLE_PONG_HREF]: DOUBLE_PONG_ID,
        [PROFILE_HREF]: MY_PROFILE_ID,
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

	// Redirect to home page if page not found
    if (!pages[href]) {
        history.pushState(null, null, HOME_HREF);
		href = HOME_HREF;
    }

	showSection(pages[href]);

	executePageFunctions(href, args);
}

// Improved function to handle page redirection based on the tournament status
function redirectToPageIfForbidden(href, args = null) {
    // Determine the default redirection based on the tournament status
    let defaultRedirect = tournamentManager.hasTournamentStarted() ? TOURNAMENT_BRACKET_HREF : TOURNAMENT_HREF;
	// print args
    switch (href) {
		case TOURNAMENT_BRACKET_HREF:
		case TOURNAMENT_MATCH_HREF:
			// Change hash to defaultRedirect
			history.pushState(null, null, TOURNAMENT_HREF);
            goToPage(defaultRedirect, args);
            break;
        default:
            goToPage(href, args);
            break;
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
		redirectToPageIfForbidden(currentHref);
	}
});

// Navigate to the hash and force a page reload
function navigateToHash(href, args = null) {
	if (window.location.hash === href) {
    	redirectToPageIfForbidden(href, args);
	} else {
		window.eventDataStore.hashChangeDetail = args;
		window.location.hash = href;
	}
}

function handleHashChange(newUrl) {
	const href = (new URL(newUrl)).hash;
	const args = window.eventDataStore.hashChangeDetail;
	delete window.eventDataStore.hashChangeDetail;

    // If href not in section_hrefs go to home page
	if (href == null) {
		this.history.pushState(null, null, HOME_HREF);
    	goToPage(HOME_HREF, args);
	} else {
		redirectToPageIfForbidden(href, args);
	}
}

// Listen for hashchange event
window.addEventListener('hashchange', function(event) {
	handleHashChange(event.newURL);
})

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
        
        return;
    }

    friends = response.data;

    

	// Check if friends object is empty
	if (Object.keys(friends).length === 0) {
		friendsContainer.innerHTML = 'No friends on your list.';
		return;
	}


    Object.entries(friends).forEach(([friendId, friendData]) => {
        // Create friend element
        const friendElement = document.createElement('ul');
        friendElement.className = 'friend-item';

        // Create inner HTML for friend element
        friendElement.innerHTML = `
            <div class="photo-name-item">
                <img src="${friendData['profile-image']}" alt="Friend's Profile Picture" class="profile-pic">
                <p class="friend-name">${friendData['username']}</p>
                <span class="badge badge-success ml-2 text-dark">${friendData['is-online'] ? 'Online' : 'Offline'}</span>
            </div>
            <div class="friend-buttons-item">
				<button class="btn view-profile-button" id="friends-view-profile-button-${friendData['username']}">
					<img src="${staticUrl}images/view-profile.png" alt="view" class="view-profile">
				</button>
				<!-- add img as button <img src="/images/add.png" alt="add" class="add-friend"> -->
				<button class="btn remove-friend-button">
					<img src="${staticUrl}images/remove-friend.png" alt="add" class="add-friend">
				</button>
			</div>
        `;

        // Append friend element to container
        friendsContainer.appendChild(friendElement);

		// Add event listener to the remove-friend-button
		const removeButton = friendElement.querySelector('.remove-friend-button');
		removeButton.onclick = function() { removeFriend(removeButton); };
    });
}

// Update the settings placeholders
async function updateSettingsPlaceholders() {
	const data = await getUserStats(0);
	if (data == null) {
		
		return;
	}

	
	
	
	// Change the placeholder values
	document.getElementById('inputUsername').value = data.username;
	document.getElementById('inputName').value = data.name;
	document.getElementById('inputSurname').value = data.surname;
	document.getElementById('settings-profile-img').setAttribute('src', data.profile_image);
}


// funtion to clear the form fields
function clearFormSignUp() {
    document.getElementById('sign-up-email').value = '';
    document.getElementById('sign-up-username').value = '';
    document.getElementById('sign-up-password').value = '';
    document.getElementById('sign-up-toggle2FA').checked = false;
    //hide the error messages
    document.getElementById('email-error-message').style.display = 'none';
    document.getElementById('username-error-message').style.display = 'none';
    document.getElementById('password-error-message').style.display = 'none';
    // password requirements reset to default
    document.getElementById('length-requirement').classList.remove('valid', 'invalid');
    document.getElementById('length-requirement').querySelector('.icon').textContent = '✗';
    document.getElementById('uppercase-requirement').classList.remove('valid', 'invalid');
    document.getElementById('uppercase-requirement').querySelector('.icon').textContent = '✗';
    document.getElementById('lowercase-requirement').classList.remove('valid', 'invalid');
	document.getElementById('lowercase-requirement').querySelector('.icon').textContent = '✗';
	document.getElementById('digit-requirement').classList.remove('valid', 'invalid');
	document.getElementById('digit-requirement').querySelector('.icon').textContent = '✗';
	document.getElementById('special-requirement').classList.remove('valid', 'invalid');
	document.getElementById('special-requirement').querySelector('.icon').textContent = '✗';
    
    //hide the password requirements
    document.getElementById('password-requirements').style.display = 'none';
}

// funtion to clear the form fields
function clearFormLogin() {
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';

	//hide the error messages
	document.getElementById('error-message').style.display = 'none';
}

