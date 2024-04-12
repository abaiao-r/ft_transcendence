
// Add listener to play button
document.addEventListener('DOMContentLoaded', function() {
	const playButton = document.getElementById('play-button');
	const playSection = document.getElementById('play');

	playButton.addEventListener('click', function(event) {
		togglePlayMenu();
		event.preventDefault();
		window.location.href = PLAY_HREF;
	});
});

document.getElementById('play-ai-btn').addEventListener('click', function (event) {
	event.preventDefault();
	window.location.href = '/pong';
});