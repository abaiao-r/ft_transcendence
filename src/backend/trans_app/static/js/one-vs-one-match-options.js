document.addEventListener('DOMContentLoaded', function() {
    const playButtons = document.querySelectorAll('.play-menu-button');
    const oneVsOneLocalButton = playButtons[0];
    //const oneVsOneLocalSection = document.querySelector('#1-vs-1-local'); // if 1-vs-1-local is an id

    oneVsOneLocalButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = ONE_VS_ONE_MATCH_OPTIONS_HREF;
    });
});


let p1TransitionState = "center"; // Initial state for player 1
let p2TransitionState = "center"; // Initial state for player 2

// Function to handle center to left transition for player 1
function centerToLeftP1() {
    if (p2TransitionState !== "left") { // Check if player 2 is not transitioning to the left
        // Hide center player image and button
        document.getElementById("p1-center").style.display = "none";
        document.getElementById("arrow-left-center-p1").style.display = "none";
        document.getElementById("arrow-right-center-p1").style.display = "none";
        
        // Show left player image and button
        document.getElementById("p1-left-side").style.display = "block";
        document.getElementById("arrow-right-left-side-p1").style.display = "block";

        //turn p2 left arrow red
        document.getElementById("arrow-left-center-p2").style.color = "red";

        // turn player-choosed-left-side border red
        document.getElementById("player-choosed-left-side").style.border = "5px solid red";
        
        // Update player 1 transition state
        p1TransitionState = "left";
    }
}

// Function to handle center to right transition for player 1
function centerToRightP1() {
    if (p2TransitionState !== "right") { // Check if player 2 is not transitioning to the right
        // Hide center player image and button
        document.getElementById("p1-center").style.display = "none";
        document.getElementById("arrow-left-center-p1").style.display = "none";
        document.getElementById("arrow-right-center-p1").style.display = "none";
        
        // Show right player image and button
        document.getElementById("p1-right-side").style.display = "block";
        document.getElementById("arrow-left-right-side-p1").style.display = "block";

        //turn p2 right arrow red
        document.getElementById("arrow-right-center-p2").style.color = "red";

        // turn player-choosed-right-side border red
        document.getElementById("player-choosed-right-side").style.border = "5px solid red";
        
        // Update player 1 transition state
        p1TransitionState = "right";
    }
}

// Function to handle left to center transition for player 1
function leftToCenterP1() {
    // Hide left player image and button
    document.getElementById("p1-left-side").style.display = "none";
    document.getElementById("arrow-right-left-side-p1").style.display = "none";
    
    // Show center player image and button
    document.getElementById("p1-center").style.display = "block";
    document.getElementById("arrow-left-center-p1").style.display = "block";
    document.getElementById("arrow-right-center-p1").style.display = "block";

    //turn p2 left arrow black
    document.getElementById("arrow-left-center-p2").style.color = "black";

    // turn player-choosed-left-side border lightgray
    document.getElementById("player-choosed-left-side").style.border = "5px solid lightgray";
    
    // Update player 1 transition state
    p1TransitionState = "center";
}

// Function to handle right to center transition for player 1
function rightToCenterP1() {
    // Hide right player image and button
    document.getElementById("p1-right-side").style.display = "none";
    document.getElementById("arrow-left-right-side-p1").style.display = "none";
    
    // Show center player image and button
    document.getElementById("p1-center").style.display = "block";
    document.getElementById("arrow-left-center-p1").style.display = "block";
    document.getElementById("arrow-right-center-p1").style.display = "block";

    //turn p2 right arrow black
    document.getElementById("arrow-right-center-p2").style.color = "black";

    // turn player-choosed-right-side border lightgray
    document.getElementById("player-choosed-right-side").style.border = "5px solid lightgray";
    
    // Update player 1 transition state
    p1TransitionState = "center";
}


// Function to handle center to left transition for player 2
function centerToLeftP2() {
    if (p1TransitionState !== "left") { // Check if player 1 is not transitioning to the left
        // Hide center player image and button
        document.getElementById("p2-center").style.display = "none";
        document.getElementById("arrow-left-center-p2").style.display = "none";
        document.getElementById("arrow-right-center-p2").style.display = "none";
        
        // Show left player image and button
        document.getElementById("p2-left-side").style.display = "block";
        document.getElementById("arrow-right-left-side-p2").style.display = "block";

        //turn p1 left arrow red
        document.getElementById("arrow-left-center-p1").style.color = "red";

        // player-choosed-left-side border darkblue
        document.getElementById("player-choosed-left-side").style.border = "5px solid darkblue";
        
        // Update player 2 transition state
        p2TransitionState = "left";
    }
}

// Function to handle center to right transition for player 2
function centerToRightP2() {
    if (p1TransitionState !== "right") { // Check if player 1 is not transitioning to the right
        // Hide center player image and button
        document.getElementById("p2-center").style.display = "none";
        document.getElementById("arrow-left-center-p2").style.display = "none";
        document.getElementById("arrow-right-center-p2").style.display = "none";
        
        // Show right player image and button
        document.getElementById("p2-right-side").style.display = "block";
        document.getElementById("arrow-left-right-side-p2").style.display = "block";

        //turn p1 right arrow red
        document.getElementById("arrow-right-center-p1").style.color = "red";

        // player-choosed-right-side border darkblue
        document.getElementById("player-choosed-right-side").style.border = "5px solid darkblue";
        
        // Update player 2 transition state
        p2TransitionState = "right";
    }
}

// Function to handle left to center transition for player 2
function leftToCenterP2() {
    // Hide left player image and button
    document.getElementById("p2-left-side").style.display = "none";
    document.getElementById("arrow-right-left-side-p2").style.display = "none";
    
    // Show center player image and button
    document.getElementById("p2-center").style.display = "block";
    document.getElementById("arrow-left-center-p2").style.display = "block";
    document.getElementById("arrow-right-center-p2").style.display = "block";

    //turn p1 left arrow black
    document.getElementById("arrow-left-center-p1").style.color = "black";

    // turn player-choosed-left-side border lightgray
    document.getElementById("player-choosed-left-side").style.border = "5px solid lightgray";
    
    // Update player 2 transition state
    p2TransitionState = "center";
}

// Function to handle right to center transition for player 2
function rightToCenterP2() {
    // Hide right player image and button
    document.getElementById("p2-right-side").style.display = "none";
    document.getElementById("arrow-left-right-side-p2").style.display = "none";
    
    // Show center player image and button
    document.getElementById("p2-center").style.display = "block";
    document.getElementById("arrow-left-center-p2").style.display = "block";
    document.getElementById("arrow-right-center-p2").style.display = "block";

    //turn p1 right arrow black
    document.getElementById("arrow-right-center-p1").style.color = "black";

    // turn player-choosed-right-side border lightgray
    document.getElementById("player-choosed-right-side").style.border = "5px solid lightgray";
    
    // Update player 2 transition state
    p2TransitionState = "center";
}

// Now you can similarly modify other transition functions to check the state of the other player before executing

// Assign event listeners
document.getElementById("arrow-left-center-p1").addEventListener("click", centerToLeftP1);
document.getElementById("arrow-left-center-p2").addEventListener("click", centerToLeftP2);

// Now you can assign these functions to the respective event listeners
document.getElementById("arrow-left-center-p1").addEventListener("click", centerToLeftP1);
document.getElementById("arrow-right-center-p1").addEventListener("click", centerToRightP1);
document.getElementById("arrow-right-left-side-p1").addEventListener("click", leftToCenterP1);
document.getElementById("arrow-left-right-side-p1").addEventListener("click", rightToCenterP1);

// Similarly, assign functions for player 2 events
document.getElementById("arrow-left-center-p2").addEventListener("click", centerToLeftP2);
document.getElementById("arrow-right-center-p2").addEventListener("click", centerToRightP2);
document.getElementById("arrow-right-left-side-p2").addEventListener("click", leftToCenterP2);
document.getElementById("arrow-left-right-side-p2").addEventListener("click", rightToCenterP2);

