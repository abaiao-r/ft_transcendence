function bracketMaker(playerCount, matches)
{
	const bracket = document.getElementById("bracket");
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
		let round = getRound(rounds, i);
		roundDiv.className = round;
		roundDiv.textContent = round
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
				playerDiv.className = 'player';
				matchDiv.appendChild(playerDiv);
				// div for the player name
				const playerNameDiv = document.createElement('div');
				playerNameDiv.className = 'player-name';
				// Only add player names to the first round
				if (i === 0)
					playerNameDiv.textContent = matches[j][k];
				playerDiv.appendChild(playerNameDiv);
				// div for the player score
				const playerScoreDiv = document.createElement('div');
				playerScoreDiv.className = 'player-score';
				playerScoreDiv.textContent = '0';
				playerDiv.appendChild(playerScoreDiv);
			}
		}
	}
}

function getRound(rounds, roundNum)
{
	const roundNames = [
		"Round of 16",
		"Quarters",
		"Semis",
		"Final"
	]
	return roundNames[roundNames.length - rounds + roundNum];
}
