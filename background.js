var twitchClient = null;
var activeTab = null;
var killTimer = null;
var sudoku_history = [];

chrome.runtime.onInstalled.addListener(function() {
    console.log("onInstalled");
    //chrome.browserAction.setBadgeText({text: "START"});
});

chrome.runtime.onSuspend.addListener(function() {
    console.log("onSuspend");
    chrome.browserAction.setBadgeText({text: "BYE"});
});

function messageReceived(channel, tags, msg, self) {
    //if (self) return; // Skip echoes of our own messages
    console.log("messageReceived: " + msg)

    if(msg.toLowerCase() === '!commands') {
        if (twitchClient) {
            twitchClient.say(channel, 'Commands: !s <cell> <number> - Aseta tai poista numero: !s A1 1, !s A1 -');
        }
    }

    if (msg.match(/^![^t] /)) {
        let match = msg.match(/^!s ([a-i][1-9])[, ]([1-9-])$/i)
        let match_reverse = msg.match(/^!s ([1-9][a-i])[, ]([1-9-])$/i)
        if (match) {
            if (activeTab) {
                let cell = match[1].toUpperCase();
                let value = null;
                if (match[2] !== "-") {
                    value = parseInt(match[2]);
                }
                sudoku_history.push({username: tags.username, cell: cell, value: value});
                chrome.tabs.sendMessage(activeTab, {
                    type: "sudoku",
                    cell: cell,
                    value: value
                });
            }
        } else if (match_reverse) {
            if (activeTab) {
                let cell = '' + match_reverse[1].toUpperCase()[1] + match_reverse[1].toUpperCase()[0];
                let value = null;
                if (match_reverse[2] !== "-") {
                    value = parseInt(match_reverse[2]);
                }
                sudoku_history.push({username: tags.username, cell: cell, value: value});
                chrome.tabs.sendMessage(activeTab, {
                    type: "sudoku",
                    cell: cell,
                    value: value
                });
            }
        } else {
            if (Math.random() < 0.01) {
                let errors = ["/me hugs you <3", "/me loves you <3"];
                let error = errors[Math.floor(Math.random() * errors.length)];
                twitchClient.say(channel, error);
            } else {
                let errors = ["Whoopsie!", "typo :D", "?", "nani :3", "oho!", "hupsis :D", "try again", "yritäpä uudestaan", "kas noin!"];
                let error = errors[Math.floor(Math.random() * errors.length)];
                twitchClient.say(channel, error);
            }
        }
    }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "hello") {
        let tabId = sender.tab.id;
        console.log("Hello from tab " + tabId);
        resetKillTimer();
        activeTab = tabId;
        if (!twitchClient) {
            chrome.storage.local.get(["twitch_username", "twitch_token", "twitch_channel"], function(items) {
                twitchClient = new tmi.Client({
                    options: { debug: true },
                    connection: {
                        reconnect: true,
                        secure: true
                    },
                    identity: {
                        username: items.twitch_username,
                        password: items.twitch_token
                    },
                    channels: [
                        items.twitch_channel
                    ]
                });
                twitchClient.on('message', messageReceived);
                twitchClient.connect().catch(console.error);
            });
        }
        chrome.browserAction.setBadgeText({text: "ON"});
    } else if (request.type === "get_history") {
        console.log("get_history");
        sendResponse({entries: sudoku_history});
    } else if (request.type === "reset") {
        console.log("reset");
        reset();
        if (killTimer) {
            clearTimeout(killTimer);
        }
    }
});

function reset() {
    console.log("Reset!")
    chrome.browserAction.setBadgeText({text: "OFF"});
    activeTab = null;
    sudoku_history = [];
    if (twitchClient) {
        twitchClient.disconnect().catch(console.error);
        twitchClient = null;
    }
}
function resetKillTimer() {
    if (killTimer) {
        clearTimeout(killTimer);
    }
    killTimer = setTimeout(reset, 10000);
}

resetKillTimer();
