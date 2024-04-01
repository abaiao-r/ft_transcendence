// Add listener to Social button
document.addEventListener('DOMContentLoaded', function() {
    const socialButton = document.getElementById('social-button');

    socialButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = SOCIAL_HREF;
    });
});