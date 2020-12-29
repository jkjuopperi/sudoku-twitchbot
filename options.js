
function save_options() {
    chrome.storage.local.set({
        twitch_username: document.getElementById('twitch_username').value,
        twitch_token: document.getElementById('twitch_token').value
    }, function() {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.local.get(["twitch_username", "twitch_token"], function(items) {
        document.getElementById('twitch_username').value = items.twitch_username;
        document.getElementById('twitch_token').value = items.twitch_token;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
