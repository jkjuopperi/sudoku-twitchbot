document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('test_button').addEventListener('click', function() {
        chrome.runtime.sendMessage({type: "test"});
    }, false);
    document.getElementById('connect_button').addEventListener('click', function() {
        chrome.runtime.sendMessage({type: "connect"});
    }, false);
    document.getElementById('disconnect_button').addEventListener('click', function() {
        chrome.runtime.sendMessage({type: "disconnect"});
    }, false);
}, false);
