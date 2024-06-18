document.addEventListener('DOMContentLoaded', function() {
    const playButtons = document.querySelectorAll('.play-menu-button');
    const oneVsOneLocalButton = playButtons[0];

    oneVsOneLocalButton.addEventListener('click', function(event) {
        event.preventDefault();
        resetPlayerStatesPong();
        window.location.href = ONE_VS_ONE_MATCH_OPTIONS_HREF;
    });


    document.addEventListener('gameOver', function () {
    
        const gameData = localStorage.getItem('gameData');
        if (gameData) {
            
            const parsedGameData = JSON.parse(gameData);
            if (parsedGameData[0].Tournament == "No" && parsedGameData[0]["Game Type"] == "Simple" && parsedGameData[0]['Game aborted'] == "No") {
                console.log("GameData is not null and Game aborted == NO");
                displayWinnerSimple(parsedGameData[1].Name, parsedGameData[2].Name, parsedGameData[1].Score, parsedGameData[2].Score);
                // Perform the same actions as the oneVsOneLocalButton click event
                resetPlayerStatesPong();
                window.location.href = ONE_VS_ONE_MATCH_OPTIONS_HREF;
            }
            
        }
        else {
            console.info("GameData is Null");
        }
    });
});

// Initial states for players
let playerStatesPong = {
    p1: "center",
    p2: "center"
};

// Function to update background color and image based on player states
function updateBackgroundColorAndImagePong() {
    let sides = ["left", "right"];

    for (let side of sides) {
        let borderColor = "lightgray";
        for (let player of Object.keys(playerStatesPong)) {
            if ((side === "left" && playerStatesPong[player] === "left") || 
                (side === "right" && playerStatesPong[player] === "right")) {
                borderColor = getPlayerColorPong(player);
                break;
            }
        }
        document.getElementById(`player-choosed-${side}-side`).style.border = `5px solid ${borderColor}`;
    }
}

// Function to get player color
function getPlayerColorPong(player) {
    switch (player) {
        case "p1":
            return "#cf0607";
        case "p2":
            return "#1010ce";
        default:
            return "lightgray";
    }
}

// Function to update arrow color
function updateArrowColorPong(player, state) {
    if (state === "right") {
        document.getElementById(`arrow-right-center-${player === "p1" ? "p2" : "p1"}`).style.color = "red";
    }
    else if (state === "left") {
        document.getElementById(`arrow-left-center-${player === "p1" ? "p2" : "p1"}`).style.color = "red";
    }
    else if (state === "center") {
        document.getElementById(`arrow-left-center-${player === "p1" ? "p2" : "p1"}`).style.color = "black";
        document.getElementById(`arrow-right-center-${player === "p1" ? "p2" : "p1"}`).style.color = "black";
    }
}

// Function to update image based on player states
function updateImagePong(player, state, previousState) {
    let imageToBeReplaced;
    let imagePlayer;
    let namePlayer;
    let nameToBeReplaced;


    if (state === "right" || previousState === "right") {
        imageToBeReplaced = document.getElementById("player-choosed-right-side");
        nameToBeReplaced = document.querySelector(".right-side-player p");
    } else if (state === "left" || previousState === "left") {
        imageToBeReplaced = document.getElementById("player-choosed-left-side");
        nameToBeReplaced = document.querySelector(".left-side-player p");
    }

    // Define image to replace
    if (player === "p1") {
        imagePlayer = document.getElementById("profile-image-sidebar");
        namePlayer = document.getElementById("username-sidebar");
    } else {
        imagePlayer = document.getElementById(`${player}-center`);
        namePlayer = player;
        
    }

    // Update the image source based on the state
    if (state === "left" || state === "right") {
        imageToBeReplaced.src = imagePlayer.src;
        if (player === "p1") {
            nameToBeReplaced.innerHTML = namePlayer.innerHTML;
        }
        else {
            nameToBeReplaced.innerHTML = namePlayer;
        }
    } else {
        imageToBeReplaced.src = imageAI;
        nameToBeReplaced.innerHTML = "AI";
    }
}



// Function to transition player state
function transitionPlayerPong(player, state, hideIds, showIds, previousState) {
    
    
    
    
    if(Object.values(playerStatesPong).every(s => s !== state) || state === "center") {
        
        toggleDisplay(hideIds, "none");
        toggleDisplay(showIds, "block");
        // call function update image
        updateImagePong(player, state, previousState);
        playerStatesPong[player] = state;
        updateBackgroundColorAndImagePong();
        // call function updateArrowColorPong
        updateArrowColorPong(player, state);
    }
    else
    	return;
}

// Function to initialize event listeners for player transitions
function initializeEventListenersPong(player) {
    document.getElementById(`arrow-left-center-${player}`).addEventListener("click", () => transitionPlayerPong(player, "left", [`${player}-center`, `arrow-left-center-${player}`, `arrow-right-center-${player}`], [`${player}-left-side`, `arrow-right-left-side-${player}`], playerStatesPong[player]));
    document.getElementById(`arrow-right-center-${player}`).addEventListener("click", () =>  transitionPlayerPong(player, "right", [`${player}-center`, `arrow-left-center-${player}`, `arrow-right-center-${player}`], [`${player}-right-side`, `arrow-left-right-side-${player}`], playerStatesPong[player]));
    document.getElementById(`arrow-right-left-side-${player}`).addEventListener("click", () =>  transitionPlayerPong(player, "center", [`${player}-left-side`, `arrow-right-left-side-${player}`], [`${player}-center`, `arrow-left-center-${player}`, `arrow-right-center-${player}`], playerStatesPong[player]));
    document.getElementById(`arrow-left-right-side-${player}`).addEventListener("click", () =>  transitionPlayerPong(player, "center", [`${player}-right-side`, `arrow-left-right-side-${player}`], [`${player}-center`, `arrow-left-center-${player}`, `arrow-right-center-${player}`], playerStatesPong[player]));
}


//Initialize event listeners for all players
for (let player of Object.keys(playerStatesPong)) {
    initializeEventListenersPong(player);
}

// Function to reset initial states for players
function resetPlayerStatesPong(){
    // Reset player states to initial values
    playerStatesPong = {
        p1: "center",
        p2: "center"
    };

    // Hide all elements related to player transitions
    let elementsToHide = [
        "p1-left-side", "arrow-right-left-side-p1",
        "p1-right-side", "arrow-left-right-side-p1",
        "p2-left-side", "arrow-right-left-side-p2",
        "p2-right-side", "arrow-left-right-side-p2",
    ];

	let elementsToShow = [
		"p1-center", "p2-center", "arrow-left-center-p1", "arrow-right-center-p1",
		"arrow-left-center-p2", "arrow-right-center-p2"
	];

    // Hide all elements
    toggleDisplay(elementsToHide, "none");

	// show some elements
	toggleDisplay(elementsToShow, "block");

    // Update background color and image
    updateBackgroundColorAndImagePong();
	updateImagePong("p1", "center", "left");
	updateImagePong("p2", "center", "right");
	// Reset arrow colors
	updateArrowColorPong("p1", playerStatesPong.p1);
	updateArrowColorPong("p2", playerStatesPong.p2);
}

function displayWinnerSimple(p1Name, p2Name, p1Score, p2Score) {
    let winner = p1Score > p2Score ? p1Name : p2Name;
    let toast = document.getElementById('toast-winner-simple');
    toast.textContent = `${winner} won the match!`;
    toast.style.visibility = "visible";
    setTimeout(function () { toast.style.visibility = "hidden"; }, 5000);
}