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
