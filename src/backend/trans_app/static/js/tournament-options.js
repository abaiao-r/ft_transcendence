/* let playerNames;
let playerAICheck = [];
let matches = [];
let playerCount;
let rounds;
let results;
let matchInfo; */

let tournamentManager;

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

    const playerCountSelect = document.getElementById("player-count");
    const playerCount = parseInt(playerCountSelect.value);
    generatePlayerCards(playerCount);

    window.location.href = TOURNAMENT_HREF;
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
    const validation = checkPlayerCards();
    if (typeof validation === "string") {
        console.log(validation);
        return;
    }

    document.getElementById("next-match").style.display = "block";
    tournamentManager.setPlayers(getPlayerNames());
    tournamentManager.setupRound();
    tournamentManager.renderTournament();

    window.location.href = TOURNAMENT_BRACKET_HREF;
}

/**
 * Retrieves player names from input fields within player cards.
 */
function getPlayerNames() {
    const playerInputs = document.querySelectorAll("input.player-name-input");
    return Array.from(playerInputs).map(input => input.value);
}

/**
 * Generates dynamic player cards based on the specified count and appends them to the player cards container.
 */
function generatePlayerCards(playerCount) {
    const playerCardsContainer = document.getElementById("player-cards");
    playerCardsContainer.innerHTML = '';
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
 * Checks the validity of all player cards and gathers player information.
 */
function checkPlayerCards() {
    const playerInputs = document.querySelectorAll("input.player-name-input");
    const errors = validatePlayerCards(playerInputs);
    if (errors.length > 0) {
        return errors.join(" ");
    }
    return Array.from(playerInputs).map(input => createPlayerFromCard(input.closest(".player-card"), input.value));
}

/**
 * Validates player names and ensures they adhere to specific rules, such as uniqueness and length constraints.
 */
function validatePlayerCards(playerInputs) {
    const errors = [];
    const nameCounts = {};
    playerInputs.forEach(input => {
        const name = input.value.replace(/\s/g, "").toLowerCase();
        nameCounts[name] = (nameCounts[name] || 0) + 1;
    });

    playerInputs.forEach(input => {
        const card = input.closest(".player-card");
        const name = input.value;
        const tempName = name.replace(/\s/g, "").toLowerCase();
        const errorMessages = validatePlayerName(name, tempName, nameCounts);
        if (card.querySelector(".is-host").checked && card.querySelector(".is-ai").checked) {
            errorMessages.push("Player card cannot be both host and AI!");
        }
        if (errorMessages.length > 0) {
            showErrorMessage(card, errorMessages);
            errors.push(...errorMessages);
        } else {
            clearErrorMessage(card);
        }
    });

    return errors;
}

/**
 * Generates error messages related to player names based on predefined rules.
 */
function validatePlayerName(name, tempName, nameCounts) {
    const errorMessages = [];
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
 * Displays error messages on player cards to inform users of any issues with their input.
 */
function showErrorMessage(card, messages) {
    const errorMessage = card.querySelector(".player-name-error");
    errorMessage.innerHTML = messages.map(msg => `<p>${msg}</p>`).join("");
    errorMessage.style.display = "block";
}

/**
 * Clears any displayed error messages from player cards.
 */
function clearErrorMessage(card) {
    const errorMessage = card.querySelector(".player-name-error");
    errorMessage.style.display = "none";
}

/**
 * Creates a player object from card data, setting properties such as name, host status, and AI status.
 */
function createPlayerFromCard(card, name) {
    const player = new Player();
    player.displayName = name;
    player.isAi = card.querySelector(".is-ai").checked;
    player.isHost = card.querySelector(".is-host").checked;
    if (player.isHost) {
        player.username = document.getElementById("username-sidebar").innerText.trim();
        console.log("Player host is: " + player.username);
    }
    return player;
}

// Initialize the tournament options when the page loads
initializeTournamentOptions();