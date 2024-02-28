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

    // Load initial content
    loadContent('Home Page');
    
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
        item.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });

    const playButton = document.getElementById('play-button');
    const menu = document.querySelector('.play-menu');

    playButton.addEventListener('click', function() {
        menu.classList.toggle('open');
    });

    const playMenuButtons = document.querySelectorAll('.play-menu-button');
    const mainContent = document.getElementById('main-content');

    playMenuButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const sectionId = button.dataset.sectionId;
            loadContent(sectionId);
            menu.classList.remove('open');
        });
    });

    const navButtons = document.querySelectorAll('nav button.nav-button');
    const logo = document.getElementById('logo');

    function closePlayMenu() {
        if (menu.classList.contains('open')) {
            menu.classList.remove('open');
        }
    }

    navButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            closePlayMenu();
            const sectionId = this.textContent.trim();
            loadContent(sectionId);
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    logo.addEventListener('click', function() {
        closePlayMenu();
        loadContent('Home Page');
    });

    const loginButton = document.getElementById('login-button');
    const signUpButton = document.getElementById('sign-up-button');
    const loginLink = document.getElementById('login-link');
    const signUpLink = document.getElementById('sign-up-link');

    loginButton.addEventListener('click', function(event) {
        event.preventDefault();
        closePlayMenu();
        loadContent('Login');
    });

    signUpButton.addEventListener('click', function(event) {
        event.preventDefault();
        closePlayMenu();
        loadContent('Sign-Up');
    });

    loginLink.addEventListener('click', function(event) {
        event.preventDefault();
        closePlayMenu();
        loadContent('Login');
    });

    signUpLink.addEventListener('click', function(event) {
        event.preventDefault();
        closePlayMenu();
        loadContent('Sign-Up');
    });

    // Simulating login status
    const isLoggedIn = true; // Set to true if user is logged in
    updateSidebar(isLoggedIn);
});

function loadContent(sectionId) {
    const sections = document.querySelectorAll('section:not(.sidebar section)');
    sections.forEach(section => section.style.display = 'none');
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
