function fetchPlayerStats() {
    const url = 'player-stats/';
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
        console.log(data);
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

async function handleDocumentLoaded() {
    console.log('Document loaded');
    const accessToken = await refreshToken();
    // Check if the access token is null and if username is null
    if (!accessToken) {
        console.log('No access token');
        return;
    }
    fetchPlayerStats();
}

document.addEventListener('DOMContentLoaded', handleDocumentLoaded);


function updateStats(wins, losses) {
    document.getElementById('wins-sidebar').textContent = wins;
    document.getElementById('losses-sidebar').textContent = losses;
}

