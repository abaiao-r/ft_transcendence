document.addEventListener("DOMContentLoaded", function() {
    const playButtons = document.querySelectorAll(".play-menu-button");
    const doublePongButton = playButtons[1];

    doublePongButton.addEventListener("click", function(event) {
        event.preventDefault();
        resetPlayerStatesDouble();
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

let p4Selected;
let playerCounter;

// Reset initial states for players
function resetPlayerStatesDouble(){
    p4Selected = false;
    playerCounter = 1;
    playerStates = {
        p1: "center",
        p2: "center",
        p3: "center",
        p4: "center"
    };
    // Show center elements
    toggleDisplay(["dp-p1-center", "dp-arrow-left-center-p1", "dp-arrow-right-center-p1"], "block");
    toggleDisplay(["dp-p2-center", "dp-arrow-left-center-p2", "dp-arrow-right-center-p2"], "none");
    toggleDisplay(["dp-p3-center", "dp-arrow-left-center-p3", "dp-arrow-right-center-p3"], "none");
    toggleDisplay(["dp-p4-center", "dp-arrow-left-center-p4", "dp-arrow-right-center-p4"], "none");
    // Change center arrows color to black
    document.getElementById("dp-arrow-left-center-p1").style.color = "black";
    document.getElementById("dp-arrow-right-center-p1").style.color = "black";
    document.getElementById("dp-arrow-left-center-p2").style.color = "black";
    document.getElementById("dp-arrow-right-center-p2").style.color = "black";
    document.getElementById("dp-arrow-left-center-p3").style.color = "black";
    document.getElementById("dp-arrow-right-center-p3").style.color = "black";
    document.getElementById("dp-arrow-left-center-p4").style.color = "black";
    document.getElementById("dp-arrow-right-center-p4").style.color = "black";
    // Reset avatar border color
    document.getElementById("player-choosed-double-pong-top-side").style.border = "5px solid lightgray";
    document.getElementById("player-choosed-double-pong-bottom-side").style.border = "5px solid lightgray";
    document.getElementById("player-choosed-double-pong-left-side").style.border = "5px solid lightgray";
    document.getElementById("player-choosed-double-pong-right-side").style.border = "5px solid lightgray";
    // Hide side elements
    toggleDisplay(["dp-p1-left-side", "dp-p1-right-side", "dp-p1-far-left-side", "dp-p1-far-right-side", "dp-p2-left-side", "dp-p2-right-side", "dp-p2-far-left-side", "dp-p2-far-right-side", "dp-p3-left-side", "dp-p3-right-side", "dp-p3-far-left-side", "dp-p3-far-right-side", "dp-p4-left-side", "dp-p4-right-side", "dp-p4-far-left-side", "dp-p4-far-right-side"], "none");
    toggleDisplay(["dp-arrow-right-left-side-p1", "dp-arrow-right-right-side-p1", "dp-arrow-left-left-side-p1", "dp-arrow-left-right-side-p1", "dp-arrow-right-far-left-side-p1", "dp-arrow-left-far-right-side-p1", "dp-arrow-right-left-side-p2", "dp-arrow-right-right-side-p2", "dp-arrow-left-left-side-p2", "dp-arrow-left-right-side-p2", "dp-arrow-right-far-left-side-p2", "dp-arrow-left-far-right-side-p2", "dp-arrow-right-left-side-p3", "dp-arrow-right-right-side-p3", "dp-arrow-left-left-side-p3", "dp-arrow-left-right-side-p3", "dp-arrow-right-far-left-side-p3", "dp-arrow-left-far-right-side-p3", "dp-arrow-right-left-side-p4", "dp-arrow-right-right-side-p4", "dp-arrow-left-left-side-p4", "dp-arrow-left-right-side-p4", "dp-arrow-right-far-left-side-p4", "dp-arrow-left-far-right-side-p4"], "none");
    // Show add guest button
    toggleDisplay(["dp-add-guest"], "block");
	// Hide remove guest button
	toggleDisplay(["dp-remove-guest"], "none");
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

// Function to transition player state
function transitionPlayer(player, state, hideIds, showIds, previousState) {
    if (Object.values(playerStates).every(s => s !== state) || state === "center") {
        toggleDisplay(hideIds, "none");
        toggleDisplay(showIds, "block");
        playerStates[player] = state;
        updateBackgroundColorAndImage();
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
    ids.forEach(id => document.getElementById(id).style.display = display);
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

document.addEventListener('DOMContentLoaded', function() {
	// Shows the login prompt for guests
    document.getElementById('dp-add-guest').addEventListener('click', function(){
        if (p2Selected)
            return;
        toggleDisplay(["dp-login-guest-box", "dp-login-guest"], "block");
        toggleDisplay(["dp-sign-up-guest"], "none");
    });
	// Hides the login and sign up prompts for guests
    document.getElementById('dp-close-add-guest').addEventListener('click', function(){
        toggleDisplay(["dp-login-guest-box", "dp-login-guest", "dp-sign-up-guest"], "none");
    });
	// Hides the login and sign up prompts for guests
    document.getElementById('dp-close-add-guest-signup').addEventListener('click', function(){
        toggleDisplay(["dp-login-guest-box", "dp-login-guest", "dp-sign-up-guest"], "none");
    });
	// Shows the sign up prompt for guests and hides the login prompt
    document.getElementById('dp-sign-up-guest-button').addEventListener('click', function(){
        toggleDisplay(["dp-login-guest"], "none");
        toggleDisplay(["dp-sign-up-guest"], "block");
    });
	// Shows the login prompt for guests and hides the sign up prompt
    document.getElementById('dp-login-guest-link').addEventListener('click', function(){
        toggleDisplay(["dp-sign-up-guest"], "none");
        toggleDisplay(["dp-login-guest"], "block");
    });
	// Removes player elements, if there is more than 1 player
	document.getElementById('dp-remove-guest').addEventListener('click', function(){
		if (playerCounter > 1) {
			// Transition player from current position until reaching center
			while (playerStates[`p${playerCounter}`] !== "center") {
				if (playerStates[`p${playerCounter}`] === "left")
					transitionPlayer(`p${playerCounter}`, "center", [`dp-p${playerCounter}-left-side`, `dp-arrow-left-left-side-p${playerCounter}`, `dp-arrow-right-left-side-p${playerCounter}`], [`dp-p${playerCounter}-center`, `dp-arrow-left-center-p${playerCounter}`, `dp-arrow-right-center-p${playerCounter}`], playerStates[`p${playerCounter}`]);
				else if (playerStates[`p${playerCounter}`] === "right")
					transitionPlayer(`p${playerCounter}`, "center", [`dp-p${playerCounter}-right-side`, `dp-arrow-left-right-side-p${playerCounter}`, `dp-arrow-right-right-side-p${playerCounter}`], [`dp-p${playerCounter}-center`, `dp-arrow-left-center-p${playerCounter}`, `dp-arrow-right-center-p${playerCounter}`], playerStates[`p${playerCounter}`]);
				else if (playerStates[`p${playerCounter}`] === "far-left")
					transitionPlayer(`p${playerCounter}`, "center", [`dp-p${playerCounter}-far-left-side`, `dp-arrow-right-far-left-side-p${playerCounter}`], [`dp-p${playerCounter}-center`, `dp-arrow-left-center-p${playerCounter}`, `dp-arrow-right-center-p${playerCounter}`], playerStates[`p${playerCounter}`]);
				else if (playerStates[`p${playerCounter}`] === "far-right")
					transitionPlayer(`p${playerCounter}`, "center", [`dp-p${playerCounter}-far-right-side`, `dp-arrow-left-far-right-side-p${playerCounter}`], [`dp-p${playerCounter}-center`, `dp-arrow-left-center-p${playerCounter}`, `dp-arrow-right-center-p${playerCounter}`], playerStates[`p${playerCounter}`]);
			}
			toggleDisplay([`dp-p${playerCounter}-center`, `dp-arrow-left-center-p${playerCounter}`, `dp-arrow-right-center-p${playerCounter}`], "none");
			playerCounter--;
			p4Selected = false;
			if (playerCounter == 1)
				toggleDisplay(["dp-remove-guest"], "none");
			if (playerCounter == 3)
				toggleDisplay(["dp-add-guest"], "block");
		}
	});
    // TEST BUTTONS, ADD LOGIC TO REAL LOGIN/SIGNUP BUTTONS ONCE DONE
    document.getElementById('dp-test-add-guest1').addEventListener('click', function(){
        playerCounter++;
        toggleDisplay([`dp-p${playerCounter}-center`, `dp-arrow-left-center-p${playerCounter}`, `dp-arrow-right-center-p${playerCounter}`], "block");
        if (playerCounter == 4) {
            p4Selected = true;
            toggleDisplay(["dp-add-guest"], "none");
        }
		toggleDisplay(["dp-login-guest-box", "dp-login-guest", "dp-sign-up-guest"], "none");
		toggleDisplay(["dp-remove-guest"], "block");
    });
    document.getElementById('dp-test-add-guest2').addEventListener('click', function(){
        playerCounter++;
        toggleDisplay([`dp-p${playerCounter}-center`, `dp-arrow-left-center-p${playerCounter}`, `dp-arrow-right-center-p${playerCounter}`], "block");
        if (playerCounter == 4) {
            p4Selected = true;
            toggleDisplay(["dp-add-guest"], "none");
        }
		toggleDisplay(["dp-login-guest-box", "dp-login-guest", "dp-sign-up-guest"], "none");
		toggleDisplay(["dp-remove-guest"], "block");
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const dp_passwordInput = document.getElementById("dp-login-guest-password");
    const dp_showPasswordButton = document.querySelector(".dp-guest-show-password");
    const dp_hidePasswordButton = document.querySelector(".dp-guest-hide-password");

    dp_hidePasswordButton.style.display = "none"; // Initially hide the "Hide Password" button

    dp_showPasswordButton.addEventListener("click", function() {
        dp_passwordInput.type = "text";
        dp_showPasswordButton.style.display = "none";
        dp_hidePasswordButton.style.display = "inline";
    });

    dp_hidePasswordButton.addEventListener("click", function() {
        dp_passwordInput.type = "password";
        dp_showPasswordButton.style.display = "inline";
        dp_hidePasswordButton.style.display = "none";
    });
});