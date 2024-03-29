/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   script.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: quackson <quackson@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/03/27 20:36:31 by abaiao-r          #+#    #+#             */
/*   Updated: 2024/03/29 00:23:48 by quackson         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// Get the logo and the navigation items separately by their unique IDs
const logo = document.querySelector('.my-navbar-brand');
const homeNavItem = document.querySelector('#home-nav');
const historyNavItem = document.querySelector('#history-nav');
const faqNavItem = document.querySelector('#faq-nav');
const aboutNavItem = document.querySelector('#about-nav');

// Store all navigation items in an array for easier access
const navItems = [homeNavItem, historyNavItem, faqNavItem, aboutNavItem];
const sections = ['#HomePage', '#history', '#faq', '#about']

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

    // Hide all sections
    hideAllSections();

    // Show the HomePage section
    showSection('#HomePage');
});

// Add click event listeners to all navigation items
function addNavItemsListeners() {

    navItems.forEach(navItem => {
        navItem.addEventListener('click', function(event) {
            event.preventDefault();
            navItems.forEach(navItem => {
                navItem.classList.remove('my-nav-item-active');
            });
            logo.classList.remove('my-nav-item-active');
            this.classList.add('my-nav-item-active');
            hideAllSections();
            // Get the href attribute of the anchor tag inside the clicked item
            const href = this.querySelector('a').getAttribute('href');
            // Follow href
            window.location.href = href;
            showSection(
                sections[navItems.indexOf(this)]
            );
            
        }
    )});
}

// FAQ accordion
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(function(question) {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
            } else {
                answer.style.display = 'block';
            }
        });
    });
});



// Initially hide all sections except #HomePage
addNavItemsListeners();
hideAllSections();
showSection('#HomePage');
