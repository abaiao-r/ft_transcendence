/**
 * Initializes the tournament options by setting up the UI and attaching event listeners.
 */
function initializeTournamentOptions() {
    setupInitialUI();
    attachEventListeners();
}

function getPlayerCount() {
    return parseInt(document.getElementById("player-count").value);
}

// Function to get the current number of players selected
function getPlayerCount() {
    var selectedButton = document.querySelector('input[name="player-count"]:checked');
    return selectedButton ? selectedButton.value : null;
}

// Function to set the number of players
function setPlayerCount(count) {
    var buttonToSelect = document.querySelector(`input[name="player-count"][value="${count}"]`);
    if (buttonToSelect) {
        buttonToSelect.checked = true;
    }
}

/**
 * Sets up the initial user interface, including player cards and tournament setup.
 */
function setupInitialUI() {
    const playerCount = parseInt(localStorage.getItem('playerCount')) || 4;
    setPlayerCount(playerCount);
    generatePlayerCards(playerCount);

    tournamentManager = new TournamentManager();
    tournamentManager.setupRound();
    tournamentManager.renderTournament();
}

/**
 * Attaches necessary event listeners for interactive elements like buttons and selection changes.
 */
function attachEventListeners() {
    const playButtons = document.querySelectorAll('.play-menu-button');
    const playerCountButtons = document.querySelectorAll('input[name="player-count"]');
    const playerTypeButtons = document.querySelectorAll('input[name^="player-type-"]');
    const tournamentButton = playButtons[2];
    const startTournamentButton = document.getElementById("start-tournament");

    tournamentButton.addEventListener('click', handleTournamentButtonClick);
    playerCountButtons.forEach(function(button) {
        button.addEventListener('change', function() {
            // This function will run every time the player count changes
            clearAllPlayerNameErrors();
            activateStartGameButton();
            handlePlayerCountChange();
        });
    });
    playerTypeButtons.forEach(function(button) {
        button.addEventListener('change', function() {
            // This function will run every time the player type changes
            handlePlayerTypeChange(this, playerTypeButtons);
        });
    });
    startTournamentButton.addEventListener('click', handleStartTournamentClick);
}

/**
 * Handles click events on the tournament button, resetting the tournament and navigating to the tournament page.
 */
function handleTournamentButtonClick(event) {
    event.preventDefault();
    tournamentManager.resetTournament();

    activateStartGameButton();
    clearDisplayWinner();
    const playerCount = getPlayerCount();
    generatePlayerCards(playerCount);

    navigateToHash(TOURNAMENT_HREF);
}

/**
 * Handles changes in player count selection, updating the number of player cards displayed.
 */
function handlePlayerCountChange() {
    const playerCount = getPlayerCount();
    generatePlayerCards(playerCount);
}

/**
 * Initiates the start of the tournament, checks for player card validation, sets up the tournament, and navigates to the bracket view.
 */
function handleStartTournamentClick(event) {
    event.preventDefault();
    const data = getPlayers();
    // If data is a string, it contains an error message
    // Else is an array of player objects
    if (typeof data === "string") {
        return;
    }

    clearDisplayWinner();
    document.getElementById("next-match").style.display = "block";
    tournamentManager.setPlayers(data);
    tournamentManager.shufflePlayers();
    tournamentManager.setupRound();
    tournamentManager.renderTournament();

    goToPage(TOURNAMENT_BRACKET_HREF);
}

function handlePlayerTypeChange(event, playerTypeButtons) {
    /* Hide all host labels */
    Array.from(playerTypeButtons).forEach(button => {
            button.closest(".player-card").querySelector(".host-label").style.visibility = "hidden";
    });
    /* show host label for only the first human player checked in the list */
    const humanPlayers = Array.from(playerTypeButtons).filter(button => button.value === "human" && button.checked);
    if (humanPlayers.length > 0) {
        humanPlayers[0].closest(".player-card").querySelector(".host-label").style.visibility = "visible";
    }
}

/**
 * Retrieves player names from input fields within player cards.
 * @returns {Array} - An array of player names.
 */
function getPlayerNames() {
    const playerInputs = document.querySelectorAll("input.player-name-input");
    return Array.from(playerInputs).map(input => input.value);
}

/**
 * Generates dynamic player cards based on the specified count and appends them to the player cards container.
 * @param {number} playerCount - The number of player cards to generate.
 * @returns {void}
 */
function generatePlayerCards(playerCount) {
    const playerCardsContainer = document.getElementById("player-cards");
    playerCardsContainer.innerHTML = "";
    for (let i = 1; i <= playerCount; i++) {
        const playerName = `Player ${i}`;
        const card = document.createElement("div");
        card.classList.add("player-card");

        card.innerHTML = `
            <p class="host-label">Host</p>
            <input type="text" class="player-name-input" value="${playerName}">
            <div class="btn-group segment-control" role="group" aria-label="Player type for ${playerName}">
                <input type="radio" class="btn-check" name="player-type-${i}" id="player-${i}-human" value="human" autocomplete="off">
                <label class="btn btn-outline-primary" for="player-${i}-human">Human</label>
                <input type="radio" class="btn-check" name="player-type-${i}" id="player-${i}-ai" value="ai" autocomplete="off">
                <label class="btn btn-outline-primary" for="player-${i}-ai">AI</label>
            </div>
        `;
        if (i === 1) { // Enhance the first player card for the host
            card.querySelector(`input[value="human"]`).checked = true;
        }
        else {
            /* hide host-label but maintain vertical space*/
            card.querySelector(".host-label").style.visibility = "hidden";
            card.querySelector(`input[value="ai"]`).checked = true;
        }
        playerCardsContainer.appendChild(card);
    }
    attachPlayerNameListeners();
}

/**
 * Extracts information from each player card in the player cards container.
 * @returns {Array} An array of player objects.
 */
function getPlayers() {
    const playerCards = document.querySelectorAll(".player-card");
    const players = [];

    playerCards.forEach((card, index) => {
        const playerNameInput = card.querySelector(".player-name-input");
        const isHumanRadio = card.querySelector(`input[name="player-type-${index + 1}"][value="human"]`);
        const isHost = card.querySelector(".host-label").style.visibility !== "hidden";
        
        // Creating a player object based on the player card information
        const player = {
            displayName: playerNameInput.value,
            username: playerNameInput.value.toLowerCase().replace(/\s+/g, ''), // Lowercase and remove spaces for username
            isHost: isHost,
            isAi: !isHumanRadio.checked // Check if AI radio button is selected
        };

        players.push(player);
    });
    return players;
}

/**
 * Limits the player name input to 20 characters and trims whitespace.
 * @param {Element} input - The player name input element.
 * @returns {void}
 * 
**/
function limitPlayerNameInput(input) {
    if (input.value.length > 20) {
        input.value = input.value.substring(0, 20);
    }
    /* limit whitespaces if no other characters is there */
    input.value = input.value.replace(/\s+/g, ' ');
    /* limit whitespaces at the beginning of the string */
    input.value = input.value.trimStart();
}

/**
 * Sets up a popover for displaying an error message on a player card.
 * @param {Element} card - The player card element.
 * @param {string} message - The error message to display.
 * @returns {Object} - The popover instance.
 * @see https://getbootstrap.com/docs/5.0/components/popovers/
 * 
**/
function setupPopover(card, message) {
    // Introduce a slight delay if necessary, or ensure state consistency here
    popover = new bootstrap.Popover(card, {
        container: 'body',
        placement: 'top',
        content: message,
        trigger: 'manual'  // Manually trigger display
    });
    return popover;
}

/**
 * Clears the display error on a player card by removing the border and hiding the popover.
 * @param {Element} card - The player card element.
 * @returns {void}
**/ 
function clearDisplayError(card) {
    card.style.borderWidth = "0px";
    try {
        const popover = bootstrap.Popover.getInstance(card);
        if (popover) {
            popover.hide();
            
        }
    } catch (error) {
        console.error("Error hiding popover:", error);
    }
}

/**
 * Displays an error message on a player card using a popover.
 * @param {Element} card - The player card element.
 * @param {string} message - The error message to display.
 * @returns {void}
**/
function displayErrorPopover(card, message) {
    clearDisplayError(card);

    card.style.borderColor = "red";
    card.style.borderWidth = "2px";
    // Initialize or retrieve the popover and show it
    const popover = setupPopover(card, message);
    popover.show();
}

/* Clear all display errors */
function clearAllPlayerNameErrors() {
    const playerCards = document.querySelectorAll(".player-card");
    playerCards.forEach(card => {
        clearDisplayError(card);
    });
    console.log("errors cleared");
}

/* Disable start game button */
function disableStartGameButton() {
    document.getElementById("start-tournament").disabled = true;
    document.getElementById("start-tournament").style.animation = "none";
    document.getElementById("start-tournament").style.backgroundColor = "gray";
}

/* Activate start game button */
function activateStartGameButton() {
    document.getElementById("start-tournament").disabled = false;
    document.getElementById("start-tournament").style.backgroundColor = "";
    document.getElementById("start-tournament").style.animation = "fireGradient 3s linear infinite alternate";
}

/**
 * Handles player name validation to ensure that names are unique and not empty.
 * @param {Element} input - The player name input element.
 * @param {Array} playerInputs - An array of player name input elements.
 * @returns {void}
 */
function handlePlayerNamesErrors(input, playerInputs) {
    const tempName = input.value.toLowerCase().replace(/\s+/g, '');
    const nameCounts = {};
    let error = false;
    let message = "";
    const card = input.closest(".player-card");

    /* check if empty */
    if (!input.value || input.value === "") {
        error = true;
        message = "Player name cannot be empty!";
        console.log("empty");
    }
    else {
        // Count the number of times each player name appears
        playerInputs.forEach(input => {
            // Remove whitespace and convert to lowercase
            const normalizedName = input.value.toLowerCase().replace(/\s+/g, '');
            // Increment the count of the player name
            nameCounts[normalizedName] = (nameCounts[normalizedName] || 0) + 1;
        });
        if (nameCounts[tempName] > 1) {
            error = true;
            message = "Player name must be unique!";
            console.log("not unique");
        }
    }
    
    if (error) {
        displayErrorPopover(card, message);
        disableStartGameButton();
    }
    else {
        clearDisplayError(card);
        activateStartGameButton();
    }
}

/**
 * listeners to the player name inputs
 * Doesnt let players write more than 20 characters by disablinf further input
 */
function attachPlayerNameListeners() {
    const playerInputs = document.querySelectorAll("input.player-name-input");

    playerInputs.forEach(input => {
        input.addEventListener('input', function() {
            limitPlayerNameInput(input);
        });
    });
    /* check if name is unique, put border in red and activate tool tip displaying error*/
    playerInputs.forEach(input => {
        input.addEventListener('input', function() {
            handlePlayerNamesErrors(input, playerInputs);
        });
    });
}

// Initialize the tournament options when the page loads
initializeTournamentOptions();