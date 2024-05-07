document.addEventListener('DOMContentLoaded', function() {
    const playButtons = document.querySelectorAll('.play-menu-button');
    const oneVsOneLocalButton = playButtons[0];

    oneVsOneLocalButton.addEventListener('click', function(event) {
        event.preventDefault();
        resetPlayerStatesPong();
        window.location.href = ONE_VS_ONE_MATCH_OPTIONS_HREF;
    });
});

// Initial states for players
let playerStatesPong = {
    p1: "center",
    p2: "center"
};

let p2Selected;

// Reset initial states for players
function resetPlayerStatesPong(){
    p2Selected = false;
    playerStatesPong = {
        p1: "center",
        p2: "center"
    };
    // Show center elements
    toggleDisplay(["p1-center", "arrow-left-center-p1", "arrow-right-center-p1"], "block");
    toggleDisplay(["p2-center", "arrow-left-center-p2", "arrow-right-center-p2"], "none");
    // Make center arrows black
    document.getElementById("arrow-left-center-p1").style.color = "black";
    document.getElementById("arrow-right-center-p1").style.color = "black";
    document.getElementById("arrow-left-center-p2").style.color = "black";
    document.getElementById("arrow-right-center-p2").style.color = "black";
    // Reset avatar border color
    document.getElementById("player-choosed-left-side").style.border = "5px solid lightgray";
    document.getElementById("player-choosed-right-side").style.border = "5px solid lightgray";
    // Hide side elements
    toggleDisplay(["p1-left-side", "p1-right-side", "p2-left-side", "p2-right-side", "arrow-right-left-side-p1", "arrow-left-right-side-p1", "arrow-right-left-side-p2", "arrow-left-right-side-p2"], "none");
    // Show add guest button
    toggleDisplay(["add-guest"], "block");
	// Hide remove guest button
	toggleDisplay(["remove-guest"], "none");
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


// Function to transition player state
function transitionPlayerPong(player, state, hideIds, showIds) {
    console.log("player: ", player);
    console.log("state: ", state);
    console.log("hideIds: ", hideIds);
    console.log("showIds: ", showIds);
    if(Object.values(playerStatesPong).every(s => s !== state) || state === "center") {
        console.log("playerStatesPong: ", playerStatesPong);
        toggleDisplay(hideIds, "none");
        toggleDisplay(showIds, "block");
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
    document.getElementById(`arrow-left-center-${player}`).addEventListener("click", () => transitionPlayerPong(player, "left", [`${player}-center`, `arrow-left-center-${player}`, `arrow-right-center-${player}`], [`${player}-left-side`, `arrow-right-left-side-${player}`]));
    document.getElementById(`arrow-right-center-${player}`).addEventListener("click", () =>  transitionPlayerPong(player, "right", [`${player}-center`, `arrow-left-center-${player}`, `arrow-right-center-${player}`], [`${player}-right-side`, `arrow-left-right-side-${player}`]));
    document.getElementById(`arrow-right-left-side-${player}`).addEventListener("click", () =>  transitionPlayerPong(player, "center", [`${player}-left-side`, `arrow-right-left-side-${player}`], [`${player}-center`, `arrow-left-center-${player}`, `arrow-right-center-${player}`]));
    document.getElementById(`arrow-left-right-side-${player}`).addEventListener("click", () =>  transitionPlayerPong(player, "center", [`${player}-right-side`, `arrow-left-right-side-${player}`], [`${player}-center`, `arrow-left-center-${player}`, `arrow-right-center-${player}`]));
}


//Initialize event listeners for all players
for (let player of Object.keys(playerStatesPong)) {
    initializeEventListenersPong(player);
}

document.addEventListener('DOMContentLoaded', function() {
	// Shows the login prompt for guests
    document.getElementById('add-guest').addEventListener('click', function(){
        if (p2Selected)
            return;
        toggleDisplay(["login-guest-box", "login-guest"], "block");
        toggleDisplay(["sign-up-guest"], "none");
    });
	// Hides the login and sign up prompts for guests
    document.getElementById('close-add-guest').addEventListener('click', function(){
        toggleDisplay(["login-guest-box", "login-guest", "sign-up-guest"], "none");
    });
	// Hides the login and sign up prompts for guests
    document.getElementById('close-add-guest-signup').addEventListener('click', function(){
        toggleDisplay(["login-guest-box", "login-guest", "sign-up-guest"], "none");
    });
	// Shows the sign up prompt for guests and hides the login prompt
    document.getElementById('sign-up-guest-button').addEventListener('click', function(){
        toggleDisplay(["login-guest"], "none");
        toggleDisplay(["sign-up-guest"], "block");
    });
	// Shows the login prompt for guests and hides the sign up prompt
    document.getElementById('login-guest-link').addEventListener('click', function(){
        toggleDisplay(["sign-up-guest"], "none");
        toggleDisplay(["login-guest"], "block");
    });
	// Hides player 2 elements and sets p2 to a bot
	document.getElementById('remove-guest').addEventListener('click', function(){
		toggleDisplay(["p2-center", "arrow-left-center-p2", "arrow-right-center-p2", "p2-left-side", "p2-right-side", "arrow-right-left-side-p2", "arrow-left-right-side-p2"], "none");
		p2Selected = false;
		// Reset avatar border color and p1 arrow color
		if (playerStatesPong["p2"] === "left") {
			document.getElementById("player-choosed-left-side").style.border = "5px solid lightgray";
			document.getElementById("arrow-left-center-p1").style.color = "black";
		}
		else if (playerStatesPong["p2"] === "right") {
			document.getElementById("player-choosed-right-side").style.border = "5px solid lightgray";
			document.getElementById("arrow-right-center-p1").style.color = "black";
		}
		playerStatesPong["p2"] = "center";
		toggleDisplay(["remove-guest"], "none");
		toggleDisplay(["add-guest"], "block");
	});
    // TEST BUTTONS, ADD LOGIC TO REAL LOGIN/SIGNUP BUTTONS ONCE DONE
    document.getElementById('test-add-guest1').addEventListener('click', function(){
        toggleDisplay(["p2-center", "arrow-left-center-p2", "arrow-right-center-p2"], "block");
		toggleDisplay(["remove-guest"], "block");
        p2Selected = true;
        toggleDisplay(["add-guest"], "none");
        toggleDisplay(["login-guest-box", "login-guest", "sign-up-guest"], "none");
    });
    document.getElementById('test-add-guest2').addEventListener('click', function(){
        toggleDisplay(["p2-center", "arrow-left-center-p2", "arrow-right-center-p2"], "block");
        toggleDisplay(["remove-guest"], "block");
		p2Selected = true;
        toggleDisplay(["add-guest"], "none");
        toggleDisplay(["login-guest-box", "login-guest", "sign-up-guest"], "none");
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const passwordInput = document.getElementById("login-guest-password");
    const showPasswordButton = document.querySelector(".guest-show-password");
    const hidePasswordButton = document.querySelector(".guest-hide-password");

    hidePasswordButton.style.display = "none"; // Initially hide the "Hide Password" button

    showPasswordButton.addEventListener("click", function() {
        passwordInput.type = "text";
        showPasswordButton.style.display = "none";
        hidePasswordButton.style.display = "inline";
    });

    hidePasswordButton.addEventListener("click", function() {
        passwordInput.type = "password";
        showPasswordButton.style.display = "inline";
        hidePasswordButton.style.display = "none";
    });
});