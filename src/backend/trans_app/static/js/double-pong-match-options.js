document.addEventListener("DOMContentLoaded", function() {
    const playButtons = document.querySelectorAll(".play-menu-button");
    const doublePongButton = playButtons[1];

    doublePongButton.addEventListener("click", function(event) {
        event.preventDefault();
        resetPlayersStateDoublePong();
        window.location.href = DOUBLE_PONG_MATCH_OPTIONS_HREF;
    });
    document.addEventListener('gameOver', function () {
        const gameData = localStorage.getItem('gameData');
        if (gameData) {
            const parsedGameData = JSON.parse(gameData);
            if (parsedGameData[0]["Game Type"] == "Double Pong" && parsedGameData[0]['Game aborted'] == "No") {
                displayWinnerDouble(parsedGameData[1].Name, parsedGameData[2].Name, parsedGameData[3].Name, parsedGameData[4].Name, parsedGameData[1].Score, parsedGameData[2].Score, parsedGameData[3].Score, parsedGameData[4].Score);
                resetPlayersStateDoublePong();
                window.location.href = DOUBLE_PONG_MATCH_OPTIONS_HREF;
            }
        }
    });
});

// Initial states for players
let playerStates = {
    p1: "center",
    p2: "center",
    p3: "center",
    p4: "center"
};


// Function to update background color and image based on player states
function updateBackgroundColorAndImage(player) {
    let sides = ["top", "bottom", "left", "right"];

    // Define image to replace
    if (player === "p1") {
        imagePlayer1 = document.getElementById("profile-image-sidebar").src;
    } else if (player === "p2") {
        imagePlayer2 = document.getElementById("dp-p2-center").src;
    } else if (player === "p3") {
        imagePlayer3 = document.getElementById("dp-p3-center").src;
    } else if (player === "p4") {
        imagePlayer4 = document.getElementById("dp-p4-center").src;
    }


    for (let side of sides) {
        let borderColor = "lightgray";
        for (let player of Object.keys(playerStates)) {
            if ((side === "top" && playerStates[player] === "left") || 
                (side === "bottom" && playerStates[player] === "right")) {
                borderColor = getPlayerColor(player);
                break;
            } else if ((side === "left" && playerStates[player] === "far-left") || 
                       (side === "right" && playerStates[player] === "far-right")) {
                borderColor = getPlayerColor(player);
                break;
            }
        }

        document.getElementById(`player-choosed-double-pong-${side}-side`).style.border = `5px solid ${borderColor}`;
        if (borderColor === "lightgray") {
            document.getElementById(`player-choosed-double-pong-${side}-side`).src = imageAI;
            document.querySelector(`.${side}-side-player-double-pong p`).innerHTML = "AI";
        } else if (borderColor === "#cf0607" && player === "p1") {
            document.getElementById(`player-choosed-double-pong-${side}-side`).src = imagePlayer1;
            document.querySelector(`.${side}-side-player-double-pong p`).innerHTML = document.getElementById("username-sidebar").innerHTML;
        } else if (borderColor === "#1010ce" && player === "p2") {
            document.getElementById(`player-choosed-double-pong-${side}-side`).src = imagePlayer2;
            document.querySelector(`.${side}-side-player-double-pong p`).innerHTML = player;
        } else if (borderColor === "#c6b00e" && player === "p3") {
            document.getElementById(`player-choosed-double-pong-${side}-side`).src = imagePlayer3;
            document.querySelector(`.${side}-side-player-double-pong p`).innerHTML = player;
        } else if (borderColor === "#15de15" && player === "p4") {
            document.getElementById(`player-choosed-double-pong-${side}-side`).src = imagePlayer4;
            document.querySelector(`.${side}-side-player-double-pong p`).innerHTML = player;
        }
    }
}

// Function to get player color
function getPlayerColor(player) {
    switch (player) {
        case "p1":
            return "#cf0607";
        case "p2":
            return "#1010ce";
        case "p3":
            return "#c6b00e";
        case "p4":
            return "#15de15";
        default:
            return "lightgray";
    }
}

// Function to update arrow color based on player states
function updateArrowColorDoublePong() {
    let states = Object.values(playerStates);
    let directions = ["right", "left"];
    let players = ["p1", "p2", "p3", "p4"];

    directions.forEach(direction => {
        let color = (states.includes(direction) && states.includes(`far-${direction}`)) ? "red" : "black";

        players.forEach(player => {
            document.getElementById(`dp-arrow-${direction}-center-${player}`).style.color = color;
        });
    });
}


// Function to transition player state
function transitionPlayer(player, state, hideIds, showIds, previousState) {
    if (Object.values(playerStates).every(s => s !== state) || state === "center") {
        toggleDisplay(hideIds, "none");
        toggleDisplay(showIds, "block");
        playerStates[player] = state;
        updateBackgroundColorAndImage(player);
        updateArrowColorDoublePong(state);
    }  else if ((state === "right" || state === "left") && previousState === "center") {
        let oppositeState = state === "right" ? "left" : "right";
        transitionPlayer(player, `far-${state}`, hideIds, [`dp-${player}-far-${state}-side`, `dp-arrow-${oppositeState}-far-${state}-side-${player}`], previousState);
    } else if ((state === "right" || state === "left") && previousState === `far-${state}`) {
        transitionPlayer(player, "center", hideIds, [`dp-${player}-center`, `dp-arrow-left-center-${player}`, `dp-arrow-right-center-${player}`], previousState);
    } else
        return;
}

// Function to toggle display
function toggleDisplay(ids, display) {
    ids.forEach(id => {
        let element = document.getElementById(id);
        if (element) {
            element.style.display = display;
        } else {
            console.error("Element with ID", id, "not found!"); // Debug statement
        }
    });
}

// Function to initialize event listeners for player transitions
function initializeEventListeners(player) {
    document.getElementById(`dp-arrow-left-center-${player}`).addEventListener("click", () => transitionPlayer(player, "left", [`dp-${player}-center`, `dp-arrow-left-center-${player}`, `dp-arrow-right-center-${player}`], [`dp-arrow-left-left-side-${player}`, `dp-${player}-left-side`, `dp-arrow-right-left-side-${player}`], playerStates[player]));
    document.getElementById(`dp-arrow-right-center-${player}`).addEventListener("click", () => transitionPlayer(player, "right", [`dp-${player}-center`, `dp-arrow-left-center-${player}`, `dp-arrow-right-center-${player}`], [`dp-arrow-left-right-side-${player}`, `dp-${player}-right-side`, `dp-arrow-right-right-side-${player}`], playerStates[player]));
    document.getElementById(`dp-arrow-right-left-side-${player}`).addEventListener("click", () => transitionPlayer(player, "center", [`dp-${player}-left-side`, `dp-arrow-left-left-side-${player}`, `dp-arrow-right-left-side-${player}`], [`dp-${player}-center`, `dp-arrow-left-center-${player}`, `dp-arrow-right-center-${player}`], playerStates[player]));
    document.getElementById(`dp-arrow-left-right-side-${player}`).addEventListener("click", () => transitionPlayer(player, "center", [`dp-${player}-right-side`, `dp-arrow-left-right-side-${player}`, `dp-arrow-right-right-side-${player}`], [`dp-${player}-center`, `dp-arrow-left-center-${player}`, `dp-arrow-right-center-${player}`], playerStates[player]));
    document.getElementById(`dp-arrow-left-left-side-${player}`).addEventListener("click", () => transitionPlayer(player, "far-left", [`dp-${player}-left-side`, `dp-arrow-right-left-side-${player}`, `dp-arrow-left-left-side-${player}`], [`dp-${player}-far-left-side`, `dp-arrow-right-far-left-side-${player}`], playerStates[player]));
    document.getElementById(`dp-arrow-right-right-side-${player}`).addEventListener("click", () => transitionPlayer(player, "far-right", [`dp-${player}-right-side`, `dp-arrow-left-right-side-${player}`, `dp-arrow-right-right-side-${player}`], [`dp-${player}-far-right-side`, `dp-arrow-left-far-right-side-${player}`], playerStates[player]));
    document.getElementById(`dp-arrow-right-far-left-side-${player}`).addEventListener("click", () => transitionPlayer(player, "left", [`dp-${player}-far-left-side`, `dp-arrow-right-far-left-side-${player}`], [`dp-${player}-left-side`, `dp-arrow-right-left-side-${player}`, `dp-arrow-left-left-side-${player}`], playerStates[player]));
    document.getElementById(`dp-arrow-left-far-right-side-${player}`).addEventListener("click", () => transitionPlayer(player, "right", [`dp-${player}-far-right-side`, `dp-arrow-left-far-right-side-${player}`], [`dp-${player}-right-side`, `dp-arrow-left-right-side-${player}`, `dp-arrow-right-right-side-${player}`], playerStates[player]));
}

// Initialize event listeners for all players
for (let player of Object.keys(playerStates)) {
    initializeEventListeners(player);
}

// Function to reset everything
function resetPlayersStateDoublePong() {
    // Reset player states to initial values
    playerStates = {
        p1: "center",
        p2: "center",
        p3: "center",
        p4: "center"
    };

	// print player states
	

    // Hide all elements related to player transitions
    let elementsToHide = [
        "dp-p1-left-side", "dp-arrow-left-left-side-p1", "dp-arrow-right-left-side-p1",
        "dp-p1-right-side", "dp-arrow-left-right-side-p1", "dp-arrow-right-right-side-p1",
        "dp-p1-far-left-side", "dp-arrow-right-far-left-side-p1",
        "dp-p1-far-right-side", "dp-arrow-left-far-right-side-p1",
        "dp-p2-left-side", "dp-arrow-left-left-side-p2", "dp-arrow-right-left-side-p2",
        "dp-p2-right-side", "dp-arrow-left-right-side-p2", "dp-arrow-right-right-side-p2",
        "dp-p2-far-left-side", "dp-arrow-right-far-left-side-p2",
        "dp-p2-far-right-side", "dp-arrow-left-far-right-side-p2",
        "dp-p3-left-side", "dp-arrow-left-left-side-p3", "dp-arrow-right-left-side-p3",
        "dp-p3-right-side", "dp-arrow-left-right-side-p3", "dp-arrow-right-right-side-p3",
        "dp-p3-far-left-side", "dp-arrow-right-far-left-side-p3",
        "dp-p3-far-right-side", "dp-arrow-left-far-right-side-p3",
        "dp-p4-left-side", "dp-arrow-left-left-side-p4", "dp-arrow-right-left-side-p4",
        "dp-p4-right-side", "dp-arrow-left-right-side-p4", "dp-arrow-right-right-side-p4",
        "dp-p4-far-left-side", "dp-arrow-right-far-left-side-p4",
        "dp-p4-far-right-side", "dp-arrow-left-far-right-side-p4"
    ];

	let elementsToShow = [
		"dp-p1-center", "dp-p2-center", "dp-p3-center", "dp-p4-center",
		"dp-arrow-left-center-p1", "dp-arrow-right-center-p1",
		"dp-arrow-left-center-p2", "dp-arrow-right-center-p2",
		"dp-arrow-left-center-p3", "dp-arrow-right-center-p3",
		"dp-arrow-left-center-p4", "dp-arrow-right-center-p4"
	];

    // Hide all elements
    toggleDisplay(elementsToHide, "none");
	// show some elements
	toggleDisplay(elementsToShow, "block");

    // Update background color and image
    updateBackgroundColorAndImage();
	// Reset arrow colors
	updateArrowColorDoublePong();
}

function displayWinnerDouble(p1Name, p2Name, p3Name, p4Name, p1Score, p2Score, p3Score, p4Score) {
    let players = [
        { name: p1Name, score: p1Score },
        { name: p2Name, score: p2Score },
        { name: p3Name, score: p3Score },
        { name: p4Name, score: p4Score }
    ];
    // Runs for all players and finds the one with the highest score
    // Sets the first player as default and iterates through the rest
    // If a player has a higher score than the accumulator (highest),
    // it updates that value and the corresponding player name to return
    let winner = players.reduce((highest, player) => player.score > highest.score ? player : highest, players[0]);
    let toast = document.getElementById('toast-winner-double');
    toast.textContent = `${winner.name} won the match!`;
    toast.style.visibility = "visible";
    setTimeout(function () { toast.style.visibility = "hidden"; }, 5000);
}