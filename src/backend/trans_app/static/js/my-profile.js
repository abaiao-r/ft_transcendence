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

// Sample match history data
const matchHistoryData = [
    {
        result: "win",
        type: "Singles",
        date: "2024-04-17",
        opponents: [{ name: "John", score: 5 }]
    },
    {
        result: "loss",
        type: "Doubles",
        date: "2024-04-16",
        opponents: [{ name: "Alice", score: 7 }, { name: "Bob", score: 10 }]
    }
    // Add more match history data as needed
];

// Function to format date to 'a day ago' format
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

// Function to generate match history list items
function generateMatchHistoryItems() {
    console.log("Generating match history items");
    const matchHistoryElement = document.getElementById("match-history");//
    matchHistoryData.forEach(match => {
        const li = document.createElement("li");
        li.className = `list-group-item ${match.result === 'win' ? 'list-group-item-success' : 'list-group-item-danger'}`;
        li.innerHTML = `
            <div class="d-flex justify-content-between">
                <div>
                    <h5 class="mb-1">${match.result.toUpperCase()}</h5>
                    <p class="mb-1">${match.type}</p>
                    <small>${formatDate(match.date)}</small>
                </div>
                <div>
                    <h5>Opponents</h5>
                    ${match.opponents.map(opponent => `<p>${opponent.name}: ${opponent.score}</p>`).join('')}
                </div>
            </div>
        `;
        console.log(li);
        matchHistoryElement.appendChild(li);
    });
}

// Call the function to generate match history items
generateMatchHistoryItems();

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
function fetchUserProfile() {
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
}

// Call the fetchUserProfile function when the profile section is displayed
document.addEventListener('DOMContentLoaded', fetchUserProfile);

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
}

// add event listener to the stats button
document.addEventListener('DOMContentLoaded', function() {
	const statsButton = document.querySelector('#stats-button');
	const statsSection = document.querySelector('#stats');

	statsButton.addEventListener('click', function(event) {
		event.preventDefault();
		window.location.href = STATS_HREF;
	});
});

// Fetch all users data from the backend
function fetchAllUsers() {
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
}

// Function to view profile of a user
function viewProfile(username) {
    // Implement logic to navigate to the profile page of the specified user
}

// Call the fetchAllUsers function when the profile section is displayed
document.addEventListener('DOMContentLoaded', fetchAllUsers);


