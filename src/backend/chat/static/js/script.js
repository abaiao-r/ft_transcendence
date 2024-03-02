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

// This snippet should be added to the script.js file
document.addEventListener('DOMContentLoaded', function() {
    // Assuming you have a button with class 'login-btn' for form submission
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
    });
    // Add event listener for the Sign Up button
    document.getElementById('sign-up-button').addEventListener('click', function (event)
    {
        console.log('Sign Up button clicked'); // debug
        event.preventDefault(); // Prevent form submission
        loadContent('Sign-Up');
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
