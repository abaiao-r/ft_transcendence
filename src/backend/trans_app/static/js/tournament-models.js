let tournamentManager;

class Tournament {
    constructor() {
        this.players = [];
        this.currentRound = 0;
        this.matchHistory = {}; // map of round number to array of matches
        this.numberOfRounds = 0;
        this.roundNames = ["Final", "Semis", "Quarters", "Round of 16"];
    }

	hasTournamentStarted() {
		if (this.players &&  this.players.length > 0) {
			
			return true;
		}
		
		return false;
	}

    getRoundName(roundIndex) {
        return this.roundNames[this.numberOfRounds - roundIndex];
    }

    setPlayers(players) {
        this.players = players.slice(0, 16); // Take up to 16 players
        // Calculate number of rounds
        this.numberOfRounds = Math.ceil(Math.log2(this.players.length));
        this.currentRound = 1;
        // Initialize match history
        for (let i = 1; i <= this.numberOfRounds; i++) {
            this.matchHistory[i] = [];
        }
    }

    shufflePlayers() {
        if (!this.players) {
            
            return;
        }

        for (let i = this.players.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.players[i], this.players[j]] = [this.players[j], this.players[i]];
		}
    }

    /* 
    * Create matches for the current round
    */
    setupRound() {
        if (!this.players || this.players.length === 0) {
            
            return;
        }

        if (this.matchHistory[this.currentRound].length > 0) {
            
            return;
        }

        // Create matches for the current round
        const currentRoundMatches = [];
        for (let i = 0; i < this.players.length; i += 2) {
            const match = {
                player1: this.players[i],
                player2: this.players[i + 1],
                score1: -1,
                score2: -1,
                winner: null,
                roundName:this.getRoundName(this.currentRound)
            };
            currentRoundMatches.push(match);
        }
        // Add current round matches to round history
        this.matchHistory[this.currentRound] = currentRoundMatches;
    }

    /* 
    * Update match with the given scores
    */
    updateMatch(player1Name, score1, player2Name, score2) {
        // Find the match in the current round
        const match = this.matchHistory[this.currentRound].find(
            match => match.player1.displayName === player1Name
            && match.player2.displayName === player2Name);

        if (match) {
            match.score1 = score1;
            match.score2 = score2;
            match.winner = score1 > score2 ? match.player1 : match.player2;
            const loser = score1 > score2 ? match.player2 : match.player1;
            // Remove loser from players
            this.players = this.players.filter(player => player !== loser);
        } else {
            
        }
    }

    advanceToNextRound() {
        if (!this.isRoundComplete()) {
			
            return;
		}
            
        if (this.currentRound === this.numberOfRounds) {
            
            return;
        }

        // Get winners of the current round
        this.currentRound++;
    }

	isRoundComplete() {
        return this.hasTournamentStarted() && this.matchHistory[this.currentRound].every(match => match.winner !== null);
    }

    getNextMatch() {
        return this.matchHistory[this.currentRound].find(match => match.winner === null);
    }

    simulateNextMatch() {
        const match = this.getNextMatch();

        if (match) {
            const score1 = Math.floor(Math.random() * 11);
            let score2;
            if (score1 === 10) {
                score2 = Math.floor(Math.random() * 10);
            } else {
                score2 = 10;
            }
            this.updateMatch(match.player1.displayName, score1, match.player2.displayName, score2);
            return match;
        }
        else {
            
            return null;
        }
    }

    getTournamentWinner() {
        return this.hasTournamentStarted() && this.matchHistory[this.numberOfRounds][0].winner;
    }

    
    isTournamentComplete() {
        return this.hasTournamentStarted() && this.currentRound === this.numberOfRounds && this.matchHistory[this.numberOfRounds][0].winner !== null;
    }

    static fromJSON(json) {
        const data = JSON.parse(json);
        const tournament = new Tournament();
        tournament.players = data.players;
        tournament.currentRound = data.currentRound;
        tournament.matchHistory = data.matchHistory;
        tournament.numberOfRounds = data.numberOfRounds;
        return tournament;
    }

    // method to be human readable in a pretty format
    string() {
        let result = '';
        for (let i = 1; i <= this.numberOfRounds; i++) {
            result += `Round ${i}:\n`;
            this.matchHistory[i].forEach(match => {
                result += `${match.player1.displayName} vs ${match.player2.displayName}: ${match.score1} - ${match.score2}\n`;
            });
            result += '\n';
        }
        return result;
	}
}

class TournamentVisualizer {
    constructor(tournament) {
        this.container = document.querySelector('.bracket-container');
        this.tournament = tournament;
    }

    render() {
        if (!this.tournament) {
            
            return;
        }

		let numberOfRounds = this.tournament.numberOfRounds;
        let totalMatches = Math.pow(2, numberOfRounds - 1);
		
        // Generate match elements for each round
        this.container.innerHTML = '';
        for (let i = 0; i < numberOfRounds; i++) {
            const roundDiv = document.createElement('div');
            roundDiv.className = 'round match-container';
            
            roundDiv.innerHTML = `<h3>${this.getRoundName(i + 1, numberOfRounds)}</h3>`;
            this.container.appendChild(roundDiv);

            // Generate match elements for each match in the round
            for (let j = 0; j < totalMatches; j++) {
                const match = this.tournament.matchHistory[i + 1][j];
                const matchElement = this.generateMatchElement(match);
                roundDiv.appendChild(matchElement);
            }
            totalMatches /= 2; // Reduce the number of matches for the next round
        }
    }

	generateMatchElement(match) {
		const matchDiv = document.createElement('div');
		matchDiv.className = 'container-fluid d-flex justify-content-between align-items-center p-3 mb-2 bg-light border';
	
		// If match is null, display TBD
		if (match == null) {
			matchDiv.innerHTML = `
				<div class="p-2 bg-secondary text-white rounded">TBD</div>
				<span class="px-2">vs</span>
				<div class="p-2 bg-secondary text-white rounded">TBD</div>
			`;
		} else {
            
			const playerScore1 = match.score1 != -1 ? `${match.score1}` : '';
			const playerScore2 = match.score2 != -1 ? `${match.score2}` : '';

			// Adds a trophy emoji to the winner
			const trophy = '🏆';
			let winner1 = '', winner2 = '';
			if (match.winner != null && match.winner.displayName === match.player1.displayName) {
				winner1 = trophy;
			}
			if (match.winner != null && match.winner.displayName === match.player2.displayName) {
				winner2 = trophy;
			}

			matchDiv.innerHTML = `
				<div class="match-container-tournament">
					<div class="player-name-left-tournament">${match.player1.displayName}</div>
					<div class=winner-tournament>${winner1}</div>
					<div class="score-tournament">${playerScore1}</div>
					<div class="vs-tournament">-</div>
					<div class="score-tournament">${playerScore2}</div>
					<div class=winner-tournament>${winner2}</div>
					<div class="player-name-right-tournament">${match.player2.displayName}</div>
				</div>
		`;
		}
		return matchDiv;
	}

    getRoundName(roundIndex, totalRounds) {
        const roundNames = ["Final", "Semis", "Quarters", "Round of 16"];
        return roundNames[totalRounds - roundIndex];
    }
}

class TournamentManager {
    constructor() {
        
        const tournament = this.getBackupTournament();
        
        if (tournament) {
            
            this.tournament = Tournament.fromJSON(tournament);
        }
        else {
            
            this.tournament = new Tournament();
        }
        this.tournamentVisualizer = new TournamentVisualizer(this.tournament);
    }

	hasTournamentStarted() {
		return this.tournament.hasTournamentStarted();
	}

 /*    simulateNextMatch() {
        
        return this.tournament.simulateNextMatch();
    } */

    simulateNextMatch() {
        const match = this.tournament.simulateNextMatch();
        if (match) {
            this.saveTournament();
        }
        return match;
    }

    shufflePlayers() {
        
        this.tournament.shufflePlayers();
        this.saveTournament();
    }

    setPlayers(players) {
        
        this.tournament.setPlayers(players.slice(0, 16)); // Take up to 16 players
        this.saveTournament();
    }

    savePlayerNames(playerCount, playerNames) {
        
        localStorage.setItem('playerNames', JSON.stringify(playerNames));
        localStorage.setItem('playerCount', parseInt(playerCount));
        this.tournament.setPlayers(playerNames);
    }

    saveTournament() {
        
        localStorage.setItem('tournament', JSON.stringify(this.tournament));
        
    }

    getBackupTournament() {
        return localStorage.getItem('tournament');
    }

    resetTournament() {
        
/*         localStorage.removeItem('playerNames');
        localStorage.removeItem('playerCards');
        localStorage.removeItem('playerCount'); */
        console.info("Resetting tournament");
        localStorage.removeItem('tournament');
        this.tournament = new Tournament();
        this.tournamentVisualizer = new TournamentVisualizer(this.tournament);
        //this.saveTournament();
    }

    getNextMatch() {
        
        return this.tournament.getNextMatch();
    }

    renderTournament() {
        
        this.tournamentVisualizer.render();
    }

    advanceToNextRound() {
        
        this.tournament.advanceToNextRound();
        this.saveTournament();
    }

    isRoundComplete() {
        
        return this.tournament.isRoundComplete();
    }

    updateMatch(player1, score1, player2, score2) {
        
        this.tournament.updateMatch(player1, score1, player2, score2);
        this.saveTournament();
    }

    getTournamentWinner() {
        
        return this.tournament.getTournamentWinner();
    }

    isTournamentComplete() {
        
        return this.tournament.isTournamentComplete();
    }

    setupRound() {
        console.info("Setting up round");
        this.tournament.setupRound();
        this.saveTournament();
    }
}