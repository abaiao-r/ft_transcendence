function createMatchCard()
{
	const allRounds = document.querySelectorAll('.bracket-container');
	for (let i = 0; i < allRounds.length; i++) {
		let roundDiv = allRounds[i].querySelectorAll('.round');
		for (let j = 0; j < roundDiv.length; j++) {
			let matchesDiv = roundDiv[j].querySelector('.matches');
			let matchDivs = matchesDiv.querySelectorAll('.match');
			for (let k = 0; k < matchDivs.length; k++) {
				let p1Name = matchDivs[k].querySelectorAll('.t-player-name')[0].textContent;
				let p2Name = matchDivs[k].querySelectorAll('.t-player-name')[1].textContent;
				let p1Score = matchDivs[k].querySelectorAll('.t-player-score')[0].textContent;
				let p2Score = matchDivs[k].querySelectorAll('.t-player-score')[1].textContent;
				let roundText = roundDiv[j].querySelector('span').textContent;
				// If the scores of a match are 0-0 that is the match to be played
				if (p1Score == '0' && p2Score == '0')
				{
					document.getElementById("t-player-name-1").textContent = p1Name;
					document.getElementById("t-player-name-2").textContent = p2Name;
					return;
				}
			}
		}
	}
}

function updateMatchCard(p1score, p2score)
{
	document.getElementById("t-player-score-1").textContent = p1score;
	document.getElementById("t-player-score-2").textContent = p2score;
	document.getElementById("t-player-score-1").style.display = "block";
	document.getElementById("t-player-score-2").style.display = "block";
}
