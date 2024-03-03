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
    const socialButton = document.getElementById('social-button');
    const myProfileButton = document.getElementById('my-profile-button');
    const statsButton = document.getElementById('stats-button');
    const settingsButton = document.getElementById('settings-button');
    const settingsMenu = document.querySelector('.settings-menu');


    socialButton.addEventListener('click', function() {
        loadContent('Social');
        closePlayMenu();
        navButtons.forEach(btn => btn.classList.remove('active'));
    });

    myProfileButton.addEventListener('click', function() {
        loadContent('My-Profile');
        closePlayMenu();
        navButtons.forEach(btn => btn.classList.remove('active'));
    });

    statsButton.addEventListener('click', function() {
        loadContent('Stats');
        closePlayMenu();
        navButtons.forEach(btn => btn.classList.remove('active'));
    });

    settingsButton.addEventListener('click', function() {
        settingsMenu.classList.toggle('open');
        closePlayMenu();
    });

    playButton.addEventListener('click', function() {
        menu.classList.toggle('open');
    });


    const playMenuButtons = document.querySelectorAll('.play-menu-button');
    const settingsMenuButtons = document.querySelectorAll('.settings-menu-button');
    const mainContent = document.getElementById('main-content');

    playMenuButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const sectionId = button.dataset.sectionId;
            loadContent(sectionId);
            menu.classList.remove('open');
            navButtons.forEach(btn => btn.classList.remove('active'));
        });
    });

    settingsMenuButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const sectionId = button.dataset.sectionId;
            loadContent(sectionId);
            settingsMenu.classList.remove('open');
            navButtons.forEach(btn => btn.classList.remove('active'));
        });
    });

    const navButtons = document.querySelectorAll('nav button.nav-button');
    const logo = document.getElementById('logo');

    function closePlayMenu() {
        if (menu.classList.contains('open')) {
            menu.classList.remove('open');
        }
    }

    function closeSettingsMenu() {
        if (settingsMenu.classList.contains('open')) {
            settingsMenu.classList.remove('open');
        }
    }

    navButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            closePlayMenu();
            closeSettingsMenu();
            const sectionId = this.textContent.trim();
            loadContent(sectionId);
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');// 'active' or 'inactive'
        });
    });

    logo.addEventListener('click', function() {
        closePlayMenu();
        loadContent('Home Page');
        navButtons.forEach(btn => btn.classList.remove('active'));
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
    const mainContent = document.getElementById('main-content');
    if (section) {
        mainContent.appendChild(section); // Append the section to main-content
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
