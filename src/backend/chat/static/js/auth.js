function getCsrfToken() {
	return document.cookie.match(/csrftoken=([^;]+)/)[1];
}

async function login(username, password) {
    const data = { username, password };

    try {
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
		console.log("response: ", response);
		const data_2 = await response.json();
		console.log("data: ", data_2);
		localStorage.setItem('accessToken', data_2.access);
		localStorage.setItem('refreshToken', data_2.refresh);
		console.log("Logged in");
		return true;
	} catch (error) {
		console.error('Login failed:', error);
		alert('Login failed. Please try again.');
		return false;
	}
}

async function logout() {
	try {
		const response = await fetch('/logout/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': '{{ csrf_token }}',
				'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
			},
		});
		console.log("response: ", response);
		const data = await response.json();
		if (data.error) {
			alert(data.error);
		} else {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			console.log("Logged out");
		}
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
			return true;
		}
	} catch (error) {
		console.error('Failed to refresh token:', error);
	}
	return false;
}