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
    const listItem = button.closest('.friend-item');
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

function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
}
  
  function hideToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('show');
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
    showToast();
    /* alert('Friend added successfully'); */
    // Delay the reload to allow the toast to be visible
    setTimeout(() => {
        window.location.reload(); // Refresh the page or update the UI accordingly
    }, 3000); // 3000 ms matches the duration of the toast visibility
}


// Add listener to Social button
document.addEventListener('DOMContentLoaded', function() {
    const socialButton = document.getElementById('social-button');

    socialButton.addEventListener('click', function(event) {
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
        if (typeof responseData !== 'object' || responseData === null || responseData === undefined) {
            return { error: true, message: 'Invalid data received from server' };
        }
        console.log('Search results:', responseData);

        return { error: false, data: responseData };
    }
    catch (error) {
        return { error: true, message: 'Network or other error' };
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('user-search-bar');
    const searchIcon = document.querySelector('.search-button');
    const friendsList = document.querySelector('.friends-list');
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

    searchIcon.addEventListener('click', function() {
        clearTimeout(timeout);
        performSearch(searchBar.value);
    });


    // Hide dropdown if user clicks outside friendsList
    document.addEventListener('click', function(event) {
        if (!friendsList.contains(event.target)) {
            document.getElementById('search-results').style.display = 'none';
            searchBar.value = '';
        }
    });

    async function performSearch(query) {
        if (query.trim() === '') {
            document.getElementById('search-results').classList.remove('show');
            return;
        }

        try {
            const response = await search_users_fetch(query);
/*             if (!response || !response.data) {
                console.error('No data received from search_users_fetch');
                return;
            } */
            const users = response.data;
            displayResults(users);
        } catch (error) {
            console.error('Search failed:', error);
        }
    }

    function displayResults(users) {
        const resultsContainer = document.getElementById('search-results');
        const currentFriends = getCurrentFriendUsernames(); // Get the set of current friends
        const currentUsername = document.getElementById('username-sidebar').textContent.trim();

        console.log('Current username:', currentUsername);

        resultsContainer.innerHTML = '';  // Clear previous results
    
        const usersArray = Object.values(users);
        console.log('Users array:', usersArray);
    
        if (usersArray.length > 0 ) {
            usersArray.forEach(user => {
                if (currentUsername === user.username) {
                    if (usersArray.length === 1) {
                        const noResults = document.createElement('div');
                        noResults.className = 'no-results';
                        noResults.textContent = 'No results found';
                        resultsContainer.appendChild(noResults);
                        resultsContainer.style.display = 'block';
                    
                    }
                    return;
                }

        const isFriend = currentFriends.has(user.username);
        console.log('Current friends:', currentFriends);

        

        // Create the button HTML based on whether the user is a friend
        const buttonHTML = isFriend ?
            `<button class="btn remove-friend-button">
                <img src="${staticUrl}images/remove-friend.png" alt="remove" class="add-friend">
            </button>` :
            `<button class="btn add-friend-button">
                <img src="${staticUrl}images/add-friend-icon.png" alt="add" class="add-friend">
            </button>`;

                const resultDiv = document.createElement('div');
                resultDiv.className = 'friend';
                resultDiv.innerHTML = `
                    <div class="photo-name">
                    <img src="${user.profile_image}" alt="profile-pic" class="profile-pic">
                    <p class="friend-name">${user.username}</p>
                    </div>
                    <div class="friend-buttons">

                        <button class="btn view-profile-button">
                            <img src="${staticUrl}images/view-profile.png" alt="view" class="view-profile">
                        </button>
                        <!-- add img as button <img src="/images/add.png" alt="add" class="add-friend"> -->
                        ${buttonHTML}
                    </div>
            `;
                resultsContainer.appendChild(resultDiv);

                // Add event listener to the add-friend-button
                // Add event listener to the button
                const button = isFriend ? resultDiv.querySelector('.remove-friend-button') : resultDiv.querySelector('.add-friend-button');
                button.onclick = isFriend ? function() { removeFriend(user.username); } : function() { addFriend(user.username); };
            });
            resultsContainer.style.display = 'block';
        } else {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'No results found';
            resultsContainer.appendChild(noResults);
            resultsContainer.style.display = 'block';
        }
    } 
});


