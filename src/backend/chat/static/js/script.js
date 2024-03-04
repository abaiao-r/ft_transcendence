/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   script.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abaiao-r <abaiao-r@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/02/20 13:11:43 by abaiao-r          #+#    #+#             */
/*   Updated: 2024/02/20 16:54:48 by abaiao-r         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// This could be a function that checks for a token in localStorage, for example
function isLoggedIn() {
    const token = localStorage.getItem('jwtToken');
    let isLogged = false;
    if (token) {
        // Optionally, you could decode and check the token expiration
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp > Date.now() / 1000) {
            isLogged = true;
        } else {
            localStorage.removeItem('jwtToken'); // Token expired, remove it
            isLogged = false;
        }
    }
    return false;
}


document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.login-btn').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        // Collect username and password values
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;

        // Prepare the data to be sent in the request
        var data = {
            username: username,
            password: password
        };

        // Create an AJAX request to the backend
        fetch('/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include CSRF token header if necessary for your Django setup
                'X-CSRFToken': getCookie('csrftoken') // This requires a getCookie function to get the CSRF token from cookies
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if(data && data.access) {
                localStorage.setItem('jwtToken', data.access); // Save the access token
                window.location.href = '/home';
                updateSidebar();
                showSection('Home'); // Redirect to the home section
            }
            else {
                console.error('Data or data.access is undefined: ', data);
            }
            // Handle success (e.g., redirecting to another page or showing a success message)
            // After successful login
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle errors (e.g., showing an error message to the user)
        });
    });
});

// Function to get cookie by name, necessary for CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('signupSubmit').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Collect form data
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        // Prepare the data to be sent in the request
        const data = { username, email, password };

        // Create an AJAX request to the backend
        fetch('/signup/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include CSRF token header if necessary for your Django setup
                'X-CSRFToken': getCookie('csrftoken') // Assumes the getCookie function is defined as before
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Handle success (e.g., redirecting or showing a success message)
            window.location.href = '/login';
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle errors (e.g., showing an error message to the user)
        });
    });
});


document.addEventListener('DOMContentLoaded', function ()
{
    // Load initial content
    loadContent('Home Page');

    // Add event listeners to navigation links
    document.querySelectorAll('nav ul li a').forEach(function (link)
    {
        link.addEventListener('click', function (event)
        {
            event.preventDefault();
            console.log('Navigation link clicked'); 
            const sectionId = this.getAttribute('href').substring(1);
            loadContent(sectionId);
        });
    });

    // Add event listener to logo image to navigate to home
    document.getElementById('logo').addEventListener('click', function ()
    {
        console.log('Logo clicked'); 
        loadContent('Home Page');
    });
    
    // Add event listener for the Log In button
    document.getElementById('login-button').addEventListener('click', function (event)
    {
        console.log('Log In button clicked'); 
        event.preventDefault(); // Prevent form submission
        loadContent('Login');
        history.pushState({section: 'Login'}, '', '/login');
    });
    // Add event listener for the Sign Up button
    document.getElementById('sign-up-button').addEventListener('click', function (event)
    {
        console.log('Sign Up button clicked'); 
        event.preventDefault(); // Prevent form submission
        loadContent('Sign-Up');
        history.pushState({section: 'Sign-Up'}, '', '/signup');
    });

    // Add event listener for the Log In button in the sidebar
    document.getElementById('login-link').addEventListener('click', function (event) {
        console.log('Log In button clicked'); 
        event.preventDefault(); // Prevent form submission
        loadContent('Login');
    });

    // Add event listener for the Sign Up button in the sidebar
    document.getElementById('sign-up-link').addEventListener('click', function (event) {
        console.log('Sign Up button clicked'); 
        event.preventDefault(); // Prevent form submission
        loadContent('Sign-Up');
    });

    document.getElementById('faq-button').addEventListener('click', function (event) {
        console.log('FAQ button clicked'); 
        event.preventDefault(); // Prevent form submission
        showSection('FAQ');
        loadContent('FAQ');
        history.pushState({section: 'FAQ'}, '', '/faq');
    });

    document.getElementById('about-button').addEventListener('click', function (event) {
        console.log('About button clicked'); 
        event.preventDefault(); // Prevent form submission
        showSection('About')
        loadContent('About');
        history.pushState({section: 'About'}, '', '/about');
    });

    document.getElementById('history-button').addEventListener('click', function (event) {
        console.log('History button clicked'); 
        event.preventDefault(); // Prevent form submission
        showSection('History')
        loadContent('History');
        history.pushState({section: 'History'}, '', '/history');
    });


});

function showSection(section) {
    if (isLoggedIn() && (section === 'Login' || section === 'Sign-Up')) {
        section = 'Home'; // Redirect to home if logged in and trying to access login/signup
    }
    // Hide all sections
    document.querySelectorAll('section').forEach(function(section) {
        section.style.display = 'none';
    });

    // Show the selected section
    const sectionElement = document.getElementById(section);
    if (sectionElement) {
        console.log('Showing section:', section); 
        sectionElement.style.display = 'block';
    }
}

window.addEventListener('popstate', function(event) {
    // Determine the section based on the current path
    var path = window.location.pathname;
    if (path === '/login') {
        showSection('Login');
    } else if (path === '/signup') {
        showSection('Sign-Up');
    } else if (path === '/home') {
        showSection('About');
    } else if (path === '/play') {
        showSection('Play');
    } else if (path === '/social') {
        showSection('Social');
    } else if (path === '/my-profile') {
        showSection('My Profile');
    } else if (path === '/stats') {
        showSection('Stats');
    } else if (path === '/settings') {
        showSection('Settings');
    } else if (path === '/faq') {
        showSection('FAQ');
    } else if (path === '/about') {
        showSection('About');
    } else if (path === '/history') {
        showSection('History');
    }
    else {
        // Handle other paths or show a default section
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Existing setup to show/hide sections...

    // New logic to show the correct section based on the current path
    const currentPath = window.location.pathname;
    if (currentPath === '/login') {
        showSection('Login');
    } else if (currentPath === '/signup') {
        showSection('Sign-Up');
    } else if (currentPath === '/home') {
        showSection('About');
    } else if (currentPath === '/play') {
        showSection('Play');
    } else if (currentPath === '/social') {
        showSection('Social');
    } else if (currentPath === '/my-profile') {
        showSection('My Profile');
    } else if (currentPath === '/stats') {
        showSection('Stats');
    } else if (currentPath === '/settings') {
        showSection('Settings');
    } else if (currentPath === '/faq') {
        showSection('FAQ');
    } else if (currentPath === '/about') {
        showSection('About');
    } else if (currentPath === '/history') {
        showSection('History');
    }
    
    
    // Ensure the showSection function is defined and works as described previously
});

document.addEventListener('DOMContentLoaded', function() {
    updateSidebar();
    // ... rest of your initialization code
});

function handleLogout() {
    fetch('/logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')  // Assuming you have a function to get CSRF token
        },
        // No need to send body data for logout
    })
    .then(response => response.json())
    .then(data => {
        console.log('Logout successful:', data);
        localStorage.removeItem('jwtToken');
        updateSidebar();
    })
    .catch((error) => {
        console.error('Logout error:', error);
    });
    updateSidebar();
}

function TogglePassword() {
    var password = document.getElementById("password");
    var eye = document.getElementById("toggleeye");

    const type = password.getAttribute('type') === 'text' ? 'password' : 'password';
    password.setAttribute('type', type);

    eye.classList.toggle('fa-eye-slash');
}


function updateSidebar() {
    const token = localStorage.getItem('jwtToken');
    if(token) {
        fetch('/getuser/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Include the token in the Authorization header
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const loggedInSidebarHTML = `
                <div class="sidebar">
                    <img src ="${data.profile_image}" class='logo'/>
                    <h3>${data.username}</h3>
                    <p>ELO: ${data.elo}</p>
                    <button class="sidebar-button play" id="play-button">Play</button>
                    <button class="sidebar-button" id="social-button">Social</button>
                    <button class="sidebar-button" id="my-profile-button">My Profile</button>
                    <button class="sidebar-button" id="stats-button">Stats</button>
                    <button class="sidebar-button" id="settings-button">Settings</button>
                    <button class="sidebar-button log-out" id="logout-button">Logout</button>
                </div>
            `;
    
            // Inject the sidebar HTML into the DOM
            const sidebarContainer = document.querySelector('.sidebar');
            sidebarContainer.innerHTML = loggedInSidebarHTML;
            
            // Add any additional logic needed for the new buttons
            // For example, you may want to add event listeners to the buttons
            document.getElementById('play-button').addEventListener('click', () => showSection('Play'));
            document.getElementById('social-button').addEventListener('click', () => showSection('Social'));
            document.getElementById('my-profile-button').addEventListener('click', () => showSection('My Profile'));
            document.getElementById('stats-button').addEventListener('click', () => showSection('Stats'));
            document.getElementById('settings-button').addEventListener('click', () => showSection('Settings'));
        })
        .catch(error => console.error('Error fetching user data:', error));

    }
    // Reattach event listeners as the sidebar content has changed
    if (isLoggedIn()) {
        // Attach event listeners for the logged-in sidebar buttons
        document.getElementById('logout-button').addEventListener('click', handleLogout);
        // ... attach other listeners
    } else {
        // Attach event listeners for the default sidebar buttons
        document.getElementById('login-button').addEventListener('click', () => showSection('Login'));
        document.getElementById('sign-up-button').addEventListener('click', () => showSection('Sign-Up'));
    }
}

/* loadContent: Show the selected section and hide all others
    * sectionId: The id of the section to show
    * this function is called when a navigation link is clicked
 */
function loadContent(sectionId) 
{
    // Hide all sections
    document.querySelectorAll('section').forEach(function (section) {
        section.style.display = 'none';
    });

    // Show the selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    }
}
