function bracketMaker()
{
	const roundNames = [
		"Round of 16",
		"Quarters",
		"Semis",
		"Final"
	]
	const bracketContainer = document.getElementsByClassName("bracket-container");
	// Clear the bracket container
	for (let i = 0; i < bracketContainer.length; i++)
		bracketContainer[i].innerHTML = '';
	// Add columns for each round
	for (let i = 0; i < rounds; i++)
	{
		const roundMatches = Math.pow(2, rounds - i - 1);
		const roundDiv = document.createElement('div');
		let round = roundNames[roundNames.length - rounds + i];
		roundDiv.className = 'round';
		let roundSpan = document.createElement('span');
		roundSpan.className = 'round-name';
		roundSpan.textContent = round;
		roundDiv.appendChild(roundSpan);
		// roundDiv.textContent = round;
		for (let j = 0; j < bracketContainer.length; j++)
			bracketContainer[j].appendChild(roundDiv);
		// Create a new div to hold the matches
		const matchesDiv = document.createElement('div');
		matchesDiv.className = 'matches';
		roundDiv.appendChild(matchesDiv);
		// Add matches to each round
		for (let j = 0; j < roundMatches; j++)
		{
			const matchDiv = document.createElement('div');
			matchDiv.className = 'match';
			matchesDiv.appendChild(matchDiv);
			// Add players to each match
			for (let k = 0; k < 2; k++)
			{
				const playerDiv = document.createElement('div');
				playerDiv.className = 't-player';
				matchDiv.appendChild(playerDiv);
				// div for the player name
				const playerNameDiv = document.createElement('div');
				playerNameDiv.className = 't-player-name';
				// Only add player names to the first round
				if (i === 0)
					playerNameDiv.textContent = matches[j][k];
				playerDiv.appendChild(playerNameDiv);
				// div for the player score
				const playerScoreDiv = document.createElement('div');
				playerScoreDiv.className = 't-player-score';
				playerScoreDiv.textContent = '0';
				playerDiv.appendChild(playerScoreDiv);
			}
		}
	}
}

function bracketScoreUpdater() {
	// Loop round divs until the round with the correct name is found
	let roundDivs = Array.from(document.querySelectorAll('.round'));
	let roundDiv;
	for (let div of roundDivs) {
		let roundNameSpan = div.querySelector('.round-name');
		if (roundNameSpan.textContent === matchInfo.Stage) {
			roundDiv = div;
			break;
		}
	}
	let matchesDiv = roundDiv.querySelector('.matches');
	let matchDivs = Array.from(matchesDiv.querySelectorAll('.match'));
	let player1Div, player2Div;
	// Loop over each match div to look for the match with both players
	for (let matchDiv of matchDivs) {
		let playerDivs = Array.from(matchDiv.querySelectorAll('.t-player'));
		if (playerDivs[0].querySelector('.t-player-name').textContent == matchInfo["Player 1"]
			&& playerDivs[1].querySelector('.t-player-name').textContent == matchInfo["Player 2"])
		{
			player1Div = playerDivs[0];
			player2Div = playerDivs[1];
			break;
		}
	}
	let p1ScoreDiv = player1Div.querySelector('.t-player-score');
	let p2ScoreDiv = player2Div.querySelector('.t-player-score');
	p1ScoreDiv.textContent = matchInfo["P1 Score"];
	p2ScoreDiv.textContent = matchInfo["P2 Score"];
}

function bracketUpdater(prev)
{
	const roundDivs = document.querySelectorAll('.round');
	for (let i = 0; i < roundDivs.length; i++)
	{
		let matchesDiv = roundDivs[i].querySelector('.matches');
		let matchDivs = matchesDiv.querySelectorAll('.match');
		// If the first match in the round has a player name, then the round is already filled
		if (matchDivs[0].querySelector('.t-player-name').textContent !== '')
			continue;
		for (let j = 0; j < matchDivs.length; j++, prev++)
		{
			matchDivs[j].querySelectorAll('.t-player-name')[0].textContent = matches[prev][0];
			matchDivs[j].querySelectorAll('.t-player-name')[1].textContent = matches[prev][1];
		}
	}
}

function checkAIMatch(p1, p2)
{
	if ((/^AI [1-9]$|^AI 1[0-5]$/.test(p1))
		&& (/^AI [1-9]$|^AI 1[0-5]$/.test(p2)))
		return true;
	return false;
}

async function matchSelect()
{
	const allRounds = document.querySelectorAll('.bracket-container');
	console.log("Rounds: ", allRounds);
	for (let i = 0; i < allRounds.length; i++)
	{
		let roundDiv = allRounds[i].querySelectorAll('.round');
		console.log("Round: ", roundDiv);
		for (let j = 0; j < roundDiv.length; j++)
		{
			let matchesDiv = roundDiv[j].querySelector('.matches');
			let matchDivs = matchesDiv.querySelectorAll('.match');
			console.log("Matches: ", matchDivs);
			for (let k = 0; k < matchDivs.length; k++)
			{
				let p1Name = matchDivs[k].querySelectorAll('.t-player-name')[0].textContent;
				let p2Name = matchDivs[k].querySelectorAll('.t-player-name')[1].textContent;
				let p1Score = matchDivs[k].querySelectorAll('.t-player-score')[0].textContent;
				let p2Score = matchDivs[k].querySelectorAll('.t-player-score')[1].textContent;
				let roundText = roundDiv[j].querySelector('span').textContent;
				console.log("Player 1: ", p1Name);
				console.log("Player 2: ", p2Name);
				console.log("Player 1 Score: ", p1Score);
				console.log("Player 2 Score: ", p2Score);
				console.log("Round text: ", roundText);
				// If the scores of a match are 0-0 that is the match to be played
				if (p1Score == '0' && p2Score == '0')
				{
					if (checkAIMatch(p1Name, p2Name))
						randomizeMatch([p1Name, p2Name], roundText);
					else
					{
						randomizeMatch([p1Name, p2Name], roundText);
						// await startTournamentGame();
						updateMatchInfo(p1Name, p2Name, p1Score, p2Score, roundText);
						bracketScoreUpdater();
						document.getElementById('bracket').style.display = 'block';
					}
					// If this is the last match of the round, this will be used
					// to trigger the preparation of the next round
					if (k == matchDivs.length - 1)
						 prepareNextStage();
					return;
				}
			}
		}
	}
}


document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('next-match').addEventListener('click', function () {
		matchSelect();
	});
});