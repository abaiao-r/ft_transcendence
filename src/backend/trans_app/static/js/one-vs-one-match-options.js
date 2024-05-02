document.addEventListener('DOMContentLoaded', function() {
    const playButtons = document.querySelectorAll('.play-menu-button');
    const oneVsOneLocalButton = playButtons[0];
    //const oneVsOneLocalSection = document.querySelector('#1-vs-1-local'); // if 1-vs-1-local is an id

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

// Reset initial states for players
function resetPlayerStatesPong(){
    playerStatesPong = {
        p1: "center",
        p2: "center"
    };
    // Show center elements
    toggleDisplay(["p1-center", "p2-center", "arrow-left-center-p1", "arrow-right-center-p1", "arrow-left-center-p2", "arrow-right-center-p2"], "block");
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
    if(Object.values(playerStatesPong).every(s => s !== state) || state === "center") {
        toggleDisplay(hideIds, "none");
        toggleDisplay(showIds, "block");
        playerStatesPong[player] = state;
        updateBackgroundColorAndImagePong();
        // call funtion updateArrowColorPong
        updateArrowColorPong(player, state);
    }
    else{
        return;
    }
}

// Function to initialize event listeners for player transitions
function initializeEventListenersPong(player) {
    document.getElementById(`arrow-left-center-${player}`).addEventListener("click", () => transitionPlayerPong(player, "left", [`${player}-center`, `arrow-left-center-${player}`, `arrow-right-center-${player}`], [`${player}-left-side`, `arrow-right-left-side-${player}`]));
    document.getElementById(`arrow-right-center-${player}`).addEventListener("click", () =>  transitionPlayerPong(player, "right", [`${player}-center`, `arrow-left-center-${player}`, `arrow-right-center-${player}`], [`${player}-right-side`, `arrow-left-right-side-${player}`]));
    document.getElementById(`arrow-right-left-side-${player}`).addEventListener("click", () =>  transitionPlayerPong(player, "center", [`${player}-left-side`, `arrow-right-left-side-${player}`], [`${player}-center`, `arrow-left-center-${player}`, `arrow-right-center-${player}`]));
    document.getElementById(`arrow-left-right-side-${player}`).addEventListener("click", () =>  transitionPlayerPong(player, "center", [`${player}-right-side`, `arrow-left-right-side-${player}`], [`${player}-center`, `arrow-left-center-${player}`, `arrow-right-center-${player}`]));
    document.getElementById(`player-choosed-left-side`).addEventListener("click", () =>  transitionPlayerPong(player, "left", [`${player}-center`, `arrow-left-center-${player}`, `arrow-right-center-${player}`], [`${player}-left-side`, `arrow-right-left-side-${player}`]));
    document.getElementById(`player-choosed-right-side`).addEventListener("click", () =>  transitionPlayerPong(player, "right", [`${player}-center`, `arrow-left-center-${player}`, `arrow-right-center-${player}`], [`${player}-right-side`, `arrow-left-right-side-${player}`]));

}


//Initialize event listeners for all players
for (let player of Object.keys(playerStatesPong)) {
    initializeEventListenersPong(player);
}

