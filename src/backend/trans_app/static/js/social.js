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
                <button class="btn btn-primary btn-sm mr-2" type="button">View Profile</button>
                <button class="btn btn-danger btn-sm" type="button" onclick="removeFriend(this)">Remove</button>
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



// Add listener to remove friend button
document.addEventListener('DOMContentLoaded', function() {
    const friendsContainer = document.getElementById('list-friends');
    const removeButtons = document.getElementsByClassName('btn-danger');

    removeButtons.forEach((removeButton) => {
        removeButton.addEventListener('click', async function(event) {
            event.preventDefault();

            console.log('Remove button clicked');

            // Get the friend list item that contains the remove button
            const listItem = removeButton.closest('.list-group-item');
            console.log('List item: ', listItem);
            const usernameElement = listItem.querySelector('.friend-name');
            console.log('Username element: ', usernameElement);
            // Get the value (text content) of the username element
            const friendUsername = usernameElement.textContent.trim();
            const response = await removeFriendFetch(friendUsername);

            if (response.error) {
                console.log(response.message);
                alert(response.message);
                return;
            }

            console.log("Friend removed successfully");
            window.location.reload();
        });
    });
});


// Add listener to add-friend-icon
document.addEventListener('DOMContentLoaded', function() {
    const addFriendIcon = document.getElementById('add-friend-icon');

    addFriendIcon.addEventListener('click', async function(event) {
        event.preventDefault();
        const friendUsername = document.getElementById('friends-search-bar').value;
        const response = await addFriendFetch(friendUsername);

        if (response.error) {
            console.log(response.message);
            alert(response.message);
            return;
        }

        console.log("Friend added successfully");
        window.location.reload();
    });
});


// Add listener to Social button
document.addEventListener('DOMContentLoaded', function() {
    const socialButton = document.getElementById('social-button');

    socialButton.addEventListener('click', function(event) {
        hidePlayMenu();
        event.preventDefault();
        window.location.href = SOCIAL_HREF;
    });
});