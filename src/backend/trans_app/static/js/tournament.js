document.addEventListener('DOMContentLoaded', function() {
	const playButtons = document.querySelectorAll('.play-menu-button');
	const tournamentButton = playButtons[2];

	tournamentButton.addEventListener('click', function(event) {
		event.preventDefault();
		window.location.href = TOURNAMENT_HREF;
		if (document.getElementById('numberOfPlayers'))
			checkTournamentSelectedPlayers();
	});
});

document.getElementById('numberOfPlayers').addEventListener('input', function(num) {
	if (!num.target.value)
		toggleDisplay(['tournament-uneven-players', 'tournament-wrong-players', 'tournament-players-ok'], 'none');
	else if (num.target.value < 2 || num.target.value > 8)
	{
		toggleDisplay(['tournament-wrong-players'], 'block');
		toggleDisplay(['tournament-uneven-players', 'tournament-players-ok'], 'none');
	}
	else if (num.target.value % 2 != 0)
	{
		toggleDisplay(['tournament-uneven-players'], 'block');
		toggleDisplay(['tournament-wrong-players', 'tournament-players-ok'], 'none');
	}
	else
	{
		toggleDisplay(['tournament-players-ok'], 'block');
		toggleDisplay(['tournament-uneven-players', 'tournament-wrong-players'], 'none');
	}
});
