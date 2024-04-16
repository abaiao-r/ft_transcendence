
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
