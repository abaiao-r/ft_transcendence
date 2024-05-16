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
	const rounds = Math.log2(playerCount);
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

function bracketScoreUpdater(results)
{
	// Select the round div based on the stage
	let roundDiv = document.querySelector(`.round[data-stage="${results.Stage}"]`);
	// Select the match div based on the player names
	let matchDiv = roundDiv.querySelector(`.match[data-player1="${results["Player 1"]}"][data-player2="${results["Player 2"]}"]`);
	// Select the player score divs
	let p1ScoreDiv = matchDiv.querySelector('.p1-score');
	let p2ScoreDiv = matchDiv.querySelector('.p2-score');
	// Update the scores
	p1ScoreDiv.textContent = results["P1 Score"];
	p2ScoreDiv.textContent = results["P2 Score"];
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
