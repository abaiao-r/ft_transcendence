
// Add listener to play button
document.addEventListener('DOMContentLoaded', function() {
	const playButton = document.getElementById('play-button');
	const playPong = document.getElementById('start-match');
	const playDoublePong = document.getElementById('start-double-match');

	playButton.addEventListener('click', function(event) {
		togglePlayMenu();
		event.preventDefault();
	});
	playPong.addEventListener('click', function(event) {
		togglePlayMenu();
		event.preventDefault();
		window.location.href = ONE_VS_ONE_LOCAL_HREF;
	});
	playDoublePong.addEventListener('click', function(event) {
		togglePlayMenu();
		event.preventDefault();
		window.location.href = DOUBLE_PONG_HREF;
	});
});
