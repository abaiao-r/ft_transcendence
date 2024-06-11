function createMatchCard(player1, player2)
{
	document.getElementById("t-player-name-1").textContent = player1;
	document.getElementById("t-player-name-2").textContent = player2;
}

function updateMatchCard(p1score, p2score)
{
	document.getElementById("t-player-score-1").textContent = p1score;
	document.getElementById("t-player-score-2").textContent = p2score;
	document.getElementById("t-player-score-1").style.display = "block";
	document.getElementById("t-player-score-2").style.display = "block";
}
