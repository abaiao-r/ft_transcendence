// add all graphs to graph container:
document.addEventListener('DOMContentLoaded', function() {
    const graphsContainer = document.getElementById('graphs-container');
    fetch(`/match-history?username=${getUserStats().username}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': '{{ csrf_token }}',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    .then(response => response.json())
    .then(data => {

        const width = 300;
        const height = 250;
        const n = data.length;

        const graph1 = getPlotGraph([[1, 2, 3, 4, 5], [data[n-5] ? data[n-5]['player1_stats']['points_scored'] : 0,
        data[n-4] ? data[n-4]['player1_stats']['points_scored'] : 0,
        data[n-3] ? data[n-3]['player1_stats']['points_scored'] : 0,
        data[n-2] ? data[n-2]['player1_stats']['points_scored'] : 0,
        data[n-1] ? data[n-1]['player1_stats']['points_scored'] : 0]], 'Last 5 games', 'Points Scored', width, height, false, true, 'integer', 'integer');
        graph1.id = 'graph1';
        graphsContainer.appendChild(graph1);
        
        const graph2 = getPlotGraph([[1, 2, 3, 4, 5], [data[n-5] ? data[n-5]['player1_stats']['rallies'] : 0,
        data[n-4] ? data[n-4]['player1_stats']['rallies'] : 0,
        data[n-3] ? data[n-3]['player1_stats']['rallies'] : 0,
        data[n-2] ? data[n-2]['player1_stats']['rallies'] : 0,
        data[n-1] ? data[n-1]['player1_stats']['rallies'] : 0]], 'Last 5 games', 'Rallies', width, height, false, true, 'integer', 'integer');
        graph2.id = 'graph2';
        graphsContainer.appendChild(graph2);
        
        const graph5 = getPlotGraph([[1, 2, 3, 4, 5], [data[n-5] ? data[n-5]['match_duration'] : 0,
        data[n-4] ? data[n-4]['match_duration'] : 0,
        data[n-3] ? data[n-3]['match_duration'] : 0,
        data[n-2] ? data[n-2]['match_duration'] : 0,
        data[n-1] ? data[n-1]['match_duration'] : 0]], 'Last 5 games', 'Game Duration (min)', width, height, false, true, 'integer', 'integer');
        graph5.id = 'graph5';
        graphsContainer.appendChild(graph5);
        
        const graph6 = getPlotGraph([[1, 2, 3, 4, 5], [data[n-5] ? data[n-5]['player1_stats']['rallies']/(data[n-1]['player1_stats']['points_scored'] + data[n-1]['player1_stats']['points_conceded']): 0,
        data[n-4] ? data[n-4]['player1_stats']['rallies']/(data[n-2]['player1_stats']['points_scored'] + data[n-2]['player1_stats']['points_conceded']): 0,
        data[n-3] ? data[n-3]['player1_stats']['rallies']/(data[n-3]['player1_stats']['points_scored'] + data[n-3]['player1_stats']['points_conceded']): 0,
        data[n-2] ? data[n-2]['player1_stats']['rallies']/(data[n-4]['player1_stats']['points_scored'] + data[n-4]['player1_stats']['points_conceded']): 0,
        data[n-1] ? data[n-1]['player1_stats']['rallies']/(data[n-5]['player1_stats']['points_scored'] + data[n-5]['player1_stats']['points_conceded']): 0]], 'Last 5 games', 'Average Rallies per Point', width, height, false, true, 'integer', 'float');
        graph6.id = 'graph6';
        graphsContainer.appendChild(graph6);

        const gameResults = data.slice(Math.max(0, data.length - 5))
        .map(game => game.player1_stats.points_scored === 10 ? 'W' : 'L')
        .join(' ');

        document.getElementById('player-card-form').innerText = gameResults;
    })
    .catch(error => console.error('Error:', error));
});

// Converts a date string to a relative time string
function timeAgo(dateParam) {
    const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
    const now = new Date();
    const diffInSeconds = Math.round((now - date) / 1000);
    const minutes = Math.round(diffInSeconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    } else if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else if (days < 30) {
        return `${days} days ago`;
    } else {
        return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    }
}


document.addEventListener('DOMContentLoaded', function() {
    fetch('match-history/', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': '{{ csrf_token }}',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)

        // Construct the matchHistory array
        const matchHistory = data.map(match => {
            return {
                date: match.match_date,
                game: match.match_type,
                scores: [
                    { name: match.player1, score: match.player1_stats.points_scored },
                    { name: match.player2, score: match.player2_stats.points_scored },
                    { name: match.player3, score: match.player3_stats.points_scored },
                    { name: match.player4, score: match.player4_stats.points_scored }
                ].filter(player => player.name !== ""), // Remove players with empty names
                result: match.winner === match.player1 ? "Win" : "Loss", // Set result to "Win" if player1 is the winner
                matchDuration: match.match_duration.toString() // Convert match duration to string
            };
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    

        const historyContainer = document.getElementById('matchHistory');
        matchHistory.forEach(match => {
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
                <div class="card-body d-flex flex-column justify-content-between">
                    <div class="card-body-top">
                        <div class="card-body-top-info">
                            <p class="card-text ${gameColor}"><strong>${match.game}</strong></p>
                            <p class="card-text">${timeAgo(match.date)}</p>
                        </div>
                        <div class="card-body-top-info">
                            <p class="card-text"><strong>${match.result}</strong></p>
                            <p class="card-text">${Math.ceil(match.matchDuration / 60)} min</p>
                        </div>
                    </div>
                    <div class="card-text-right">
                        <p class="card-text">${scoreDisplay}</p>
                    </div>
                </div>
        `;
        historyContainer.appendChild(matchElement);
        
    })
    .catch((error) => {
    console.error('Error:', error);
    });
    
        // Add click event listener to toggle visibility of card content
        matchElement.addEventListener('click', function() {
            this.querySelector('.card-body').classList.toggle('hidden');
        });
    });
});



// add event listener to the my-profile button
 document.addEventListener('DOMContentLoaded', function() {
	const myProfileButton = document.getElementById('my-profile-button');
    const myProfileSection = document.getElementById('my-profile');

    myProfileButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = MY_PROFILE_HREF;
        location.reload();
    });
});
