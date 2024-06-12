class Player {
    constructor() {
        this._displayName = '';
        this._isAi = false;
        this._isHost = false;
        this._username = ''; // Host username
    }

    // create getters and setters
    get displayName() {
        return this._displayName;
    }

    set displayName(displayName) {
        this._displayName = displayName;
    }

    get isAi() {
        return this._isAi;
    }

    set isAi(isAi) {
        this._isAi = isAi;
    }

    get isHost() {
        return this._isHost;
    }

    set isHost(isHost) {
        this._isHost = isHost;
    }

    get username() {
        return this._username;
    }

    set username(username) {
        this._username = username;
    }
}

class Tournament {
    constructor() {
        this.players = [];
        this.currentRound = 0;
        this.matchHistory = {}; // map of round number to array of matches
        this.numberOfRounds = 0;
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
            console.log("No players found");
            return;
        }

        for (let i = this.players.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.players[i], this.players[j]] = [this.players[j], this.players[i]];
		}
    }

    setupRound() {
        if (!this.players || this.players.length === 0) {
            console.log("No players found");
            return;
        }

        if (this.matchHistory[this.currentRound].length > 0) {
            console.log("Round already set up");
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
                winner: null
            };
            currentRoundMatches.push(match);
        }
        // Add current round matches to round history
        this.matchHistory[this.currentRound] = currentRoundMatches;
    }

    updateMatch(player1, score1, player2, score2) {
        // Find the match in the current round
        const match = this.matchHistory[this.currentRound]
            .find(match => match.player1 === player1
                && match.player2 === player2);

        if (match) {
            match.score1 = score1;
            match.score2 = score2;
            match.winner = score1 > score2 ? player1 : player2;
            const loser = score1 > score2 ? player2 : player1;
            // Remove loser from players
            this.players = this.players.filter(player => player !== loser);
        } else {
            console.log("Match not found");
        }
    }

    advanceToNextRound() {
        if (!this.isRoundComplete()) {
			console.log("Round is not complete yet");
            return;
		}
            
        if (this.currentRound === this.numberOfRounds) {
            console.log("Tournament is complete");
            return;
        }

        // Get winners of the current round
        this.currentRound++;
    }

	isRoundComplete() {
        return this.matchHistory[this.currentRound].every(match => match.winner !== null);
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
            this.updateMatch(match.player1, score1, match.player2, score2);
            return match;
        }
        else {
            console.log("No match to simulate");
            return null;
        }
    }

    getTournamentWinner() {
        return this.matchHistory[this.numberOfRounds][0].winner;
    }

    isTournamentComplete() {
        return this.currentRound === this.numberOfRounds;
    }

    static fromJSON(json) {
        const tournament = new Tournament();
        tournament.players = json.players;
        tournament.currentRound = json.currentRound;
        tournament.matchHistory = json.matchHistory;
        tournament.numberOfRounds = json.numberOfRounds;
        return tournament;
    }

    // method to be human readable in a pretty format
    string() {
        let result = '';
        for (let i = 1; i <= this.numberOfRounds; i++) {
            result += `Round ${i}:\n`;
            this.matchHistory[i].forEach(match => {
                result += `${match.player1} vs ${match.player2}: ${match.score1} - ${match.score2}\n`;
            });
            result += '\n';
        }
        return result;
	}
}

// Example players
//const players = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "George", "Hannah", "Ivy", "Jack", "Karl", "Liam", "Mia", "Noah", "Olivia", "Peter"];

const players = ['pedgonca', 'AI 1', 'AI 2', 'AI 3']

// Initialize the tournament
const pongTournament = new Tournament();
pongTournament.setPlayers(players);
console.log("Initial Matches:\n", pongTournament.toString());

// Update some matches in the first round
/*
pongTournament.updateMatch("Alice", 21, "Bob", 15);
pongTournament.updateMatch("Charlie", 10, "Diana", 21);
pongTournament.updateMatch("Eve", 21, "Frank", 18);
pongTournament.updateMatch("George", 21, "Hannah", 13);
pongTournament.updateMatch("Ivy", 21, "Jack", 19);
pongTournament.updateMatch("Karl", 21, "Liam", 17);
pongTournament.updateMatch("Mia", 21, "Noah", 15);
pongTournament.advanceToNextRound();
pongTournament.updateMatch("Olivia", 21, "Peter", 14);
console.log(pongTournament.isRoundComplete());

console.log("\nAfter Some Matches:\n", pongTournament.toString());

// Advance to next round
pongTournament.advanceToNextRound();
console.log("\nSecond Round Setup:\n", pongTournament.toString());
pongTournament.updateMatch("Alice", 21, "Diana", 15);
pongTournament.updateMatch("Eve", 21, "George", 18);
console.log("\nAfter Second Round Matches:\n", pongTournament.toString()); */


class TournamentVisualizer {
    constructor(tournament) {
        this.container = document.querySelector('.bracket-container');
        this.tournament = tournament;
    }

    render() {
        if (!this.tournament) {
            console.log("No tournament found");
            return;
        }
        console.log("RENDERING: " + this.tournament.string());

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
			if (match.winner === match.player1) {
				winner1 = trophy;
			}
			if (match.winner === match.player2) {
				winner2 = trophy;
			}

			matchDiv.innerHTML = `
				<div class="match-container-tournament">
					<div class="player-name-left-tournament">${match.player1}</div>
					<div class=winner-tournament>${winner1}</div>
					<div class="score-tournament">${playerScore1}</div>
					<div class="vs-tournament">-</div>
					<div class="score-tournament">${playerScore2}</div>
					<div class=winner-tournament>${winner2}</div>
					<div class="player-name-right-tournament">${match.player2}</div>
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

// Usage:
const visualizer = new TournamentVisualizer(pongTournament);
//visualizer.render();

