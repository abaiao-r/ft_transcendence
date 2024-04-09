async function fetch_save_changes(formData) {
	try {
		const response = await fetch('/settings/', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
			},
			body: formData
		})
		.then(response => response.json())
		.then(data => {
			if (data.message && data.message == 'Settings updated successfully') {
				console.log('Success:', data.message);
				return data;
			}
			return null;
		})
	} catch (error) {
		console.error('Could not update settings:', error);
		alert('Could not update settings. Please try again.');
		return null;
	}

}

// Save changes action
async function saveChanges() {
	// Your existing logic for handling the save changes action
	const formData = new FormData();
	const avatarFile = document.querySelector('input[type="file"]').files[0];
	const username = document.querySelector('#inputUsername').value;
	const name = document.querySelector('#inputName').value;
	const surname = document.querySelector('#inputSurname').value;

	if (avatarFile) {
		formData.append('avatar', avatarFile);
	}
	if (username) {
		formData.append('username', username);
	}
	if (name) {
		formData.append('name', name);
	}
	if (surname) {
		formData.append('surname', surname);
	}

	const response = await fetch_save_changes(formData);
	if (response == null) {
		return;
	} else {
		window.location.reload();
		alert("Changes saved successfully!");
	}
}

// Add listener to settings button
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('settings-button').addEventListener('click', function() {
		window.location.href = SETTINGS_HREF;
	});
});

async function updateSettingsPlaceholders() {
	const data = await getUserStats();
	if (data == null) {
		console.log("sidebar info is null");
		return;
	}

	console.log("sidebar info: ", data);
	console.log("username: ", data.username);
	console.log("profile_image: ", data.profile_image);
	// Change the placeholder values
	document.getElementById('inputUsername').value = data.username;
	document.getElementById('inputName').value = data.name;
	document.getElementById('inputSurname').value = data.surname;
	document.getElementById('settings-profile-img').setAttribute('src', data.profile_image);
}

function enableEdit(elementId) {
	const element = document.getElementById(elementId);
	element.disabled = false;
	element.focus()
}

function storeOriginalValue(element) {
	// Store the original value in a data attribute
	element.dataset.originalValue = element.value;
}

function disableIfUnchanged(element, originalPlaceholder) {
	if (element.value === element.dataset.originalValue || element.value === '') {
		// Disable the field if the value is unchanged or empty
		element.disabled = true;
		element.placeholder = originalPlaceholder; // Reset the placeholder
	}
}