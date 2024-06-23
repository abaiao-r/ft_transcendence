function fetchPlayerStats() {
    const url = '/player-stats/';
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        
        if (!data.error) {
            updateStats(data.wins, data.losses);
        } else {
            console.error("Server Error:", data.error);
        }
    })
    .catch((error) => {
        console.error('Fetch Error:', error);
    });
}

async function updateLoginSideBar() {
    const response = await getMyPlayerStats();
    if (response.error) {
        console.error(response.error);
        return;
    }
    const playerStatsData = response.data;
    updateStats(playerStatsData.wins, playerStatsData.losses);
}

//document.addEventListener('DOMContentLoaded', handleDocumentLoaded);


function updateStats(wins, losses) {
    document.getElementById('wins-sidebar').textContent = wins;
    document.getElementById('losses-sidebar').textContent = losses;
}

