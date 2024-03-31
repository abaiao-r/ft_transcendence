/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   script.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: quackson <quackson@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/03/27 20:36:31 by abaiao-r          #+#    #+#             */
/*   Updated: 2024/03/31 02:27:45 by quackson         ###   ########.fr       */
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

// Add click event listener to the logo
logo.addEventListener('click', function(event) {
    // Prevent the default action
    event.preventDefault();

    // Remove active class from all items
    navItems.forEach(item => {
        item.classList.remove('my-nav-item-active');
    });
    window.location.href = HOME_HREF;
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
    // If href not in section_hrefs go to home page
    if (section_hrefs.indexOf((new URL(event.newURL)).hash) == -1) {
        goToPage(HOME_HREF)
    }
    // If the new URL is the same as the old URL, do nothing
    else if (event.newURL === event.oldURL) {
        return;
    }
    else {
        goToPage((new URL(event.newURL)).hash);
    }
});

addNavItemsListeners();
// Make the home page the default page
hideAllSections();
window.location.href = HOME_HREF;
goToPage(HOME_HREF);
homeNavItem.classList.add('my-nav-item-active');

console.log("script.js loaded");
