let playerNames;
let playerAICheck = [];
let matches = [];
let playerCount;
let rounds;
let results;
let matchInfo;

class TournamentManager {
    constructor() {
        console.log("Tournament Manager created");
        const tournament = this.getBackupTournament();
        
        if (tournament) {
            console.log("Tournament found in localStorage");
            console.log(tournament);
            this.tournament = Tournament.fromJSON(JSON.parse(tournament));
        }
        else {
            console.log("No tournament found in localStorage");
            this.tournament = new Tournament();
        }
        this.tournamentVisualizer = new TournamentVisualizer(this.tournament);
    }

    simulateNextMatch() {
        console.log("Simulating next match");
        return this.tournament.simulateNextMatch();
    }

    shufflePlayers() {
        console.log("Shuffling players");
        this.tournament.shufflePlayers();
        this.saveTournament();
    }

    startTournament() {
        console.log("Starting tournament");
        this.tournament.startTournament();
        this.saveTournament();
    }

    setPlayers(players) {
        console.log("Setting players");
        console.log(players);
        console.log(this.tournament);
        this.tournament.setPlayers(players.slice(0, 16)); // Take up to 16 players
        this.saveTournament();
    }

    savePlayerNames(playerCount, playerNames) {
        console.log("Saving player names");
        localStorage.setItem('playerNames', JSON.stringify(playerNames));
        localStorage.setItem('playerCount', parseInt(playerCount));
        this.tournament.setPlayers(playerNames);
    }

    saveTournament() {
        console.log("Saving tournament");
        localStorage.setItem('tournament', JSON.stringify(this.tournament));
        console.log("Tournament saved");
    }

    getBackupTournament() {
        return localStorage.getItem('tournament');
    }

    resetTournament() {
        console.log("Resetting tournament");
/*         localStorage.removeItem('playerNames');
        localStorage.removeItem('playerCards');
        localStorage.removeItem('playerCount'); */
        localStorage.removeItem('tournament');
        this.tournament = new Tournament();
        this.tournamentVisualizer = new TournamentVisualizer(this.tournament);
        this.saveTournament();
    }

    getNextMatch() {
        console.log("Getting next match");
        return this.tournament.getNextMatch();
    }

    renderTournament() {
        console.log("Rendering tournament");
        this.tournamentVisualizer.render();
    }

    advanceToNextRound() {
        console.log("Advancing round");
        this.tournament.advanceToNextRound();
        this.saveTournament();
    }

    isRoundComplete() {
        console.log("Checking if round is complete");
        return this.tournament.isRoundComplete();
    }

    updateMatch(player1, score1, player2, score2) {
        console.log("Updating match");
        this.tournament.updateMatch(player1, score1, player2, score2);
        this.saveTournament();
    }

    getTournamentWinner() {
        console.log("Getting tournament winner");
        return this.tournament.getTournamentWinner();
    }
}

let tournamentManager;

document.addEventListener('DOMContentLoaded', function () {
    const playButtons = document.querySelectorAll('.play-menu-button');
    const playerCardsContainer = document.getElementById("player-cards");
    const playerCountSelect = document.getElementById("player-count");
    const tournamentButton = playButtons[2];

    console.log("Tournament options loaded");
    tournamentManager = new TournamentManager();
    tournamentManager.renderTournament();

    let playerCount = parseInt(localStorage.getItem('playerCount')) || 4;
    playerCountSelect.value = playerCount;
    generatePlayerCards(playerCount);

    tournamentButton.addEventListener('click', function (event) {
        event.preventDefault();
        resetTournament();
        tournamentManager.resetTournament();
        window.location.href = TOURNAMENT_HREF;
        // Set default player count to 4
        playerCount = parseInt(playerCountSelect.value);
        generatePlayerCards(playerCount);
    });

    playerCountSelect.addEventListener("change", function () {
        playerCount = parseInt(playerCountSelect.value);
        generatePlayerCards(playerCount);
    });

    playerCardsContainer.addEventListener("click", function (event) {
        const target = event.target;
        const playerCard = target.closest(".player-card");
        const nameInput = playerCard.querySelector(".player-name-input");
        const checkbox = playerCard.querySelector(".is-ai");
        const changeButton = playerCard.querySelector(".change-name-btn");
        const confirmButton = playerCard.querySelector(".confirm-name-change-btn");

        if (target.matches(".change-name-btn")) {
            if (checkbox && checkbox.checked) {
                checkbox.checked = false;
            }
            nameInput.removeAttribute("readonly");
            nameInput.focus();
            changeButton.style.display = "none";
            confirmButton.style.display = "block";
        } else if (target.matches(".confirm-name-change-btn")) {
            const playerInputs = playerCardsContainer.querySelectorAll("input.player-name-input");
            let playerNames = Array.from(playerInputs).map(input => input.value);
            let playerNamesTemp = Array.from(playerInputs)
                .map(input => input.value.replace(/\s/g, "").toLowerCase());
            if (new Set(playerNamesTemp).size !== playerNamesTemp.length) {
                showErrorMessage(playerCard, "Player names must be unique!");
                return;
            } else if (nameInput.value === "") {
                showErrorMessage(playerCard, "Player names cannot be empty!");
                return;
            } else if ((checkbox && !checkbox.checked && checkAIName(nameInput.value)
                || !checkbox && checkAIName(nameInput.value))) {
                showErrorMessage(playerCard, "Player names cannot be the same as AI!");
                return;
            }
            nameInput.setAttribute("readonly", "");
            confirmButton.style.display = "none";
            changeButton.style.display = "block";
        }
        else if (target.matches(".is-ai") && target.checked)
            nameInput.value = nameInput.defaultValue;
    });

    const startTournamentButton = document.getElementById("start-tournament");
    startTournamentButton.addEventListener("click", function (event) {
        // Check if any player name change is in progress
        let confirmButtons = document.querySelectorAll(".player-card .confirm-name-change-btn");
        for (let button of confirmButtons) {
            if (window.getComputedStyle(button).display !== "none") {
                event.preventDefault();
                return;
            }
        }
        event.preventDefault();
        document.getElementById("next-match").style.display = "block";

        // Set up game
        tournamentManager.setPlayers(getPlayerNames());
        tournamentManager.shufflePlayers();
        tournamentManager.startTournament();    
        
        console.log("Tournament started");
        console.log(tournamentManager.tournament);

        window.location.href = TOURNAMENT_BRACKET_HREF;

        tournamentManager.renderTournament();
    });

    function getPlayerNames() {
        const playerInputs = playerCardsContainer.querySelectorAll("input.player-name-input");
        let playerNames = Array.from(playerInputs).map(input => input.value);
        return playerNames;
    }

    // Creates player cards for the selected number of players
    // Updates player names if necessary
    // Creates the first round matches
    function tournamentStartUpHelper() {
        matchInfo = {};
        results = [];
        generatePlayerCards(playerCount);
        const playerInputs = playerCardsContainer.querySelectorAll("input.player-name-input");
        let playerNames = Array.from(playerInputs).map(input => input.value);
        localStorage.setItem('playerNames', JSON.stringify(playerNames));
        rounds = Math.log2(playerCount);
        createFirstRoundMatches(playerNames);
    }

    function generatePlayerCards(playerCount) {
        const savedPlayerNames = JSON.parse(localStorage.getItem('playerNames')) || [];
        playerCardsContainer.innerHTML = "";
        for (let i = 1; i <= playerCount; i++) {
            const playerName = savedPlayerNames[i - 1] || (i === 1 ? document.getElementById("username-sidebar").textContent : `AI ${i - 1}`);
            const card = document.createElement("div");
            card.classList.add("player-card");
            card.innerHTML = `
          <input type="text" class="player-name-input" value="${playerName}" readonly>
          ${i !== 1 ? `
          <div class="player-type">
            <input class="is-ai" type="checkbox" name="is-ai-check" value="is-ai" readonly checked>
            <label for="is-ai">&nbsp;AI?</label>
          </div>` : ''}
          <div class="player-name-error" style="color: #721c24; background-color: #f8d7da; border-color: #f5c6cb; padding: .75rem 1.25rem; margin-bottom: 1rem; border: 1px solid transparent; border-radius: .25rem; text-align:center; display: none;">
            <p>Player name error</p>
          </div>
          <button class="change-name-btn">Change Name</button>
          <button class="confirm-name-change-btn" style="display: none;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
              <path d="M13.97 4.97a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.344 9.406a.75.75 0 0 1 1.06-1.06L6 10.939l6.563-6.563a.75.75 0 0 1 1.06 0z"/>
            </svg>
          </button>
        `;
            playerCardsContainer.appendChild(card);
        }
    }

    function showErrorMessage(card, message) {
        let inputName = card.querySelector(".player-name-input");
        let errorMessage = card.querySelector(".player-name-error");
        let confirmButton = card.querySelector(".confirm-name-change-btn");
        let changeButton = card.querySelector(".change-name-btn");
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 2000);
        inputName.value = inputName.defaultValue;
        if (checkAIName(inputName.value)) {
            card.querySelector(".is-ai").checked = true;
        }
        inputName.focus();
        inputName.setAttribute("readonly", "");
        confirmButton.style.display = "none";
        changeButton.style.display = "block";
    }

    function resetTournament() {
        localStorage.removeItem('playerNames');
        localStorage.removeItem('playerCards');
        localStorage.removeItem('playerCount');
        playerCountSelect.value = 4;
        generatePlayerCards(4);
    }

});
