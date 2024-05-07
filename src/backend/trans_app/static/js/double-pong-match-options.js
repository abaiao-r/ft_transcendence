document.addEventListener("DOMContentLoaded", function() {
    const playButtons = document.querySelectorAll(".play-menu-button");
    const doublePongButton = playButtons[1];

    doublePongButton.addEventListener("click", function(event) {
        event.preventDefault();
        //resetPlayerStatesDouble();
        window.location.href = DOUBLE_PONG_MATCH_OPTIONS_HREF;
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
function updateBackgroundColorAndImage() {
    let sides = ["top", "bottom", "left", "right"];

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
        updateBackgroundColorAndImage();
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
	console.log("Player States: ", playerStates);

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