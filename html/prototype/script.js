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
