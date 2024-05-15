let playerNames = [];
let matches = [];
let playerCount;

document.addEventListener('DOMContentLoaded', function () {
	const playButtons = document.querySelectorAll('.play-menu-button');
	const tournamentButton = playButtons[2];

	tournamentButton.addEventListener('click', function(event) {
		event.preventDefault();
		window.location.href = TOURNAMENT_HREF;
		// Set default player count to 4
		playerCount = 4;
		generatePlayerCards(playerCount);
		createFirstRoundMatches(playerNames);
	});
});

document.addEventListener("DOMContentLoaded", function() {
    const tournamentOptions = document.getElementById("tournament-options");
    const playerCountSelect = document.getElementById("player-count");
    const playerCardsContainer = document.getElementById("player-cards");

	playerCountSelect.addEventListener("change", function() {
		playerCount = parseInt(playerCountSelect.value);
		generatePlayerCards(playerCount);
		const playerInputs = playerCardsContainer.querySelectorAll("input");
		playerNames = [];
		playerInputs.forEach(function (input) {
			playerNames.push(input.value);
		});
		console.log("PLAYER NAMES: ", playerNames);
		createFirstRoundMatches(playerNames);
		console.log("CREATED MATCHES: ", matches);
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
		bracketMaker(playerCount, matches);
		document.getElementById("tournament-options").style.display = "none";
		document.getElementById("bracket").style.display = "block";
    });
});

function generatePlayerCards(playerCount) {
	const playerCardsContainer = document.getElementById("player-cards");
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

function createFirstRoundMatches(playerNames)
{
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

function generateBracket(playerCount)
{
	const bracketContainer = document.getElementById("brackets");
	bracketContainer.innerHTML = "";
	const rounds = Math.log2(playerCount);
	for (let i = 0; i < rounds; i++) {
		const roundDiv = document.createElement("div");
		roundDiv.classList.add("d-flex", "flex-column", "mb-3");

		const roundMatches = Math.pow(2, rounds - i - 1);

		for (let j = 0; j < roundMatches; j++) {
			const matchDiv = document.createElement("div");
			matchDiv.classList.add("d-flex", "justify-content-between", "mb-3");

			const player1Div = document.createElement("div");
			player1Div.textContent = "Player 1";
			matchDiv.appendChild(player1Div);

			const vsDiv = document.createElement("div");
			vsDiv.textContent = "vs";
			matchDiv.appendChild(vsDiv);

			const player2Div = document.createElement("div");
			player2Div.textContent = "Player 2";
			matchDiv.appendChild(player2Div);

			roundDiv.appendChild(matchDiv);
		}
		bracketContainer.appendChild(roundDiv);
	};
	bracketContainer.style.display = "block";
};

function getStage(stages, i)
{
	const stageMap = {
		4: ["Eighths", "Eighths", "Eighths", "Eighths", "Eighths", "Eighths", "Eighths", "Eighths", "Quarters", "Quarters", "Quarters", "Quarters", "Semis", "Semis", "Final"],
		3: ["Quarters", "Quarters", "Quarters", "Quarters", "Semis", "Semis", "Final"],
		2: ["Semis", "Semis", "Final"]
	};
	return stageMap[stages][i];
}

function prepareNextStage(matches, results)
{
	// Need to choose position of index based on number of current matches
	// Otherwise the next stage matches will contain wrong information
	// For the creation of the next stage matches to work properly,
	// the index must be set to the number of previous matches (0 when starting)
	let i = 0;
	console.log("Matches length before choosing index: ", matches.length);
	switch (matches.length)
	{
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
	for (; i < results.length - 1; i += 2)
	{
		let newP1 = results[i]["P1 Score"] > results[i]["P2 Score"] ? results[i]["Player 1"] : results[i]["Player 2"];
		let newP2 = results[i + 1]["P1 Score"] > results[i + 1]["P2 Score"] ? results[i + 1]["Player 1"] : results[i + 1]["Player 2"];
		matches.push([newP1, newP2]);
	}
}

function randomizeMatch(names, results, stages, i)
{
	let winner = Math.floor(Math.random() * 2);
	let p1score = winner === 0 ? 10 : Math.floor(Math.random() * 10);
	let p2score = winner === 1 ? 10 : Math.floor(Math.random() * 10);
	let matchInfo = {
		"Stage": getStage(stages, i),
		"Player 1": names[0],
		"P1 Score": p1score,
		"Player 2": names[1],
		"P2 Score": p2score
	}
	results.push(matchInfo);
}

async function tournamentMatch(names, results, stages, i)
{
	const tournamentSection = document.getElementById("tournament-options");
	const pongPlayButton = document.getElementById("start-match");
	const pongSection = document.getElementById("pong");
	tournamentSection.style.display = "none";
	pongPlayButton.click();

	await new Promise((resolve) => {
		// Create a new MutationObserver that resolves the promise when the game section is hidden
		const observer = new MutationObserver((mutationsList, observer) => {
			for (let mutation of mutationsList) {
				if (mutation.type === 'attributes' && mutation.attributeName === 'style' && pongSection.style.display === 'none') {
					observer.disconnect();
					resolve();
				}
			}
		});
		// Start observing the game section for changes to its style
		observer.observe(pongSection, { attributes: true, childList: false, subtree: false });
	});
	document.getElementById("play-1-vs-1-local").style.display = "none";
	window.location.href = TOURNAMENT_HREF;
	tournamentSection.style.display = "block";
}

async function tournament(playerNames)
{
	// Create a copy of the playerNames array
	let shuffledPlayers = [...playerNames];
	// Fisher-Yates shuffle algorithm
	for (let i = shuffledPlayers.length - 1; i > 0; i--)
	{
		let j = Math.floor(Math.random() * (i + 1));
		[shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
	}
	// Split into pairs
	let matches = [];
	for (let i = 0; i < shuffledPlayers.length; i += 2)
		matches.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
	// Determine number of stages
	let size = matches.length * 2;
	let stages = 0;
	while (size > 1)
	{
		size /= 2;
		stages++;
	}
	// Calculate total number of games
	// 2 ^ stages - 1
	let totalGames = 2 ** stages - 1;
	let results = [];
	for (let i = 0; i < totalGames; i++)
	{
		// Check if both players are AI to randomize the result
		if ((/^AI [1-9]$|^AI 1[0-5]$/.test(matches[i][0]))
			&& (/^AI [1-9]$|^AI 1[0-5]$/.test(matches[i][1])))
			// randomizeMatch(matches[i], results, stages, i);
			await tournamentMatch(matches[i], results, stages, i);
		else
			await tournamentMatch(matches[i], results, stages, i);
		// Check if all matches for the stage have been played
		if (i != totalGames - 1 && i === matches.length - 1)
			prepareNextStage(matches, results);
	}
	console.log("FINAL RESULTS");
	console.log("Previous matches: ", matches);
	console.log("Previous results: ", results);
}
