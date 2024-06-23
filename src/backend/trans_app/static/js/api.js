function getCsrfToken() {
	return document.cookie.match(/csrftoken=([^;]+)/)[1];
}

const LOGIN_URL = '/api/login/';
const OAUTH_LOGIN_URL = '/oauth/login/';
const LOGOUT_URL = '/logout/';
const REFRESH_TOKEN_URL = '/api/token/refresh/';
const SEARCH_USERS_URL = '/search-users/';
const GET_USER_URL = '/getuser/';
const PLAYER_STATS = '/player-stats/';
const MATCH_HISTORY = '/match-history/';

function getTokens() {
    return {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
    };
}

function getAuthHeaders() {
    const tokens = getTokens();
    if (!tokens.accessToken) {
        return {};
    }
    return {
        'Authorization': `Bearer ${tokens.accessToken}`,
        'Refresh': `Bearer ${tokens.refreshToken}`,
    };
}

async function fetchData(url, method, additionalHeaders = {}, body = null, auth = false) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'X-CSRFToken': '{{ csrf_token }}',
    };

    const authHeaders = getAuthHeaders();

    let headers = { ...defaultHeaders, ...additionalHeaders };

    // Add authorization headers if needed
    if (auth) {
        headers = { ...headers, ...authHeaders };
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: headers,
            body: body ? JSON.stringify(body) : null,
        });

        const contentType = response.headers.get('Content-Type');

        // Check if the request failed
        if (!response.ok) {
            if (contentType && contentType.includes('application/json')) {
                const errorDetail = await response.json();
                return { error: true, message: `Request failed: ${errorDetail.error || 'error'}` };
            } else {
                return { error: true, message: 'Request failed and response is not JSON' };
            }
        }

        // Check if the response is JSON
        if (contentType && contentType.includes('application/json')) {
            const responseData = await response.json();
            return { error: false, data: responseData };
        } else {
            return { error: false, data: 'Response is not JSON' };
        }
    } catch (error) {
        return { error: true, message: 'Network or other error' };
    }
}

async function login(username, password) {
    const loginCredentials = { username, password };

    const response = await fetchData(LOGIN_URL, 'POST', {}, loginCredentials);
    return response;
}

async function oauthLogin() {
    const response = await fetchData(OAUTH_LOGIN_URL, 'POST');
    return response;
}

async function logout() {
    const response = await fetchData(LOGOUT_URL, 'POST', {}, null, true);

    // remove tokens if logout is successful
    if (!response.error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
}
async function refreshToken() {
	const tokens = getTokens();
    // Check if the tokens are present
    if (!tokens.refreshToken || !tokens.accessToken) {
        return false;
    }
	
    const response = await fetchData(REFRESH_TOKEN_URL, 'POST', {}, { refresh: tokens.refreshToken });
	
    if (response.error) {
        return false;
    }
    // Update the access token
    else {
        localStorage.setItem('accessToken', response.data.access);
        return true;
    }
}

async function searchUsers(username) {
    const response = await fetchData(`${SEARCH_USERS_URL}?username=${username}`, 'GET', {}, null, true);
    return response;
}

async function getCurrentUser() {
    const response = await fetchData(GET_USER_URL, 'GET', {}, null, true);
    return response;
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

function getMatchHistory(username) {
    return fetchData(`${MATCH_HISTORY}?username=${username}`, 'GET', {}, null, true);
}

function getPlayerStats(username) {
    const headers = {
        'Accept': 'application/json'
    };
    return fetchData(`/player-stats?username=${username}`, 'GET', headers, null, true);
}

function getMyPlayerStats() {
    const headers = {
        'Accept': 'application/json'
    };
    return fetchData(PLAYER_STATS, 'GET', headers, null, true);
}