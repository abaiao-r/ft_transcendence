/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   script.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: quackson <quackson@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/03/27 20:36:31 by abaiao-r          #+#    #+#             */
/*   Updated: 2024/03/31 00:41:53 by quackson         ###   ########.fr       */
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

// Add click event listener to the logo
logo.addEventListener('click', function(event) {
    // Prevent the default action
    event.preventDefault();

    // Remove active class from all items
    navItems.forEach(item => {
        item.classList.remove('my-nav-item-active');
    });
    window.location.href = "#Home";
});

// Add click event listeners to all navigation items
function addNavItemsListeners() {

    navItems.forEach(navItem => {
        navItem.addEventListener('click', function(event) {
            event.preventDefault();
            // Remove active class from all items
            navItems.forEach(navItem => {
                navItem.classList.remove('my-nav-item-active');
            });
            // Add active class to the clicked item
            logo.classList.remove('my-nav-item-active');
            this.classList.add('my-nav-item-active');
            // Go to the corresponding page
            const href = this.querySelector('a').getAttribute('href');
            window.location.href = href;
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

// Add event listener to the window object to listen for hash changes
window.addEventListener('hashchange', function(event) {
    goToPage((new URL(event.newURL)).hash); // Pass the new URL's hash as the href argument
});

hideAllSections();
window.location.href = "#Home";
console.log("script.js loaded");
addNavItemsListeners();
homeNavItem.classList.add('my-nav-item-active');
