/* let playerNames;
let playerAICheck = [];
let matches = [];
let playerCount;
let rounds;
let results;
let matchInfo; */

/**
 * Initializes the tournament options by setting up the UI and attaching event listeners.
 */
function initializeTournamentOptions() {
    setupInitialUI();
    attachEventListeners();
}

/**
 * Sets up the initial user interface, including player cards and tournament setup.
 */
function setupInitialUI() {
    const playerCountSelect = document.getElementById("player-count");
    const playerCount = parseInt(localStorage.getItem('playerCount')) || 4;
    playerCountSelect.value = playerCount;
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
    const playerCountSelect = document.getElementById("player-count");
    const tournamentButton = playButtons[2];
    const startTournamentButton = document.getElementById("start-tournament");

    tournamentButton.addEventListener('click', handleTournamentButtonClick);
    playerCountSelect.addEventListener('change', handlePlayerCountChange);
    startTournamentButton.addEventListener('click', handleStartTournamentClick);
}

/**
 * Handles click events on the tournament button, resetting the tournament and navigating to the tournament page.
 */
function handleTournamentButtonClick(event) {
    event.preventDefault();
    tournamentManager.resetTournament();

    clearDisplayWinner();
    const playerCountSelect = document.getElementById("player-count");
    const playerCount = parseInt(playerCountSelect.value);
    generatePlayerCards(playerCount);

    navigateToHash(TOURNAMENT_HREF);
    //goToPage(TOURNAMENT_HREF);
}

/**
 * Handles changes in player count selection, updating the number of player cards displayed.
 */
function handlePlayerCountChange() {
    const playerCountSelect = document.getElementById("player-count");
    const playerCount = parseInt(playerCountSelect.value);
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
    tournamentManager.setupRound();
    tournamentManager.renderTournament();

    //window.location.href = TOURNAMENT_BRACKET_HREF;
    goToPage(TOURNAMENT_BRACKET_HREF);
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
      <input type="text" class="player-name-input" value="${playerName}" >
      <div class="player-type">
        <input class="is-host" type="checkbox" name="is-host-check" value="is-host" readonly>
        <label for="is-host">&nbsp;Is Host?</label>
        <input class="is-ai" type="checkbox" name="is-ai-check" value="is-ai" readonly checked>
        <label for="is-ai">&nbsp;Is AI?</label>
      </div>
      <div class="player-name-error" style="color: #721c24; background-color: #f8d7da; border-color: #f5c6cb; padding: .75rem 1.25rem; margin-bottom: 1rem; border: 1px solid transparent; border-radius: .25rem; text-align:center; display: none;">
        <p>Player name error</p>
      </div>
    `;
        playerCardsContainer.appendChild(card);
    }
}

/**
 * Gets player data from the player cards and validates it.
 * @returns {Array} - An array of player objects if all data is valid, or an error message if issues are found.
 */
function getPlayers() {
    const playerCardsContainer = document.getElementById("player-cards");
    const playerInputs = playerCardsContainer.querySelectorAll("input.player-name-input");
    let playerNames = Array.from(playerInputs).map(input => input.value);
    let playerNamesNormalized = Array.from(playerInputs).map(input => input.value.replace(/\s/g, "").toLowerCase());

    let errors = [];
    let nameCounts = {};

    playerNamesNormalized.forEach(name => {
        nameCounts[name] = (nameCounts[name] || 0) + 1;
    });

    let players = [];

    playerInputs.forEach((input, index) => {
        const card = input.closest(".player-card");
        const name = playerNames[index];
        const normalizedName = playerNamesNormalized[index];
        let errorMessages = [];

        errorMessages.push(...validatePlayerName(name, normalizedName, nameCounts));
        errorMessages.push(...validatePlayerType(card));

        if (errorMessages.length > 0) {
            showErrorMessage(card, errorMessages);
            errors.push(...errorMessages);
        } else {
            clearErrorMessage(card);
            const player = createPlayerFromCard(card, name);
            players.push(player);
        }
    });

    errors.push(...validateHostAndAI(playerCardsContainer));

    if (errors.length > 0) {
        return errors.join(" ");
    } else {
        return players;
    }
}



/**
 * Generates error messages related to player names based on predefined rules.
 * @param {string} name - The name of the player.
 * @param {string} tempName - The name of the player with whitespace removed and converted to lowercase.
 * @param {Object} nameCounts - An object containing the count of each player name.
 * @returns {Array} - An array of error messages related to player names.
 */
function validatePlayerName(name, tempName, nameCounts) {
    let errorMessages = [];

    if (name === "") {
        errorMessages.push("Player name cannot be empty!");
    }
    if (name.length > 20) {
        errorMessages.push("Player name cannot be more than 20 characters!");
    }
    if (nameCounts[tempName] > 1) {
        errorMessages.push("Player name must be unique!");
    }

    return errorMessages;
}

/**
 * Generates error messages related to player types
 * @param {Element} card - The player card element containing player information.
 * @returns {Array} - An array of error messages related to player types.
 */
function validatePlayerType(card) {
    let errorMessages = [];
    const isHost = card.querySelector(".is-host");
    const isAI = card.querySelector(".is-ai");

    if (isHost.checked && isAI.checked) {
        errorMessages.push("Player card cannot be both host and AI!");
    }

    return errorMessages;
}

/**
 * Generates error messages related to host and AI player counts.
 * @param {Element} container - The container element containing player cards.
 * @returns {Array} - An array of error messages related to host and AI player counts.
 */
function validateHostAndAI(container) {
    let hostCount = 0;
    let errors = [];

    for (let card of container.children) {
        const isHost = card.querySelector(".is-host");
        if (isHost.checked) {
            hostCount++;
        }
    }

    if (hostCount > 1) {
        errors.push("Maximum of one host allowed!");
        showErrorMessage(container, ["Maximum of one host allowed!"]);
    }

    return errors;
}

/**
 * Creates a player object from card data, setting properties such as name, host status, and AI status.
 * @param {Element} card - The player card element containing player information.
 * @param {string} name - The name of the player.
 * @returns {Object} - A player object with the specified properties.
 */
function createPlayerFromCard(card, name) {
    const player = {
        displayName: "",
        username: "",
        isHost: false,
        isAi: false,
    };
    player.displayName = name;
    player.isAi = card.querySelector(".is-ai").checked;
    player.isHost = card.querySelector(".is-host").checked;
    // If the player is the host, set the username to the value in the sidebar
    if (player.isHost) {
        player.username =  document.getElementById("username-sidebar").innerText.trim();
    }
    return player;
}

/**
 * Displays error messages on player cards to inform users of any issues with their input.
 * @param {Element} card - The player card element containing player information.
 * @param {Array} messages - An array of error messages to display.
 * @returns {void}
 */
function showErrorMessage(card, messages) {
    const errorMessage = card.querySelector(".player-name-error");
    errorMessage.innerHTML = messages.map(msg => `<p>${msg}</p>`).join("");
    errorMessage.style.display = "block";

    const inputName = card.querySelector(".player-name-input");
    const isHost = card.querySelector(".is-host");
    const isAI = card.querySelector(".is-ai");

    if (messages.some(msg => msg.includes("name"))) {
        inputName.style.borderColor = "#dc3545";  // Red border for name errors
    }
    if (messages.some(msg => msg.includes("host") || msg.includes("AI"))) {
        isHost.style.outline = "#dc3545 solid 2px";  // Red outline for checkbox errors
        isAI.style.outline = "#dc3545 solid 2px";
    }

    inputName.addEventListener("input", function () {
        errorMessage.style.display = "none";
        inputName.style.borderColor = "";  // Reset border color
    });

    isHost.addEventListener("change", function () {
        errorMessage.style.display = "none";
        isHost.style.outline = "";  // Reset outline
        isAI.style.outline = "";
    });

    isAI.addEventListener("change", function () {
        errorMessage.style.display = "none";
        isHost.style.outline = "";  // Reset outline
        isAI.style.outline = "";
    });
}

/**
 * Clears any displayed error messages from player cards.
 * @param {Element} card - The player card element containing player information.
 * @returns {void}
 */
function clearErrorMessage(card) {
    const errorMessage = card.querySelector(".player-name-error");
    errorMessage.style.display = "none";
    const inputName = card.querySelector(".player-name-input");
    const isHost = card.querySelector(".is-host");
    const isAI = card.querySelector(".is-ai");

    inputName.style.borderColor = "";  // Reset border color
    isHost.style.outline = "";  // Reset outline
    isAI.style.outline = "";
}

// Initialize the tournament options when the page loads
initializeTournamentOptions();