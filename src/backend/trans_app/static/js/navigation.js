// Add section href here to be able to show them
const HOME_HREF = '#Home';
const HISTORY_HREF = '#History';
const FAQ_HREF = '#FAQ';
const ABOUT_HREF = '#About';
const LOGIN_HREF = '#Login';
const SIGNUP_HREF = '#Sign-up';
const ONE_VS_ONE_MATCH_OPTIONS_HREF = '#One-vs-one-match-options';
const DOUBLE_PONG_MATCH_OPTIONS_HREF = '#Double-pong-match-options';
const TOURNAMENT_HREF = '#Tournament-options';
const TOURNAMENT_BRACKET_HREF = '#Tournament-bracket';
const TOURNAMENT_MATCH_HREF = '#Tournament-match';
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
	// Change the placeholder values
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
	console.log("section: ", section);
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
	[MY_PROFILE_HREF]: [{ func: myProfileFunction, args: [] }]
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
	console.log("href at gotopage: ", href);
	// Check if the user is authenticated
	const refreshSuccess = await refreshToken();
	console.log("token :" , refreshSuccess)
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
		[ONE_VS_ONE_MATCH_OPTIONS_HREF]: ONE_VS_ONE_MATCH_OPTIONS_ID,
		[DOUBLE_PONG_MATCH_OPTIONS_HREF]: DOUBLE_PONG_MATCH_OPTIONS_ID,
		[TOURNAMENT_HREF]: TOURNAMENT_ID,
		[TOURNAMENT_BRACKET_HREF]: TOURNAMENT_BRACKET_ID,
		[TOURNAMENT_MATCH_HREF]: TOURNAMENT_MATCH_ID,
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
	console.log("hash diff listener")
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
				<button class="btn view-profile-button">
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

