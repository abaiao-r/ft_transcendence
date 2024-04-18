
// Remove active class from navbar items
function removeNavbarActiveClass() {
	const navItems = document.querySelectorAll('.my-nav-item');
	navItems.forEach(item => {
		item.classList.remove('my-nav-item-active');
	});
}

// Add active class to the navbar item
function addNavbarActiveClass(navItem) {
	navItem.classList.add('my-nav-item-active');
}

// Select the active navigation item
function selectNavItem(navItem) {
	navItems.forEach(item => {
		item.classList.remove('my-nav-item-active');
	});
	navItem.classList.add('my-nav-item-active');
}

// Add click event listener to the logo
logo.addEventListener('click', function(event) {
    hidePlayMenu();
    // Prevent the default action
    event.preventDefault();
	// Remove active class from all navbar items
    removeNavbarActiveClass();
    window.location.href = HOME_HREF;
});

// Add click event listeners to all navigation items
function addNavItemsListeners() {

    navItems.forEach(navItem => {
        navItem.addEventListener('click', function(event) {
            hidePlayMenu();
            event.preventDefault();
            selectNavItem(this);
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

let header = document.querySelector('header');

let resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
        let navHeight = entry.target.offsetHeight;
        document.documentElement.style.setProperty('--nav-height', `${navHeight}px`);
    }
});

resizeObserver.observe(header);