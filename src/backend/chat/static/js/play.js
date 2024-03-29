
// Add listener to play button
document.addEventListener('DOMContentLoaded', function() {
	const playButton = document.getElementById('play-button');
	const playSection = document.getElementById('play');

	playButton.addEventListener('click', function(event) {
		event.preventDefault();
		goToPage("#Play");
	});
});