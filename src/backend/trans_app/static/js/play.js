
// Add listener to play button
document.addEventListener('DOMContentLoaded', function() {
	const playButton = document.getElementById('play-button');
	const playPong = document.getElementById('start-match');
	const playDoublePong = document.getElementById('start-double-match');

	playButton.addEventListener('click', function(event) {
		togglePlayMenu();
		event.preventDefault();
		window.location.href = PLAY_HREF;
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
    // Add listener to avoid arrow keys and spacebar scrolling the page when game is active
    document.addEventListener('keydown', function (event) {
        var gameSectionSimple = document.getElementById('play-1-vs-1-local');
        var gameSectionDouble = document.getElementById('play-double-pong');
        if ((gameSectionSimple.style.display !== 'none' || gameSectionDouble.style.display !== 'none')
            && (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === " "))
            event.preventDefault();
    });
});
