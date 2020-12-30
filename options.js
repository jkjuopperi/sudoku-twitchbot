
function save_options() {
    chrome.storage.local.set({
        twitch_username: document.getElementById('twitch_username').value,
        twitch_token: document.getElementById('twitch_token').value
    }, function() {
        document.getElementById('status').textContent = 'Saved.';
    });
}

function load_options() {
    chrome.storage.local.get({"twitch_username": "", "twitch_token": ""}, function(items) {
        document.getElementById('twitch_username').value = items.twitch_username;
        document.getElementById('twitch_token').value = items.twitch_token;
    });
}

// When options page loads, load options from chrome's storage.
document.addEventListener('DOMContentLoaded', load_options);

// When save is clicked, save options to chrome's storage.
document.getElementById('save').addEventListener('click', save_options);
