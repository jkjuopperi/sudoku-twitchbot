var client = null;
var activeTab = null;

chrome.runtime.onInstalled.addListener(function() {
    console.log("Sudoku TwitchBot installed")
    chrome.browserAction.setBadgeText({text: "Alive"});
});

chrome.runtime.onSuspend.addListener(function() {
    console.log("Unloading.");
    chrome.browserAction.setBadgeText({text: "RIP"});
});

function twitchbot_onmessage(target, context, msg, ownMessage) {
    console.log("Target: " + target + " context: " + context + " msg: " + msg + " ownMessage: " + ownMessage)
    let match = msg.toLowerCase().match(/^!s ([a-i])([1-9])[, ]([1-9])/)
    if (match && activeTab) {
        let column = match[1].charCodeAt(0) - 97 // Convert column from A-I to 0 based index
        let row = parseInt(match[2]) - 1 // Convert from 1 based to 0 based index
        let value = parseInt(match[3])
        chrome.tabs.sendMessage(activeTab, {
            type: "sudoku",
            column: column,
            row: row,
            value: value
        }, function(response) {
            console.log("Response: " + response);
        });
    }
}

function twitchbot_connect() {
    // Get settings from storage
    chrome.storage.local.get(["twitch_username", "twitch_token"], function(items) {
        if (client) {
            client.disconnect();
        }
        // Create Twitch client
        client = new tmi.client({
            "identity": {
                "username": items.twitch_username,
                "password": items.twitch_token
            },
            "channels": [
                items.twitch_username
            ]
        });
        client.on('message', twitchbot_onmessage);
        client.connect();
    });
}

function twitchbot_disconnect() {
    client.disconnect();
    client = null;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "connect") {
        console.log("Connect!")
        twitchbot_connect()
        chrome.browserAction.setBadgeText({text: "CON"});
    } else if (request.type === "disconnect") {
        console.log("Disconnect!")
        twitchbot_disconnect()
        chrome.browserAction.setBadgeText({text: "DIS"});
    } else if (request.type === "register") {
        console.log("Registration received from " + sender);
        activeTab = sender.tab.id;
    } else if (request.type === "test") {
        console.log("TEST");
        chrome.tabs.sendMessage(activeTab, {type: "test"})
    }
});
