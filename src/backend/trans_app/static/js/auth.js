function getCsrfToken() {
	return document.cookie.match(/csrftoken=([^;]+)/)[1];
}

async function login(username, password) {
    const loginCredentials = { username, password };

    try {
<<<<<<< HEAD
		const response = await fetch('/api/login/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': '{{ csrf_token }}',
			},
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			throw new Error('Failed to login');
		}
		const data_2 = await response.json();
		console.log("data: ", data_2);
		if (data_2.access != null && data_2.refresh != null) {
			localStorage.setItem('accessToken', data_2.access);
			localStorage.setItem('refreshToken', data_2.refresh);
			console.log("Logged in");
		}
		return data_2;
	} catch (error) {
		console.error('Login failed:', error);
		console.log("------------------------------------------------------");
		//alert('Login failed. Please try again.');
		return null;
	}
=======
        const response = await fetch('/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': '{{ csrf_token }}', // Ensure dynamic handling
            },
            body: JSON.stringify(loginCredentials),
        });

        if (!response.ok) {
            const errorDetail = await response.json();
            return { error: true, message: `Failed to log in: ${errorDetail.error}` };
        }

        const loginResponseData = await response.json();
		localStorage.setItem('accessToken', loginResponseData.access);
		localStorage.setItem('refreshToken', loginResponseData.refresh);
        return { error: false, data: loginResponseData };
    } catch (error) {
        return { error: true, message: 'Network or other error' };
    }
>>>>>>> e6bdc248f78c714a5e8bbcfb8ca9a8f407d74f12
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
        console.log("response: ", response);
        const data = await response.json();
        if (data.error) {
            alert(data.error);
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        console.log("Logged out");

        // Redirect the user to the login page
        window.location.href = 'home';
    } catch (error) {
        console.error('Logout failed:', error);
        alert('Logout failed. Please try again.');
    }
}
async function refreshToken() {
	if (localStorage.getItem('refreshToken') == null) {
		console.log("refreshToken is null");
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
			console.log("Token refreshed");
			console.log("accessToken: ", localStorage.getItem('accessToken'));
			return true;
		}
	} catch (error) {
		console.error('Failed to refresh token:', error);
	}
	return false;
}