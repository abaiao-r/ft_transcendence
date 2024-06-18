function getCsrfToken() {
	return document.cookie.match(/csrftoken=([^;]+)/)[1];
}

async function login(username, password) {
    const loginCredentials = { username, password };

    try {
        const response = await fetch('/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': '{{ csrf_token }}',
            },
            body: JSON.stringify(loginCredentials),
        });

        if (!response.ok) {
            const errorDetail = await response.json();
            return { error: true, message: `Failed to log in: ${errorDetail.error}` };
        }

        const loginResponseData = await response.json();
        return { error: false, data: loginResponseData };
    } catch (error) {
        return { error: true, message: 'Network or other error' };
    }
}

async function oauthLogin() {
    try {
        const response = await fetch('/oauth/login/', {
            method: 'GET',
            headers: {
                'X-CSRFToken': '{{ csrf_token }}',
            },
        });

        if (!response.ok) {
            const errorDetail = await response.json();
            return { error: true, message: `Failed to log in: ${errorDetail.error}` };
        }

        const loginResponseData = await response.json();
        return { error: false, data: loginResponseData };
    } catch (error) {
        return { error: true, message: 'Network or other error' };
    }
}

async function logout() {
    try {
        const response = await fetch('/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
				'X-CSRFToken': '{{ csrf_token }}',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Refresh': `Bearer ${localStorage.getItem('refreshToken')}`
            }
        });
        
        const data = await response.json();
        if (data.error) {
            alert(data.error);
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        

    } catch (error) {
        console.error('Logout failed:', error);
        alert('Logout failed. Please try again.');
    }
}
async function refreshToken() {
	if (localStorage.getItem('refreshToken') == null) {
		
		return false;
	}
	try {
		const response = await fetch('/api/token/refresh/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': '{{ csrf_token }}',
			},
			body: JSON.stringify({ refresh: localStorage.getItem('refreshToken') }),
		});
		const data = await response.json();
		if (data.error) {
			alert(data.error);
		} else {
			localStorage.setItem('accessToken', data.access);
			
			return true;
		}
	} catch (error) {
		console.error('Failed to refresh token:', error);
	}
	return false;
}

async function getUserStats(search, username) {
    if (search == 1) {
        const response = await fetch(`/search-users/?username=${username}`,
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
    else {
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

	
}
