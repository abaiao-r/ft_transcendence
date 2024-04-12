// Add listener to Social button
document.addEventListener('DOMContentLoaded', function() {
    const socialButton = document.getElementById('social-button');

    socialButton.addEventListener('click', function(event) {
        hidePlayMenu();
        event.preventDefault();
        window.location.href = SOCIAL_HREF;
    });
});