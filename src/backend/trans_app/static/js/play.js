
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
    // Add listener to avoid arrow keys and spacebar scrolling the page when game is active
    document.addEventListener('keydown', function (event) {
        var gameSectionSimple = document.getElementById('play-1-vs-1-local');
        var gameSectionDouble = document.getElementById('play-double-pong');
        if ((gameSectionSimple.style.display !== 'none' || gameSectionDouble.style.display !== 'none')
            && (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === " "))
            event.preventDefault();
    });
});


if (window.location.hash === ONE_VS_ONE_LOCAL_HREF) {
    if (localStorage.getItem("isReload")) {
        localStorage.removeItem("isReload");
    }
    
    window.onbeforeunload = function() {
        localStorage.setItem("isReload", true);
    }
    // Replace with the URL you want to redirect to
    resetPlayerStatesPong();
    window.location.href = ONE_VS_ONE_MATCH_OPTIONS_HREF; 
}

if (window.location.hash === DOUBLE_PONG_HREF) {
    if (localStorage.getItem("isReload")) {
        localStorage.removeItem("isReload");
    }
    
    window.onbeforeunload = function() {
        localStorage.setItem("isReload", true);
    }
    // Replace with the URL you want to redirect to
    resetPlayersStateDoublePong();
    window.location.href = DOUBLE_PONG_MATCH_OPTIONS_HREF; 
}