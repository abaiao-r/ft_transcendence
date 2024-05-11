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

	const startTournamentButton = document.getElementById("start-tournament");

    startTournamentButton.addEventListener("click", function() {
        const playerNames = [];
        const playerInputs = playerCardsContainer.querySelectorAll("input");

        playerInputs.forEach(function(input) {
            playerNames.push(input.value);
        });

        // Do something with playerNames...
        console.log(playerNames);

		// Create a copy of the playerNames array
		let shuffledPlayers = [...playerNames];

		// Fisher-Yates shuffle algorithm
		for (let i = shuffledPlayers.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
		}
	
		// Split into pairs
		let matches = [];
		for (let i = 0; i < shuffledPlayers.length; i += 2) {
			matches.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
		}
	
		// Do something with matches...
		console.log(matches);
    });
});

