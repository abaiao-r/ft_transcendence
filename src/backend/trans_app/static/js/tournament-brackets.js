let tournamentMatchPlayers = [];

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
	console.log("After match update: Rounds: ", roundDivs);
	let roundDiv;
	for (let div of roundDivs) {
		let roundNameSpan = div.querySelector('.round-name');
		if (roundNameSpan.textContent === matchInfo.Stage) {
			roundDiv = div;
			break;
		}
	}
	console.log("Selected round: ", roundDiv);
	let matchesDiv = roundDiv.querySelector('.matches');
	let matchDivs = Array.from(matchesDiv.querySelectorAll('.match'));
	console.log("Selected match: ", matchDivs);
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
	// Change result color based on winner
	if (parseInt(matchInfo["P1 Score"]) > parseInt(matchInfo["P2 Score"])) {
		p1ScoreDiv.classList.add('winner');
		p2ScoreDiv.classList.add('loser');
	} else if (parseInt(matchInfo["P1 Score"]) < parseInt(matchInfo["P2 Score"])) {
		p1ScoreDiv.classList.add('loser');
		p2ScoreDiv.classList.add('winner');
	}
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
		return;
	}
}

function checkAIName(name)
{
	if (/^AI [1-9]$|^AI 1[0-5]$/.test(name))
		return true;
	return false;
}

async function matchSelect()
{
	const allRounds = document.querySelectorAll('.bracket-container');
	for (let i = 0; i < allRounds.length; i++)
	{
		let roundDiv = allRounds[i].querySelectorAll('.round');
		for (let j = 0; j < roundDiv.length; j++)
		{
			let matchesDiv = roundDiv[j].querySelector('.matches');
			let matchDivs = matchesDiv.querySelectorAll('.match');
			for (let k = 0; k < matchDivs.length; k++)
			{
				let p1Name = matchDivs[k].querySelectorAll('.t-player-name')[0].textContent;
				let p2Name = matchDivs[k].querySelectorAll('.t-player-name')[1].textContent;
				let p1Score = matchDivs[k].querySelectorAll('.t-player-score')[0].textContent;
				let p2Score = matchDivs[k].querySelectorAll('.t-player-score')[1].textContent;
				let roundText = roundDiv[j].querySelector('span').textContent;
				// If the scores of a match are 0-0 that is the match to be played
				if (p1Score == '0' && p2Score == '0')
				{
					if (checkAIName(p1Name) && checkAIName(p2Name))
						await randomizeMatch([p1Name, p2Name], roundText, p1Score, p2Score);
					else
					{
						tournamentMatchPlayers = [p1Name, p2Name, roundText];
						document.getElementById('hidden-next-match').click();
						// Wait for the end of the game
						await new Promise((resolve) => {
							document.addEventListener('gameOver', resolve, { once: true });
						});
						window.location.href = TOURNAMENT_HREF;
						// document.getElementById('play-1-vs-1-local').style.display = 'none';
						// document.getElementById('bracket').style.display = 'block';
					}
					console.log("After match matchInfo: ", matchInfo);
					bracketScoreUpdater();
					// If this is the last match of the round, prepare the next round
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