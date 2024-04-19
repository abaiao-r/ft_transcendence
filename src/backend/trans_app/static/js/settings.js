async function fetch_save_changes(formData) {
	try {
		const response = await fetch('/settings/', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
			},
			body: formData
		});

		if (!response.ok) {
			throw new Error('Failed to update settings. Server responded with status ' + response.status);
		}

		const responseData = await response.json();

		// Check for specific error cases in the response
		if (responseData.error) {
			throw new Error('Failed to update settings: ' + responseData.error);
		}

		// Return response data if everything is successful
		return responseData;
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

document.addEventListener('DOMContentLoaded', function() {
    const settingsButton = document.getElementById('save-changes-button');
    if (settingsButton) {
        settingsButton.addEventListener('click', async function(event) {
            event.preventDefault(); // Prevent the default action (navigation/redirect)
            await saveChanges(); // Call the saveChanges function
        });
    }
});