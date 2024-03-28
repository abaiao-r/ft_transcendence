/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   script.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abaiao-r <abaiao-r@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/03/27 20:36:31 by abaiao-r          #+#    #+#             */
/*   Updated: 2024/03/27 23:44:15 by abaiao-r         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const components_folder = 'components/';

// Get the logo and the navigation items separately by their unique IDs
/* const logo = document.querySelector('#logo');
const historyNavItem = document.querySelector('#history-nav');
const faqNavItem = document.querySelector('#faq-nav');
const aboutNavItem = document.querySelector('#about-nav'); */

/* ************************************************************************** */
/* Section where HTML is fetched and injected */

// Function to fetch and inject HTML content into specified container
function fetchAndInjectContent(url, containerId) {
	fetch(url)
		.then(response => response.text())
		.then(html => {
			document.getElementById(containerId).innerHTML = html;
			// Call the function to show sections after injecting content
			hideAllSections();
			showSection('#HomePage');
		});
}

// Fetch and inject navbar content
fetchAndInjectContent(components_folder + 'navbar.html', 'navbarContainer');
// Fetch and inject sidebar content
fetchAndInjectContent(components_folder + 'sidebar.html', 'sidebarContainer');
// Fetch and inject main content
fetchAndInjectContent(components_folder + 'main-content.html', 'mainContentContainer');

/* ************************************************************************** */

// Store all navigation items in an array for easier access
//const navItems = [historyNavItem, faqNavItem, aboutNavItem];

// Function to hide all sections
function hideAllSections() {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
}

// Function to show a specific section
function showSection(id) {
	// print id
	console.log(id);
    const section = document.querySelector(id);
    if (section) {
        section.style.display = 'block';
    }
}

// Add click event listeners directly to the navigation items
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.my-navbar-brand');
	const historyNavItem = document.querySelector('#history-nav');
	const faqNavItem = document.querySelector('#faq-nav');
	const aboutNavItem = document.querySelector('#about-nav');


    // Add event listener for clicks on the document
    document.addEventListener('click', function(event) {
        const target = event.target;
        // Check if the clicked element matches any of the navigation items
		if (target.matches('#logo')) {
			// Handle click on logo
			event.preventDefault();
			// Remove active class from all items
			navItems.forEach(item => {
				item.classList.remove('my-nav-item-active');
			});
			// Add active class to the logo
			this.classList.add('my-nav-item-active');
			// Hide all sections
			hideAllSections();
			// Show the HomePage section
			showSection('#HomePage');
		}

        else if (target.matches('#history-nav')) {
            // Handle click on historyNavItem
			console.log('#history-nav');
            event.preventDefault();
            hideAllSections();
            showSection('#history');

        } else if (target.matches('#faq-nav')) {
            // Handle click on faqNavItem
			console.log('#faq-nav');
            event.preventDefault();
            hideAllSections();
            showSection('#faq');

        } else if (target.matches('#about-nav')) {
            // Handle click on aboutNavItem
			console.log('#about-nav');
            event.preventDefault();
            hideAllSections();
            showSection('#about');
        }
    });
});
/* 		const all = document.querySelectorAll('div');
		const logo = document.querySelector('#logo');
		const historyNavItem = document.querySelector('#history-nav');
		const faqNavItem = document.querySelector('#faq-nav');
		const aboutNavItem = document.querySelector('#about-nav'); */

