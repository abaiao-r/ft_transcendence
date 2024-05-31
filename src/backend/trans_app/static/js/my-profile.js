document.addEventListener('DOMContentLoaded', (event) => {
    fetch('/getuser/')
    .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);  // Log the received data
      const playerName = data.username;  // Access the username property
      document.getElementById('player-name').innerText = playerName;
    })
    .catch(error => console.error('Error:', error));
});

// add all graphs to graph container:
document.addEventListener('DOMContentLoaded', function() {
    const graphsContainer = document.getElementById('graphs-container');

    const width = 300;
    const height = 250;

    const graph1 = getPlotGraph([[1, 2, 3, 4, 5], [10, 3, 5, 9, 8]], 'Last 5 games', 'Points Scored', width, height, false, true, 'integer', 'integer');
    graph1.id = 'graph1';
    graphsContainer.appendChild(graph1);
    
    const graph2 = getPlotGraph([[1, 2, 3, 4, 5], [10, 13, 18, 22, 30]], 'Last 5 games', 'Rallies', width, height, false, true, 'integer', 'integer');
    graph2.id = 'graph2';
    graphsContainer.appendChild(graph2);
    
    const graph5 = getPlotGraph([[1, 2, 3, 4, 5], [10, 13, 18, 22, 30]], 'Last 5 games', 'Game Duration (min)', width, height, false, true, 'integer', 'integer');
    graph5.id = 'graph5';
    graphsContainer.appendChild(graph5);
    
    const graph6 = getPlotGraph([[1, 2, 3, 4, 5], [10, 13, 5, 15, 20]], 'Last 5 games', 'Average Rallies per Point', width, height, false, true, 'integer', 'integer');
    graph6.id = 'graph6';
    graphsContainer.appendChild(graph6);
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
    const matchHistory = [
        { date: "2024-04-19", game: "1v1 AI", scores: [{name: "Quackson", score: 10}, {name: "Mario", score: 5}], result: "Win", matchDuration: "10" },
        { date: "2024-04-18", game: "1v1 Player", scores: [{name: "Quackson", score: 10}, {name: "Mario", score: 5}], result: "Loss", matchDuration: "15"},
        { date: "2024-04-17", game: "Double Pong", scores: [{name: "Quackson", score: 10}, {name: "Mario", score: 5}, {name: "Johnny", score: 3}, {name: "Crack", score: 2}], result: "Win", matchDuration: "20"},
        { date: "2024-04-16", game: "Tournament", scores: [{name: "Quackson", score: 10}, {name: "Mario", score: 5}], result: "Win", matchDuration: "30"},
        { date: "2024-04-15", game: "Tournament", scores: [{name: "Quackson", score: 10}, {name: "Mario", score: 5}], result: "Win", matchDuration: "30"},
        { date: "2024-04-14", game: "Tournament", scores: [{name: "Quackson", score: 10}, {name: "Mario", score: 5}], result: "Win", matchDuration: "30"},
        { date: "2024-04-13", game: "Tournament", scores: [{name: "Quackson", score: 10}, {name: "Mario", score: 5}], result: "Win", matchDuration: "30"},
        { date: "2024-04-12", game: "Tournament", scores: [{name: "Quackson", score: 10}, {name: "Mario", score: 5}], result: "Win", matchDuration: "30"},
        { date: "2024-04-11", game: "Tournament", scores: [{name: "Quackson", score: 10}, {name: "Mario", score: 5}], result: "Win", matchDuration: "30"},
        { date: "2024-04-10", game: "Tournament", scores: [{name: "Quackson", score: 10}, {name: "Mario", score: 5}], result: "Win", matchDuration: "30"},
        { date: "2024-04-09", game: "Tournament", scores: [{name: "Quackson", score: 10}, {name: "Mario", score: 5}], result: "Win", matchDuration: "30"},
        { date: "2024-04-08", game: "Tournament", scores: [{name: "Quackson", score: 10}, {name: "Mario", score: 5}], result: "Win", matchDuration: "30"},
        { date: "2024-04-07", game: "Tournament", scores: [{name: "Quackson", score: 10}, {name: "Mario", score: 5}], result: "Win", matchDuration: "30"},
        { date: "2024-04-06", game: "Tournament", scores: [{name: "Quackson", score: 10}, {name: "Mario", score: 5}], result: "Win", matchDuration: "30"},
        { date: "2024-04-05", game: "Tournament", scores: [{name: "Quackson", score: 10}, {name: "Mario", score: 5}], result: "Win", matchDuration: "30"},
        { date: "2024-03-04", game: "Tournament", scores: [{name: "Quackson", score: 10}, {name: "Mario", score: 5}], result: "Win", matchDuration: "30"},
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

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
                            <p class="card-text">${match.matchDuration} min</p>
                        </div>
                    </div>
                    <div class="card-text-right">
                        <p class="card-text">${scoreDisplay}</p>
                    </div>
                </div>
        `;
        historyContainer.appendChild(matchElement);

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
    });
});

// Fetch user profile data from the backend
/* function fetchUserProfile() {
    // Make a request to your backend API to fetch user data
    // Replace this with your actual API endpoint
    fetch('/api/user/profile')
        .then(response => response.json())
        .then(data => {
            // Update the profile section with fetched data
            document.getElementById('username').textContent = data.username;
            document.getElementById('win-loss').textContent = data.winLoss;
            document.getElementById('win-percentage').textContent = data.winPercentage;
            document.getElementById('games-played').textContent = data.gamesPlayed;
            document.getElementById('win-loss-difference').textContent = data.winLossDifference;
            document.getElementById('leaderboard-position').textContent = data.leaderboardPosition;

            // Update match history
            const matchHistory = document.getElementById('match-history');
            matchHistory.innerHTML = ''; // Clear previous entries
            data.matchHistory.forEach(match => {
                const listItem = document.createElement('li');
                listItem.textContent = `vs ${match.opponent} - ${match.result}`;
                matchHistory.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching user profile:', error);
        });
} */

// Call the fetchUserProfile function when the profile section is displayed
/* document.addEventListener('DOMContentLoaded', fetchUserProfile);

 async function getUserStats() {

	const response = await fetch('/getuser/',
	{
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': '{{ csrf_token }}',
			'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
		},
	});
	const data = await response.json();
	if (data.error) {
		alert(data.error);
		return null;
	} else {
		return data;
	}
} */

// Fetch all users data from the backend
/* function fetchAllUsers() {
    // Make a request to your backend API to fetch all users data
    // Replace this with your actual API endpoint
    fetch('/api/all-users')
        .then(response => response.json())
        .then(data => {
            // Update the all users table with fetched data
            const allUsersBody = document.getElementById('all-users-body');
            allUsersBody.innerHTML = ''; // Clear previous entries
            data.forEach((user, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${user.username}</td>
                    <td>${user.wins}</td>
                    <td>${user.loss}</td>
                    <td>${user.difference}</td>
                    <td>${user.winPercentage}%</td>
                    <td>${user.gamesPlayed}</td>
                    <td><button onclick="viewProfile('${user.username}')">View Profile</button></td>
                `;
                allUsersBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching all users:', error);
        });
} */

// Function to view profile of a user
/* function viewProfile(username) {
    // Implement logic to navigate to the profile page of the specified user
} */

// Call the fetchAllUsers function when the profile section is displayed
//document.addEventListener('DOMContentLoaded', fetchAllUsers);


