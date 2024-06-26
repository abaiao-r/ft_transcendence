function clearPlayerProfile() {
    // Clear player card
    document.getElementById('profile-pic-stats').src = '';
    document.getElementById('player-name').innerHTML = '';
    document.getElementById('player-card-rank').innerHTML = '';
    document.getElementById('player-card-form').innerHTML = '';

    // Clear all-time stats
    document.getElementById('wins').innerHTML = '';
    document.getElementById('losses').innerHTML = '';
    document.getElementById('points-scored').innerHTML = '';
    document.getElementById('cups-won').innerHTML = '';
    document.getElementById('games-played').innerHTML = '';
    document.getElementById('rallies').innerHTML = '';
    document.getElementById('time-played').innerHTML = '';

    // Clear graphs container
    document.getElementById('graphs-container').innerHTML = '';

    // Clear match history
    document.getElementById('matchHistory').innerHTML = '';
}

function getOrdinalSuffix(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

// Converts a date string to a relative time string
function timeAgo(dateParam) {
    const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
    const now = new Date();
    const diffInSeconds = Math.round((now - date) / 1000);
    const minutes = Math.round(diffInSeconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} second(s) ago`;
    } else if (minutes < 60) {
        return `${minutes} minute(s) ago`;
    } else if (hours < 24) {
        return `${hours} hour(s) ago`;
    } else if (days < 30) {
        return `${days} day(s) ago`;
    } else {
        return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    }
}

async function showPlayerProfile(username = null) {
    clearPlayerProfile();

    // if null get current user
    if (username === null) {
        const response = await getCurrentUser();
        if (response.error) {
            console.error(response.message);
            return;
        }
        username = response.data.username;
    }

    /// Update user profile image UI
    let response = await searchUsers(username);
    if (response.error) {
        console.error(response.message);
        return;
    }
    const userData = response.data;
    updateProfileImageUI(userData.username, userData.profile_image);

    // Update player stats UI
    response = await getPlayerStats(userData.username);
    if (response.error) {
        return;
    }
    const playerStatsData = response.data;
    updatePlayerStatsUI(playerStatsData);

    // Update graphs UI
    response = await getMatchHistory(userData.username);
    if (response.error) {
        return;
    }
    const matchHistoryData = response.data;
    updateGraphsUI(matchHistoryData);

    // Update match history UI
    updateMatchHistoryUI(matchHistoryData);
}


// add event listener to the my-profile button
document.addEventListener('DOMContentLoaded', function() {
    const myProfileButton = document.getElementById('my-profile-button');

    myProfileButton.addEventListener('click', async function(event) {
        event.preventDefault();
        navigateToHash(PROFILE_HREF);
    });
});

// function that takes seconds. if its more than 60 seconds, it converts it to minutes and so on
function convertTime(time) {
    if (time < 60) {
        return time + " sec";
    } else if (time < 3600) {
        return Math.floor(time / 60) + " min";
    } else {
        return Math.floor(time / 3600) + " h";
    }
}

function updateMatchHistoryUI(data) {
        // Check if data is an array
        if (!Array.isArray(data)) {
            throw new Error('Data is not an array');
        }

        // Construct the matchHistory array
        const matchHistory = data.map(match => {
            return {
                date: match.match_date,
                game: match.match_type,
                scores: [
                    { name: match.player1, score: match.player1_stats.points_scored, rallies: match.player1_stats.rallies, rallies_per_point: match.player1_stats.rallies_per_point },
                    { name: match.player2, score: match.player2_stats.points_scored, rallies: match.player2_stats.rallies, rallies_per_point: match.player2_stats.rallies_per_point },
                    { name: match.player3, score: match.player3_stats.points_scored, rallies: match.player3_stats.rallies, rallies_per_point: match.player3_stats.rallies_per_point },
                    { name: match.player4, score: match.player4_stats.points_scored, rallies: match.player4_stats.rallies, rallies_per_point: match.player4_stats.rallies_per_point }
                ].filter(player => player.name !== ""), // Remove players with empty names
                result: match.winner === match.player1 ? "Win" : "Loss", // Set result to "Win" if player1 is the winner
                matchDuration: match.match_duration.toString() // Convert match duration to string
            };
        }).sort((a, b) => new Date(b.date) - new Date(a.date));


        const historyContainer = document.getElementById('matchHistory');
        
        // Adding a console log to ensure historyContainer is not null
        if (!historyContainer) {
            console.error('historyContainer element is not found');
            return;
        }

        matchHistory.forEach(match => {
             // Log each match being processed

            const cardClass = match.result === "Win" ? 'card-win' : 'card-loss';
            const gameColor = match.result === "Win" ? 'text-success' : 'text-danger';

            let scoreDisplay = '<div class="score-container">';
            let highestScore = Math.max(...match.scores.map(player => player.score)); // Find highest score
            match.scores.forEach((player, index) => {
                let winnerSymbol = player.score === highestScore ? ' 🏆' : ''; // Append symbol if this player has the highest score
                scoreDisplay += `<div class="score-col"><span class="score-name">${winnerSymbol}${player.name}</span> <span class="score-value">${player.score}</span></div>`;
            });
            scoreDisplay += '</div>';

            // Create a new card element
            const matchElement = document.createElement('div');
            matchElement.className = `card ${cardClass}`;
            matchElement.innerHTML = `
                <div class="card-body d-flex flex-column justify-content-between" style="display: block;">
                    <div class="card-body-top">
                        <div class="card-body-top-info">
                            <p class="card-text ${gameColor}"><strong>${match.game}</strong></p>
                            <p class="card-text">${timeAgo(match.date)}</p>
                        </div>
                        <div class="card-body-top-info">
                            <p class="card-text"><strong>${match.result}</strong></p>
                            <p class="card-text">${convertTime(Math.round(match.matchDuration))}</p>
                        </div>
                    </div>
                    <div class="card-text-right">
                        <p class="card-text">${scoreDisplay}</p>
                    </div>
                </div>
                <div class="card-stats" style="display: none;">
                    <p class="card-text">Rallies: ${match.scores[0].rallies}</p>
                    <p class="card-text">Average Rallies per Point: ${(Math.round(match.scores[0].rallies_per_point * 100) / 100).toFixed(2)}</p>
                </div>
            `;
            historyContainer.appendChild(matchElement);

            // Add click event listener to toggle visibility of card content and stats
            matchElement.addEventListener('click', function() {
                const cardBody = this.querySelector('.card-body');
                const cardStats = this.querySelector('.card-stats');

                if (cardBody.style.display === 'block') {
                    cardBody.style.setProperty('display', 'none', 'important');
                    cardStats.style.setProperty('display', 'block', 'important');
                } else {
                    cardBody.style.setProperty('display', 'block', 'important');
                    cardStats.style.setProperty('display', 'none', 'important');
                }
            });
        });
}

function updateGraphsUI(data) {
    const graphsContainer = document.getElementById('graphs-container');
    const width = 350;
    const height = 250;
    const n = data.length;

    const graph1 = getPlotGraph([[1, 2, 3, 4, 5], [data[n - 5] ? data[n - 5]['player1_stats']['points_scored'] : 0,
    data[n - 4] ? data[n - 4]['player1_stats']['points_scored'] : 0,
    data[n - 3] ? data[n - 3]['player1_stats']['points_scored'] : 0,
    data[n - 2] ? data[n - 2]['player1_stats']['points_scored'] : 0,
    data[n - 1] ? data[n - 1]['player1_stats']['points_scored'] : 0]], 'Last 5 games', 'Points Scored', width, height, false, true, 'integer', 'integer');
    graph1.id = 'graph1';
    graphsContainer.appendChild(graph1);

    const graph2 = getPlotGraph([[1, 2, 3, 4, 5], [data[n - 5] ? data[n - 5]['player1_stats']['rallies'] : 0,
    data[n - 4] ? data[n - 4]['player1_stats']['rallies'] : 0,
    data[n - 3] ? data[n - 3]['player1_stats']['rallies'] : 0,
    data[n - 2] ? data[n - 2]['player1_stats']['rallies'] : 0,
    data[n - 1] ? data[n - 1]['player1_stats']['rallies'] : 0]], 'Last 5 games', 'Rallies', width, height, false, true, 'integer', 'integer');
    graph2.id = 'graph2';
    graphsContainer.appendChild(graph2);

    const graph5 = getPlotGraph([[1, 2, 3, 4, 5], [data[n - 5] ? (data[n - 5]['match_duration'] / 60) : 0,
    data[n - 4] ? (data[n - 4]['match_duration'] / 60) : 0,
    data[n - 3] ? (data[n - 3]['match_duration'] / 60) : 0,
    data[n - 2] ? (data[n - 2]['match_duration'] / 60) : 0,
    data[n - 1] ? (data[n - 1]['match_duration'] / 60) : 0]], 'Last 5 games', 'Game Duration (min)', width, height, false, true, 'integer', 'float');
    graph5.id = 'graph5';
    graphsContainer.appendChild(graph5);

    const graph6 = getPlotGraph([[1, 2, 3, 4, 5], [data[n - 5] ? data[n - 5]['player1_stats']['rallies'] / (data[n - 5]['player1_stats']['points_scored'] + data[n - 5]['player1_stats']['points_conceded']) : 0,
    data[n - 4] ? data[n - 4]['player1_stats']['rallies'] / (data[n - 4]['player1_stats']['points_scored'] + data[n - 4]['player1_stats']['points_conceded']) : 0,
    data[n - 3] ? data[n - 3]['player1_stats']['rallies'] / (data[n - 3]['player1_stats']['points_scored'] + data[n - 3]['player1_stats']['points_conceded']) : 0,
    data[n - 2] ? data[n - 2]['player1_stats']['rallies'] / (data[n - 2]['player1_stats']['points_scored'] + data[n - 2]['player1_stats']['points_conceded']) : 0,
    data[n - 1] ? data[n - 1]['player1_stats']['rallies'] / (data[n - 1]['player1_stats']['points_scored'] + data[n - 1]['player1_stats']['points_conceded']) : 0]], 'Last 5 games', 'Average Rallies per Point', width, height, false, true, 'integer', 'float');
    graph6.id = 'graph6';
    graphsContainer.appendChild(graph6);

    const gameResults = data.slice(Math.max(0, data.length - 5))
        .map(game => {
            if (game.player1_stats.points_scored === 10) {
                return '<span class="win-form">W</span>';
            } else {
                return '<span class="loss-form">L</span>';
            }
        }).join(' ');

    document.getElementById('player-card-form').innerHTML = gameResults;
}

function updatePlayerStatsUI(data) {
    if (data.wins != null)
        document.getElementById('wins').innerText = data.wins;

    else
        document.getElementById('wins').innerText = 0;

    if (data.losses != null)
        document.getElementById('losses').innerText = data.losses;

    else
        document.getElementById('losses').innerText = 0;

    if (data.points_scored != null)
        document.getElementById('points-scored').innerText = data.points_scored;

    else
        document.getElementById('points-scored').innerText = 0;

    if (data.tournaments_won != null)
        document.getElementById('cups-won').innerText = data.tournaments_won;

    else
        document.getElementById('cups-won').innerText = 0;

    if (data.games_played != null)
        document.getElementById('games-played').innerText = data.games_played;

    else
        document.getElementById('games-played').innerText = 0;

    if (data.rallies != null)
        document.getElementById('rallies').innerText = data.rallies;

    else
        document.getElementById('rallies').innerText = 0;

    if (data.time_played != null)
        document.getElementById('time-played').innerText = Math.round(data.time_played / 60) + " Min";

    else
        document.getElementById('time-played').innerText = 0 + " Min";

    if (data.games_played === 0)
        document.getElementById('player-card-rank').innerText = '';
    else if (data.ranking != null)
        document.getElementById('player-card-rank').innerText = getOrdinalSuffix(data.ranking);

    else
        document.getElementById('player-card-rank').innerText = '';
}

function updateProfileImageUI(username, profile_image) {
    document.getElementById('player-name').innerText = username;
    const profile_image_placeholder = document.getElementById('profile-pic-stats');

    if (profile_image == null) {
        profile_image = '/static/images/profile_pic_icon.png';
    }
    profile_image_placeholder.setAttribute('src', profile_image);
}

