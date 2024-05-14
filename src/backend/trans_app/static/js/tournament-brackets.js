function bracketMaker(playerCount) {
	const bracket = document.getElementById("bracket");
	const bracketContainer = document.getElementsByClassName("bracket-container");
	// Clear the bracket container
	for (let i = 0; i < bracketContainer.length; i++)
		bracketContainer[i].innerHTML = '';
	const rounds = Math.log2(playerCount);
	// Add columns for each round
	for (let i = 0; i < rounds; i++) {
		const roundMatches = Math.pow(2, rounds - i - 1);
		const roundDiv = document.createElement('div');
		let round = getRound(rounds, i);
		roundDiv.className = round;
		roundDiv.textContent = round
		for (let j = 0; j < bracketContainer.length; j++)
			bracketContainer[j].appendChild(roundDiv);
		// Add matches for each round
		for (let j = 0; j < roundMatches; j++) {
			const matchDiv = document.createElement('div');
			matchDiv.className = 'match';
			roundDiv.appendChild(matchDiv);
			// Add players for each match
			for (let k = 0; k < 2; k++) {
				const playerDiv = document.createElement('div');
				playerDiv.className = 'player';
				playerDiv.textContent = 'Player ' + (j * 2 + k + 1);
				matchDiv.appendChild(playerDiv);
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

function createBracketMatch(target)
{

}