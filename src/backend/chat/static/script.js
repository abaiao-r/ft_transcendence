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

// Get the logo and the navigation items separately by their unique IDs
const logo = document.querySelector('.my-navbar-brand');
const historyNavItem = document.querySelector('#history-nav');
const faqNavItem = document.querySelector('#faq-nav');
const aboutNavItem = document.querySelector('#about-nav');

// Store all navigation items in an array for easier access
const navItems = [historyNavItem, faqNavItem, aboutNavItem];

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

// Add click event listener to the logo
logo.addEventListener('click', function(event) {
    // Prevent the default action
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
});

// Add click event listeners to the navigation items
navItems.forEach(item => {
    item.addEventListener('click', function(event) {
        // Prevent the default action
        event.preventDefault();

        // Remove active class from all items and the logo
        navItems.forEach(item => {
            item.classList.remove('my-nav-item-active');
        });
        logo.classList.remove('my-nav-item-active');

        // Add active class to the clicked item
        this.classList.add('my-nav-item-active');

        // Hide all sections
        hideAllSections();

        // Show the clicked section
        showSection(this.querySelector('a').getAttribute('href'));
    });
});

// Initially hide all sections except #HomePage
hideAllSections();
showSection('#HomePage');