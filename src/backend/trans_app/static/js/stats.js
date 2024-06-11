// Select the node that will be observed for mutations
const targetNode1 = document.getElementById('pong');
const targetNode2 = document.getElementById('double-pong');

// Options for the observer (which mutations to observe)
const config = { attributes: true, attributeFilter: ['style'] };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
            console.log('Current display: ', window.getComputedStyle(this).display);
            if (window.getComputedStyle(this).display === 'none') {
                var data = localStorage.getItem('gameData');
                if (data) {
                    // Parse the JSON string to an object
                    var jsonData = JSON.parse(data);
                    console.log('here is the data: ', jsonData);
                    // Define the URL of your API
                    const url = 'match-history/'; // Replace with your actual API URL

                    // Send a POST request to the API
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            // Include your JWT token in the 'Authorization' header
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Replace 'yourToken' with the actual token
                        },
                        body: JSON.stringify(jsonData),
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        const userStatsUrl = 'player-stats/';
                        return fetch(userStatsUrl, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                // Include your JWT token in the 'Authorization' header
                                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Replace 'yourToken' with the actual token
                                },
                            });
                        })
                        .then(response => response.json())
                        .then(userStats => {
                            console.log("User Stats:" + userStats);
                            updateStats(userStats.wins, userStats.losses)
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                    });
                } else {
                    console.log('gameData not found');
                }
            }
        }
    }
};

// Create an observer instance linked to the callback function
const observer1 = new MutationObserver(callback.bind(targetNode1));
const observer2 = new MutationObserver(callback.bind(targetNode2));

// Start observing the target node for configured mutations
observer1.observe(targetNode1, config);
observer2.observe(targetNode2, config);