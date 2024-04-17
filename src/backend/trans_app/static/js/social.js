// Fetch friends
async function fetchFriends() {
    try {
        const response = await fetch('/list_friends/', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                'X-CSRFToken': '{{ csrf_token }}',
            },
            body: JSON.stringify(),
        });

        if (!response.ok) {
            const errorDetail = await response.json();
            return { error: true, message: `Failed to fetch friends: ${errorDetail.error}` };
        }

        const friendsData = await response.json();
        console.log("Friends data: ", friendsData);
        return { error: false, data: friendsData };
    } catch (error) {
        return { error: true, message: 'Network or other error' };
    }
}

// Add friends to social page
async function addFriendsToPage() {
    const friendsContainer = document.getElementById('list-friends');
    friendsContainer.innerHTML = ''; // Clear the existing friends

    const response = await fetchFriends();

    if (response.error) {
        console.log(response.message);
        return;
    }

    friends = response.data;

    console.log("Friends: ", friends);


    Object.entries(friends).forEach(([friendId, friendData]) => {
        // Create friend element
        const friendElement = document.createElement('li');
        friendElement.className = 'list-group-item d-flex justify-content-between align-items-center';

        // Create inner HTML for friend element
        friendElement.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${friendData['profile-image']}" alt="Friend's Profile Picture" class="rounded-circle mr-3" style="width: 50px; height: 50px;">
                <span class="friend-name ml-2">${friendData['username']}</span>
                <span class="badge badge-success ml-2 text-dark">${friendData['is-online'] ? 'Online' : 'Offline'}</span>
            </div>
            <div>
                <button class="btn btn-primary mr-2" type="button" style="width: 115px;">View Profile</button>
<button class="btn btn-danger" type="button" onclick="removeFriend(this)" style="width: 115px;">Remove</button>
            </div>
        `;

        // Append friend element to container
        friendsContainer.appendChild(friendElement);
    });
}

async function addFriendFetch(friendUsername) {
    try {
        const response = await fetch('/add_friend/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                'X-CSRFToken': '{{ csrf_token }}',
            },
            body: JSON.stringify({ friend_username: friendUsername }),
        });

        if (!response.ok) {
            const errorDetail = await response.json();
            return { error: true, message: `Failed to add friend: ${errorDetail.error}` };
        }

        const responseData = await response.json();
        return { error: false, data: responseData };

    } catch (error) {
        return { error: true, message: 'Network or other error' };
    }
}

// Remove friend fetch
async function removeFriendFetch(username) {
    try {
        const response = await fetch('/remove_friend/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                'X-CSRFToken': '{{ csrf_token }}',
            },
            body: JSON.stringify({ friend_username: username }),
        });

        if (!response.ok) {
            const errorDetail = await response.json();
            return { error: true, message: `Failed to remove friend: ${errorDetail.error}` };
        }

        const responseData = await response.json();
        return { error: false, data: responseData };

    } catch (error) {
        return { error: true, message: 'Network or other error' };
    }
}

async function removeFriend(button) {
    console.log('Remove button clicked');
    const listItem = button.closest('.list-group-item');
    console.log('List item: ', listItem);
    const usernameElement = listItem.querySelector('.friend-name');
    console.log('Username element: ', usernameElement);
    const friendUsername = usernameElement.textContent.trim();
    const response = await removeFriendFetch(friendUsername);

    if (response.error) {
        console.log(response.message);
        alert(response.message);
        return;
    }

    console.log("Friend removed successfully");
    window.location.reload();
}

// Get current friend usernames
function getCurrentFriendUsernames() {
    const friendItems = document.querySelectorAll('#list-friends .friend-name'); // Assuming friend names are stored within elements with the class 'friend-name' inside the 'list-friends' element
    const friendUsernames = new Set();
    friendItems.forEach(item => friendUsernames.add(item.textContent.trim()));
    return friendUsernames;
}

// Add friend
async function addFriend(username) {
    const response = await fetch('/add_friend/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'X-CSRFToken': '{{ csrf_token }}',
        },
        body: JSON.stringify({ friend_username: username }),
    });

    if (!response.ok) {
        console.error('Failed to add friend');
        return;
    }

    alert('Friend added successfully');
    window.location.reload(); // Refresh the page or update the UI accordingly
}


// Add listener to Social button
document.addEventListener('DOMContentLoaded', function() {
    const socialButton = document.getElementById('social-button');

    socialButton.addEventListener('click', function(event) {
        hidePlayMenu();
        event.preventDefault();
        window.location.href = SOCIAL_HREF;
    });
});

// Search users based on query
async function search_users_fetch(query) {
    try {
        const response = await fetch('/search-users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                'X-CSRFToken': '{{ csrf_token }}',
            },
            body: JSON.stringify({ query: query }),
        });

        if (!response.ok) {
            const errorDetail = await response.json();
            return { error: true, message: `Failed to search users: ${errorDetail.error}` };
        }

        const responseData = await response.json();

        return { error: false, data: responseData };
    }
    catch (error) {
        return { error: true, message: 'Network or other error' };
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('user-search-bar');
    let timeout = null;

    searchBar.addEventListener('input', function() {
        clearTimeout(timeout);
        if (searchBar.value.trim() === '') {
            document.getElementById('search-results').style.display = 'none';  // Hide the dropdown if search bar is cleared
        } else {
            timeout = setTimeout(() => {
                performSearch(searchBar.value);
            }, 500); // Wait for 2 seconds after typing stops
        }
    });

    searchBar.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            clearTimeout(timeout);
            performSearch(searchBar.value);
        }
    });

    // Hide dropdown if user clicks outside the search bar
    document.body.addEventListener('click', function(event) {
        if (!searchBar.contains(event.target)) {
            document.getElementById('search-results').style.display = 'none';
        }
    });

    async function performSearch(query) {
        if (query.trim() === '') {
            document.getElementById('search-results').classList.remove('show');
            return;
        }

        try {
            const response = await search_users_fetch(query);
            const users = response.data;
            displayResults(users);
        } catch (error) {
            console.error('Search failed:', error);
        }
    }

    function displayResults(users) {
        const resultsContainer = document.getElementById('search-results');
        const currentFriends = getCurrentFriendUsernames(); // Get the set of current friends
        resultsContainer.innerHTML = '';  // Clear previous results
    
        const usersArray = Object.values(users);

        if (usersArray.length > 0) {
            usersArray.forEach(user => {
                const userElement = document.createElement('button');
                userElement.className = 'dropdown-item';
                userElement.innerHTML = `${user.username}
                    <button class="btn btn-primary mr-2" style="width: 115px;">View Profile</button>`;
                
                // Only add 'Add Friend' button if not already friends
                if (!currentFriends.has(user.username)) {
                    const addButton = document.createElement('button');
                    addButton.className = 'btn btn-success';
                    addButton.style.width = '115px';
                    addButton.textContent = 'Add Friend';
                    addButton.onclick = function() { addFriend(user.username); };
                    userElement.appendChild(addButton);
                }
    
                resultsContainer.appendChild(userElement);
            });
            resultsContainer.classList.add('show');
            resultsContainer.style.display = 'block';
        } else {
            resultsContainer.classList.remove('show');
            resultsContainer.style.display = 'none';
        }
    }
});
