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


document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
        item.addEventListener('click', function() {
            this.classList.toggle('active');
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

    document.addEventListener('DOMContentLoaded', function() {
        const faqQuestions = document.querySelectorAll('.faq-question');
    
        faqQuestions.forEach(function(question) {
            question.addEventListener('click', function() {
                const answer = this.nextElementSibling;
                const arrow = this.querySelector('.arrow');
    
                const isOpen = answer.style.display === 'block';
    
                faqQuestions.forEach(function(q) {
                    q.nextElementSibling.style.display = 'none';
                    q.querySelector('.arrow').style.transform = 'rotate(0deg)'; // Reset arrow direction
                });
    
                if (!isOpen) {
                    answer.style.display = 'block';
                    arrow.style.transform = 'rotate(90deg)'; // Rotate arrow when answer is shown
                }
            });
        });
    });

// Add event listener to the document body
document.body.addEventListener('click', function(event) {
    // Check if the clicked element is outside of the navigation bar
    if (!event.target.closest('nav')) {
        // Remove active class from all buttons
        document.querySelectorAll('nav button.nav-button').forEach(function(button) {
            button.classList.remove('active');
        });
    }
});

// Add event listeners to navigation buttons
document.querySelectorAll('nav button.nav-button').forEach(function(button) {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        console.log('Navigation button clicked'); // debug
        const sectionId = this.textContent.trim(); // Use button text as section ID
        loadContent(sectionId);
        
        // Remove active class from all buttons
        document.querySelectorAll('nav button.nav-button').forEach(function(btn) {
            btn.classList.remove('active');
        });
        
        // Add active class to the clicked button
        this.classList.add('active');
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

    // Add event listener for the Play button in the sidebar
    document.getElementById('play-button').addEventListener('click', function () {
        console.log('Play button clicked'); // debug
        const menu = document.querySelector('.play-menu');
        menu.classList.toggle('open');
    });

    // Add event listener for the Log Out button in the sidebar
/*     document.getElementById('logout-link').addEventListener('click', function (event) {
        console.log('Log Out button clicked'); // debug
        event.preventDefault(); // Prevent form submission
        // Simulating logout
        updateSidebar(false);
    }); */

    // Simulating login status
    const isLoggedIn = false; // Set to true if user is logged in
    updateSidebar(isLoggedIn);
});

/* loadContent: Show the selected section and hide all others
    * sectionId: The id of the section to show
    * this function is called when a navigation link is clicked
*/
function loadContent(sectionId) 
{
    // Hide all sections
    document.querySelectorAll('section:not(.sidebar section)').forEach(function (section) {
        section.style.display = 'none';
    });

    // Show the selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    }
}

function updateSidebar(isLoggedIn) {
    const sidebarBeforeLogin = document.getElementById('sidebar-before-login');
    const sidebarAfterLogin = document.getElementById('sidebar-after-login');

    if (isLoggedIn) {
        // User is logged in, show the sidebar after login
        sidebarBeforeLogin.style.display = 'none';
        sidebarAfterLogin.style.display = 'block';
    } else {
        // User is not logged in, show the sidebar before login
        sidebarBeforeLogin.style.display = 'block';
        sidebarAfterLogin.style.display = 'none';
    }
}