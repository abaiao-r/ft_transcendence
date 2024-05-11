document.addEventListener('DOMContentLoaded', function() {
	const playButtons = document.querySelectorAll('.play-menu-button');
	const tournamentButton = playButtons[2];

	tournamentButton.addEventListener('click', function(event) {
		event.preventDefault();
		window.location.href = TOURNAMENT_HREF;
		if (document.getElementById('numberOfPlayers'))
			checkTournamentSelectedPlayers();
	});
});


document.addEventListener("DOMContentLoaded", function() {
    const tournamentOptions = document.getElementById("tournament-options");
    const playerCountSelect = document.getElementById("player-count");
    const playerCardsContainer = document.getElementById("player-cards");

    // Set default player count to 4
    let playerCount = 4;
    generatePlayerCards(playerCount);

    function generatePlayerCards(playerCount) {
        playerCardsContainer.innerHTML = "";
        for (let i = 1; i <= playerCount; i++) {
            const playerName = (i === 1) ? "P1" : `AI ${i - 1}`;
            const card = document.createElement("div");
            card.classList.add("player-card");
            card.innerHTML = `
                <input type="text" value="${playerName}" readonly>
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

    playerCountSelect.addEventListener("change", function() {
        playerCount = parseInt(playerCountSelect.value);
        generatePlayerCards(playerCount);
        tournamentOptions.style.display = "block";
    });

    playerCardsContainer.addEventListener("click", function(event) {
        if (event.target.classList.contains("change-name-btn")) {
            const playerNameInput = event.target.parentNode.querySelector("input");
            const confirmButton = event.target.parentNode.querySelector(".confirm-name-change-btn");
            playerNameInput.removeAttribute("readonly");
            playerNameInput.focus();
            event.target.style.display = "none";
            confirmButton.style.display = "block";
        }
        if (event.target.classList.contains("confirm-name-change-btn")) {
            const playerNameInput = event.target.parentNode.querySelector("input");
            playerNameInput.setAttribute("readonly", "");
            const changeButton = event.target.parentNode.querySelector(".change-name-btn");
            event.target.style.display = "none";
            changeButton.style.display = "block";
        }
    });

    playerCardsContainer.addEventListener("blur", function(event) {
        if (event.target.tagName === "INPUT") {
            event.target.setAttribute("readonly", "");
            const changeButton = event.target.parentNode.querySelector(".change-name-btn");
            const confirmButton = event.target.parentNode.querySelector(".confirm-name-change-btn");
            confirmButton.style.display = "none";
            changeButton.style.display = "block";
        }
    }, true);
});

document.addEventListener("DOMContentLoaded", function() {
    const tournamentOptions = document.getElementById("tournament-options");
    const playerCountSelect = document.getElementById("player-count");
    const playerCardsContainer = document.getElementById("player-cards");
    const startMatchBtn = document.getElementById("start-match");
    const bracketsSection = document.getElementById("brackets");

    let playerCount = 4;

    startMatchBtn.addEventListener("click", function() {
        generateBrackets(playerCount);
        tournamentOptions.style.display = "none";
        bracketsSection.style.display = "block";
    });

    function generateBrackets(playerCount) {
        // Create an array of player names
        const playerNames = [];
        for (let i = 1; i <= playerCount; i++) {
            playerNames.push(`Player ${i}`);
        }

        // Randomize the player names
        shuffleArray(playerNames);

        // Generate the brackets
        bracketsSection.innerHTML = "<h2>Tournament Brackets</h2>";
        for (let i = 0; i < playerNames.length; i += 2) {
            const match = document.createElement("div");
            match.classList.add("match");
            match.innerHTML = `
                <div class="player">${playerNames[i]}</div>
                <div class="vs">vs</div>
                <div class="player">${playerNames[i + 1]}</div>
            `;
            bracketsSection.appendChild(match);
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
});
