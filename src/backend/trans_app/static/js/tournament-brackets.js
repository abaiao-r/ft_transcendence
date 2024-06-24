
/* Displays toast message with the winner of the tournament */
function displayWinner()
{
	let winner = tournamentManager.getTournamentWinner().displayName;
	let toast = document.getElementById('toast-winner');
	toast.textContent = `${winner} won the tournament!`;
	toast.style.visibility = "visible";
	setTimeout(function () { toast.style.visibility = "hidden"; }, 5000);
}

/* Clears the toast message with the winner of the tournament */
function clearDisplayWinner() {
	document.getElementById('toast-winner').style.visibility = "hidden";
}

document.addEventListener('DOMContentLoaded', function () {
	handleTournamentDOM();
});

/* Handles tournament when DOM loads */
function handleTournamentDOM() {
	if (tournamentManager.isTournamentComplete()) {
		displayWinner();
		tournamentManager.resetTournament();
		document.getElementById('next-match').style.display = "none";
		document.getElementById('start-next-match').style.display = "none";
	}

	document.getElementById('next-match').addEventListener('click', function () {
		handleNextMatch();
	});
	document.getElementById('start-next-match').addEventListener('click', async function () {
		await handleStartMatch();
	});
	document.getElementById('continue-tournament').addEventListener('click', function () {
		handleContinueTournament();
	});
}

function handleContinueTournament() {
	goToPage(TOURNAMENT_BRACKET_HREF);
	tournamentManager.renderTournament();
	if (tournamentManager.isTournamentComplete()) {
		displayWinner();
		tournamentManager.resetTournament();
		document.getElementById('next-match').style.display = "none";
		document.getElementById('start-next-match').style.display = "none";
	}
}

/* Play tournament match and return it */
async function playTournamentMatch() {
	document.getElementById('hidden-next-match').click();
	return await new Promise((resolve) => {
		document.addEventListener('gameOver', function (event) {
			const gameDataString = event.detail.gameData;
            const gameData = JSON.parse(gameDataString);
			if (gameData[0]['Game aborted'] == "No") {
				let match = tournamentManager.updateMatch(gameData[1].Name, gameData[1].Score, gameData[2].Name, gameData[2].Score);
				resolve(match);
			} else {
				/*console.info("Game aborted");*/
			}
		}, { once: true });
	});
}

async function handleStartMatch() {
	let match = tournamentManager.getNextMatch();
	const player1 = match.player1;
	const player2 = match.player2;

	/* Simulates if both ai */
	if (player1.isAi && player2.isAi) {
		match = tournamentManager.simulateNextMatch();
	}
	/* Actually play the match */
	else {
		match = await playTournamentMatch();
	}
	updateMatchCard(match.score1, match.score2);
	displayContinueTournament();
}

function displayContinueTournament() {
	document.getElementById('play-1-vs-1-local').style.display = 'none';
	document.getElementById('pong').style.display = 'none';
	document.getElementById('start-next-match').style.display = "none";
	document.getElementById('tournament-match').style.display = "block";
	document.getElementById('continue-tournament').style.display = "block";
}

function handleNextMatch() {
	goToPage(TOURNAMENT_MATCH_HREF);
	displayStartNextMatch();
	let match = tournamentManager.getNextMatch();
	createMatchCard(match.player1.displayName, match.player2.displayName);
}

function displayStartNextMatch() {
	document.getElementById("t-player-score-1").style.display = "none";
	document.getElementById("t-player-score-2").style.display = "none";
	document.getElementById('start-next-match').style.display = "block";
	document.getElementById('continue-tournament').style.display = "none";
}

