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

/* document.addEventListener('DOMContentLoaded', function() {
    // Redirect to /login when the "Login" button is clicked
    document.getElementById('login-button').addEventListener('click', function() {
        window.location.href = '/login';
    });

    // Redirect to /signup when the "Sign Up" button is clicked
    document.getElementById('sign-up-button').addEventListener('click', function() {
        window.location.href = '/signup';
    });
}); */

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
            // Handle success (e.g., redirecting to another page or showing a success message)
            window.location.href = '/login';
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



/* document.addEventListener('DOMContentLoaded', function ():
    * This function is called when the page is fully loaded
    * It is used to add event listeners to the page elements
*/
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
            console.log('Navigation link clicked'); // debug
            const sectionId = this.getAttribute('href').substring(1);
            loadContent(sectionId);
        });
    });

    // Add event listener to logo image to navigate to home
    document.getElementById('logo').addEventListener('click', function ()
    {
        console.log('Logo clicked'); // debug
        loadContent('Home Page');
    });



    
    // Add event listener for the Log In button
    document.getElementById('login-button').addEventListener('click', function (event)
    {
        console.log('Log In button clicked'); // debug
        event.preventDefault(); // Prevent form submission
        loadContent('Login');
        history.pushState({section: 'Login'}, '', '/login');
    });
    // Add event listener for the Sign Up button
    document.getElementById('sign-up-button').addEventListener('click', function (event)
    {
        console.log('Sign Up button clicked'); // debug
        event.preventDefault(); // Prevent form submission
        loadContent('Sign-Up');
        history.pushState({section: 'Sign-Up'}, '', '/signup');
    });

    // Add event listener for the Log In button in the sidebar
    document.getElementById('login-link').addEventListener('click', function (event) {
        console.log('Log In button clicked'); // debug
        event.preventDefault(); // Prevent form submission
        loadContent('Login');
    });

    // Add event listener for the Sign Up button in the sidebar
    document.getElementById('sign-up-link').addEventListener('click', function (event) {
        console.log('Sign Up button clicked'); // debug
        event.preventDefault(); // Prevent form submission
        loadContent('Sign-Up');
    });


});

function showSection(section) {
    // Hide all sections
    document.querySelectorAll('section').forEach(function(section) {
        section.style.display = 'none';
    });

    // Show the selected section
    const sectionElement = document.getElementById(section);
    if (sectionElement) {
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
    } else {
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
    }
    
    // Ensure the showSection function is defined and works as described previously
});

function TogglePassword() {
    var password = document.getElementById("passwordup");
    var eye = document.getElementById("toggleeye");

    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);

    eye.classList.toggle('fa-eye-slash');
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
