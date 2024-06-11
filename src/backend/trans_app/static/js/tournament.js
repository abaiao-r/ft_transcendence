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
        this.currentRound = [];
        this.nextRound = [];
        this.allMatches = []; // Store all matches from all rounds
        this.roundNumber = 1;
    }

    setPlayers(players) {
        this.players = players.slice(0, 16); // Take up to 16 players
    }

    startTournament() {
        if (!this.players) {
            console.log("No players found");
            return;
        }

        this.setupRound(this.players);
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

    setupRound(players) {
        if (players.length < 2) {
            console.log("Not enough players for a match");
            return;
        }

        this.currentRound = [];
        for (let i = 0; i < players.length; i += 2) {
            this.currentRound.push({
				player1: players[i], player2: players[i+1], score1: 0, score2: 0, winner: null
            });
        }
        this.allMatches.push([...this.currentRound]); // Add current round matches to all matches
    }

    updateMatch(player1, score1, player2, score2) {
        const match = this.currentRound.find(match => 
            (match.player1 === player1 && match.player2 === player2) ||
            (match.player1 === player2 && match.player2 === player1)
        );

        if (match) {
            match.score1 = score1;
            match.score2 = score2;
            match.winner = score1 > score2 ? player1 : player2;
            this.nextRound.push(match.winner);
        }
    }

    advanceToNextRound() {
        if (!this.isRoundComplete()) {
			console.log("Round is not complete yet");
            return;
			}
        if (this.nextRound.length === 1) {
            console.log("Tournament Winner:", this.nextRound[0]);
            return;
			}

			this.setupRound(this.nextRound);
			this.nextRound = [];
			this.roundNumber++;
			}

	isRoundComplete() {
        return this.currentRound.every(match => match.winner !== null);
    }

    getNextMatch() {
        const nextMatch = this.currentRound.find(match => match.winner === null);
        if (nextMatch) {
            return { player1: nextMatch.player1, player2: nextMatch.player2 };
        }
        return null; // Returns null if all matches are complete
    }

    simulateNextMatch() {
        const nextMatch = this.getNextMatch();
        if (nextMatch) {
            // Generate random scores for each player
            const score1 = Math.floor(Math.random() * 10); // Random score from 0 to 9
            const score2 = Math.floor(Math.random() * 10); // Random score from 0 to 9
            this.updateMatch(nextMatch.player1, score1, nextMatch.player2, score2);

            console.log(`Match simulated: ${nextMatch.player1} (${score1}) vs ${nextMatch.player2} (${score2}) - Winner: ${score1 > score2 ? nextMatch.player1 : nextMatch.player2}`);
            // return match result
            return { player1: nextMatch.player1, score1, player2: nextMatch.player2, score2, winner: score1 > score2 ? nextMatch.player1 : nextMatch.player2 };
        } else {
            console.log("No matches available to simulate");
            return null;
        }
    }

    getTournamentWinner() {
        if (this.nextRound.length === 1) {
            return this.nextRound[0];
        }
        return null;
    }

    static fromJSON(json) {
        const tournament = new Tournament();
        tournament.players = json.players;
        tournament.currentRound = json.currentRound;
        tournament.nextRound = json.nextRound;
        tournament.allMatches = json.allMatches;
        tournament.roundNumber = json.roundNumber;
        return tournament;
    }

    string() {
        let result = '';
		console.log(this.allMatches);
        this.allMatches.forEach((round, index) => {
            result += `Round ${index + 1}:\n` + round.map(match =>
                `${match.player1} (${match.score1}) vs ${match.player2} (${match.score2}) - Winner: ${match.winner || "TBD"}`
				).join('\n') + '\n';
        });
        return result;
	}
}

// Example players
//const players = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "George", "Hannah", "Ivy", "Jack", "Karl", "Liam", "Mia", "Noah", "Olivia", "Peter"];

const players = ['pedgonca', 'AI 1', 'AI 2', 'AI 3']

// Initialize the tournament
const pongTournament = new Tournament();
pongTournament.setPlayers(players);
pongTournament.startTournament();
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

		let numberOfRounds = Math.ceil(Math.log2(this.tournament.players.length));
        let totalMatches = Math.pow(2, numberOfRounds - 1);
		
        // Generate match elements for each round
        this.container.innerHTML = '';
        for (let i = 0; i < numberOfRounds; i++) {
            const roundDiv = document.createElement('div');
            roundDiv.className = 'round match-container';
            
            roundDiv.innerHTML = `<h3>${this.getRoundName(i + 1, numberOfRounds)}</h3>`;
            this.container.appendChild(roundDiv);

            for (let j = 0; j < totalMatches; j++) {
				let matchInfo = null;
				// If match exists, get the match info
				if (i < this.tournament.allMatches.length && j < this.tournament.allMatches[i].length) {
					matchInfo = this.tournament.allMatches[i][j];
				}

                const matchDiv = this.generateMatchElement(matchInfo);
                roundDiv.appendChild(matchDiv);
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
			const playerScore1 = match.score1 != 0 ? `${match.score1}` : '';
			const playerScore2 = match.score2 != 0 ? `${match.score2}` : '';

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

