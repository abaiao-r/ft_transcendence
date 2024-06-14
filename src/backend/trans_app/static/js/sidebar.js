// 
document.addEventListener('DOMContentLoaded', function() {
    // Retrieve wins and losses values from local storage
    const wins = localStorage.getItem('wins') || 0;
    const losses = localStorage.getItem('losses') || 0;

    // Call updateStats with the retrieved values
    updateStats(wins, losses);
});

function updateStats(wins, losses) {
    document.getElementById('wins-sidebar').textContent = wins;
    document.getElementById('losses-sidebar').textContent = losses;
}

