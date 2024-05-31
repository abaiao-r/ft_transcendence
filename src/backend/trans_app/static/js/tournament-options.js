let playerNames;
let playerAICheck = [];
let matches = [];
let playerCount;
let rounds;
let results;
let matchInfo;

document.addEventListener('DOMContentLoaded', function () {
	const playButtons = document.querySelectorAll('.play-menu-button');
	const tournamentButton = playButtons[2];
	const playerCountSelect = document.getElementById("player-count");

	tournamentButton.addEventListener('click', function (event) {
		event.preventDefault();
		window.location.href = TOURNAMENT_HREF;
		// Remove any previous event listeners
		removeNameChangeListeners();
		// Set default player count to 4
		playerCount = 4;
		playerCountSelect.value = playerCount;
		tournamentStartUpHelper();
	});

	playerCountSelect.addEventListener("change", function () {
		playerCount = parseInt(playerCountSelect.value);
		removeNameChangeListeners();
		tournamentStartUpHelper();
	});

	const startTournamentButton = document.getElementById("start-tournament");
	startTournamentButton.addEventListener("click", function(event) {
		event.preventDefault();
		document.getElementById("next-match").style.display = "block";
		window.location.href = TOURNAMENT_BRACKET_HREF;
		bracketMaker();
	});
});

// Creates player cards for the selected number of players
// Updates player names if necessary
// Creates the first round matches
function tournamentStartUpHelper() {
	generatePlayerCards(playerCount);
	const playerInputs = document.getElementById("player-cards").querySelectorAll("input");
	playerNames = [];
	results = [];
	matchInfo = {};
	rounds = Math.log2(playerCount);
	playerInputs.forEach(function (input) {
		playerNames.push(input.value);
	});
	createFirstRoundMatches(playerNames);
}

function generatePlayerCards(playerCount) {
	const playerCardsContainer = document.getElementById("player-cards");
	playerCardsContainer.innerHTML = "";
	for (let i = 1; i <= playerCount; i++) {
		const playerName = (i === 1) ? document.getElementById("username-sidebar").textContent : `AI ${i - 1}`;
		const card = document.createElement("div");
		card.classList.add("player-card");
		card.innerHTML = `
                <input type="text" value="${playerName}" readonly>
				${i !== 1 ? `
					<div class="form-check checkboxContainer">
						<input class="form-check-input is-ai" type="checkbox" name="is-ai-check" value="is-ai" id="is-ai" readonly checked>
						<label class="form-check-label" for="is-ai">AI?</label>
					</div>
				` : ''}
				<div class="player-name-error" id="player-name-error-${i}" style="color: #721c24; background-color: #f8d7da; border-color: #f5c6cb; padding: .75rem 1.25rem; margin-bottom: 1rem; border: 1px solid transparent; border-radius: .25rem; text-align:center; display: none;">
				<p>Player name must be unique</p>
				</div>
				<div class="player-name-empty-error" id="player-name-empty-error-${i}" style="color: #721c24; background-color: #f8d7da; border-color: #f5c6cb; padding: .75rem 1.25rem; margin-bottom: 1rem; border: 1px solid transparent; border-radius: .25rem; text-align:center; display: none;">
				<p>Player names cannot be empty</p>
				</div>
				<div class="player-name-ai-error" id="player-name-ai-error-${i}" style="color: #721c24; background-color: #f8d7da; border-color: #f5c6cb; padding: .75rem 1.25rem; margin-bottom: 1rem; border: 1px solid transparent; border-radius: .25rem; text-align:center; display: none;">
				<p>Player cannot be named after AI</p>
				</div>
                <button class="change-name-btn">Change Name</button>
                <button class="confirm-name-change-btn" style="display: none;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                        <path d="M13.97 4.97a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.344 9.406a.75.75 0 0 1 1.06-1.06L6 10.939l6.563-6.563a.75.75 0 0 1 1.06 0z"/>
                    </svg>
                </button>
            `;
		playerCardsContainer.appendChild(card);
		createNameChangeListener(card);
		if (i !== 1)
			createAICheckEventListener(card, i);
	}
}

function createNameChangeListener(card) {
	const inputField = card.querySelector("input");
	const changeButton = card.querySelector(".change-name-btn");
	const confirmButton = card.querySelector(".confirm-name-change-btn");
	const playerNamesError = card.querySelector(".player-name-error");
	const playerNamesEmptyError = card.querySelector(".player-name-empty-error");
	const playerNameAIError = card.querySelector(".player-name-ai-error");
	const playerAIcheckbox = card.querySelector(".is-ai");
	let originalValue;

	const aiCheckbox = function () {
		// Hide change name button if AI checkbox is checked
		if (playerAIcheckbox.checked)
			changeButton.style.display = "none";
		// Show change name button if AI checkbox is not checked
		else
			changeButton.style.display = "block";
	}
	if (playerAIcheckbox) {
		playerAIcheckbox.addEventListener("change", aiCheckbox);
		playerAIcheckbox.aiCheckbox = aiCheckbox;
		// Need this to handle initial checked state
		aiCheckbox();
	}

	// Make input field editable when change button is clicked
	const changeHandler = function () {
		originalValue = inputField.value;
		inputField.removeAttribute("readonly");
		inputField.focus();
		changeButton.style.display = "none";
		confirmButton.style.display = "block";
	};
	changeButton.addEventListener("click", changeHandler);
	changeButton.changeHandler = changeHandler;

	// Make input field readonly when confirm button is clicked
	// and check for errors
	const confirmHandler = function () {
		const playerInputs = Array.from(document.querySelectorAll("#player-cards input")).filter(input => input !== inputField);
		// Same as playerNames but all white spaces are removed and the name is converted to lowercase
		const playerNamesTemp = playerInputs.map(input => input.value.replace(/\s/g, "").toLowerCase());

		if (playerNamesTemp.includes(inputField.value.replace(/\s/g, "").toLowerCase())) {
			showError(playerNamesError);
			return;
		}

		if (inputField.value.replace(/\s/g, "") === "") {
			showError(playerNamesEmptyError);
			return;
		}

		if (checkAIName(inputField.value)) {
			showError(playerNameAIError);
			return;
		}

		inputField.setAttribute("readonly", "");
		confirmButton.style.display = "none";
		changeButton.style.display = "block";
	};
	confirmButton.addEventListener("click", confirmHandler);
	confirmButton.confirmHandler = confirmHandler;

	// If no changes were made, revert to previous state
	const blurHandler = function () {
		if (inputField.value === originalValue) {
			inputField.setAttribute("readonly", "");
			confirmButton.style.display = "none";
			changeButton.style.display = "block";
		}
	};
	inputField.addEventListener("blur", blurHandler);
	inputField.blurHandler = blurHandler;

	function showError(errorElement) {
		errorElement.style.display = "block";
		setTimeout(() => {
			errorElement.style.display = "none";
		}, 4000);
		inputField.value = inputField.defaultValue;
		inputField.removeAttribute("readonly");
		inputField.focus();
		confirmButton.style.display = "block";
		changeButton.style.display = "none";
	}
}

function createAICheckEventListener(card, i) {
	// At the start, all players except the first one are AI
	playerAICheck.push(1);
	// Checkbox for the current card
	const checkbox = card.querySelector(".is-ai");
	// Change value directly in playerAICheck array when checkbox is clicked
	// It can access the correct index because of the closure feature
	// In each iteration the value of i will be kept in the closure
	const changeHandler = function () {
		playerAICheck[i - 1] = this.checked ? 1 : 0;
	};
	checkbox.addEventListener("change", changeHandler);
	// Save the checkbox and its handler to remove the listener later
	checkbox.changeHandler = changeHandler;
}

function removeNameChangeListeners() {
	const changeButtons = document.querySelectorAll(".change-name-btn");
	changeButtons.forEach(button => {
		button.removeEventListener("click", button.changeHandler);
	});

	const confirmButtons = document.querySelectorAll(".confirm-name-change-btn");
	confirmButtons.forEach(button => {
		button.removeEventListener("click", button.confirmHandler);
	});

	const inputFields = document.querySelectorAll("#player-cards input");
	inputFields.forEach(input => {
		input.removeEventListener("blur", input.blurHandler);
	});

	const aiCheckboxes = document.querySelectorAll(".is-ai");
	aiCheckboxes.forEach(checkbox => {
		checkbox.removeEventListener("change", checkbox.aiCheckbox);
	});

	const checkboxes = document.querySelectorAll(".is-ai");
	checkboxes.forEach(checkbox => {
		checkbox.removeEventListener("change", checkbox.changeHandler);
	});
}

function createFirstRoundMatches(playerNames) {
	// Create a copy of the playerNames array
	let shuffledPlayers = [...playerNames];
	// Fisher-Yates shuffle algorithm
	for (let i = shuffledPlayers.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
	}
	// Split into pairs
	matches = [];
	for (let i = 0; i < shuffledPlayers.length; i += 2)
		matches.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
}

function prepareNextStage() {
	// Need to choose position of index based on number of current matches
	// Otherwise the next stage matches will contain wrong information
	// For the creation of the next stage matches to work properly,
	// the index must be set to the number of previous matches (0 when starting)
	let i = 0;
	let prev;
	switch (matches.length) {
		// 4 players, 3 games, 2 stages
		case 2: {
			i = 0;
			break;
		}
		case 3: {
			i = 2;
			break;
		}
		// 8 players, 7 games, 3 stages
		case 4: {
			i = 0;
			break;
		}
		case 6: {
			i = 4;
			break;
		}
		case 7: {
			i = 6;
			break;
		}
		// 16 players, 15 games, 4 stages
		case 8: {
			i = 0;
			break;
		}
		case 12: {
			i = 8;
			break;
		}
		case 14: {
			i = 12;
			break;
		}
		case 15:
			i = 14;
	}
	prev = matches.length;
	for (; i < results.length - 1; i += 2) {
		let newP1 = results[i]["P1 Score"] > results[i]["P2 Score"] ? results[i]["Player 1"] : results[i]["Player 2"];
		let newP2 = results[i + 1]["P1 Score"] > results[i + 1]["P2 Score"] ? results[i + 1]["Player 1"] : results[i + 1]["Player 2"];
		matches.push([newP1, newP2]);
	}
	bracketUpdater(prev);
}

function updateMatchInfo(p1, p2, p1Score, p2Score, stage) {
	matchInfo = {
		"Stage": stage,
		"Player 1": p1,
		"P1 Score": p1Score,
		"Player 2": p2,
		"P2 Score": p2Score
	}
	results.push(matchInfo);
}

function randomizeMatch(names, stage, p1Score, p2Score) {
	return new Promise((resolve, reject) => {
		let winner = Math.floor(Math.random() * 2);
		p1Score = winner === 0 ? 10 : Math.floor(Math.random() * 10);
		p2Score = winner === 1 ? 10 : Math.floor(Math.random() * 10);
		updateMatchInfo(names[0], names[1], p1Score, p2Score, stage);
		resolve();
	});
}
