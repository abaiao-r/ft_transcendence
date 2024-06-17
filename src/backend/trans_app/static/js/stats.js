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
                    if (jsonData[0]['Game aborted'] == "Yes") {
                        console.log('Game was aborted');
                        return;
                    }
                    const url = 'match-history/';

                    // Send a POST request to the API
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
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
                                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                            },
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.text();
                        })
                        .then(data => {
                            try {
                                return JSON.parse(data);
                            } catch (err) {
                                console.error('The string is not a valid JSON string:', data);
                                throw err;
                            }
                        })
                        .then(userStats => {
                            console.log("User Stats:" + JSON.stringify(userStats));
                            if (!userStats.error) {
                                updateStats(userStats.wins, userStats.losses);
                            } else {
                                console.log("Error:", userStats.error);
                            }
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                    });
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