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

// Add graph to graphs-container
document.addEventListener('DOMContentLoaded', function() {
    const graphsContainer = document.getElementById('graphs-container');
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    
    function hideAllGraphs() {
        console.log("hideAllGraphs");
        console.log(graphsContainer.childNodes);
        graphsContainer.childNodes.forEach(node => {
            // if is canva element hide
            if (node.nodeName === 'CANVAS') {
                node.style.display = 'none';
            }
        });
    }

    function showSelectedGraph(graphId) {
        const graph = document.getElementById(graphId);
        graph.style.display = 'block';
    }

    radioButtons.forEach(button => {
        button.addEventListener('change', function() {
            hideAllGraphs();
            showSelectedGraph(button.value);
        });
    });

    
    const graph1 = getPlotGraph([[1, 2, 3, 4, 5], [10, 3, 5, 9, 8]], 'Last 5 games', 'Points Scored', 400, 400, false, true, 'integer', 'integer');
    graph1.id = 'graph1';
    graphsContainer.appendChild(graph1);
    
    const graph2 = getPlotGraph([[1, 2, 3, 4, 5], [10, 13, 18, 22, 30]], 'Last 5 games', 'Rallies', 400, 400, false, true, 'integer', 'integer');
    graph2.id = 'graph2';
    graphsContainer.appendChild(graph2);
    
    const graph3 = getPlotGraph([[1, 2, 3, 4, 5], [10, 3, 5, 9, 8]], 'Last 5 games', 'Points Allowed', 400, 400, false, true, 'integer', 'integer');
    graph3.id = 'graph3';
    graphsContainer.appendChild(graph3);
    
    const graph4 = getPlotGraph([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], [10, 13, 18, 22, 30, 33, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105]], 'Last 20 games', 'Total Points', 400, 400, true, true, 'integer', 'integer');
    graph4.id = 'graph4';
    graphsContainer.appendChild(graph4);
    
    const graph5 = getPlotGraph([[1, 2, 3, 4, 5], [10, 13, 18, 22, 30]], 'Last 5 games', 'Game Duration (minutes)', 400, 400, false, true, 'integer', 'integer');
    graph5.id = 'graph5';
    graphsContainer.appendChild(graph5);
    
    const graph6 = getPlotGraph([[1, 2, 3, 4, 5], [10, 13, 5, 15, 20]], 'Last 5 games', 'Average Rallies per Point', 400, 400, false, true, 'integer', 'integer');
    graph6.id = 'graph6';
    graphsContainer.appendChild(graph6);

    hideAllGraphs();
    // show first graph
    showSelectedGraph('graph1');
});
