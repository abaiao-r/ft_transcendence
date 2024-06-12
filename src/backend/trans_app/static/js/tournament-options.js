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

    isTournamentComplete() {
        console.log("Checking if tournament is complete");
        return this.tournament.isTournamentComplete();
    }

    setupRound() {
        console.log("Setting up round");
        this.tournament.setupRound();
        this.saveTournament();
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
    tournamentManager.setupRound();
    tournamentManager.renderTournament();

    let playerCount = parseInt(localStorage.getItem('playerCount')) || 4;
    playerCountSelect.value = playerCount;
    generatePlayerCards(playerCount);

    tournamentButton.addEventListener('click', function (event) {
        event.preventDefault();
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

    const startTournamentButton = document.getElementById("start-tournament");
    startTournamentButton.addEventListener("click", function (event) {
        // check if player names check are good, if not, return
        let playerCardsCheck = checkPlayerCards();
        //if playerCardsCheck is a string, then it is an error message
        if (typeof playerCardsCheck === "string") { 
            console.log(playerCardsCheck);
            return;
        }
        console.log(playerCardsCheck);


        // call a function to return an array of player objects
        event.preventDefault();

        document.getElementById("next-match").style.display = "block";

        // Set up game
        tournamentManager.setPlayers(getPlayerNames());
        tournamentManager.setupRound();

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

    function generatePlayerCards(playerCount) {
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

    function checkPlayerCards() {
        const playerInputs = playerCardsContainer.querySelectorAll("input.player-name-input");
        let playerNames = Array.from(playerInputs).map(input => input.value);
        let playerNamesTemp = Array.from(playerInputs).map(input => input.value.replace(/\s/g, "").toLowerCase());
    
        let errors = [];
        let nameCounts = {};
    
        playerNamesTemp.forEach(name => {
            nameCounts[name] = (nameCounts[name] || 0) + 1;
        });
    
        let players = [];
    
        playerInputs.forEach((input, index) => {
            const card = input.closest(".player-card");
            const name = playerNames[index];
            const tempName = playerNamesTemp[index];
            let errorMessages = [];
    
            errorMessages.push(...validatePlayerName(name, tempName, nameCounts));
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
    
    function validatePlayerType(card) {
        let errorMessages = [];
        const isHost = card.querySelector(".is-host");
        const isAI = card.querySelector(".is-ai");
    
        if (isHost.checked && isAI.checked) {
            errorMessages.push("Player card cannot be both host and AI!");
        }
    
        return errorMessages;
    }
    
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
    
    function createPlayerFromCard(card, name) {
        const player = new Player();
        player.displayName = name;
        player.isAi = card.querySelector(".is-ai").checked;
        player.isHost = card.querySelector(".is-host").checked;
        if (player.isHost) {
            // fecth username 
            player.username =  document.getElementById("username-sidebar").innerText.trim();
            console.log("Player host is: " + player.username);
        }
        return player;
    }
    
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

});
