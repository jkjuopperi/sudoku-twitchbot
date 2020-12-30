document.addEventListener('DOMContentLoaded', function() {

    // Code for the Reset button. Send reset message to background.js.
    document.getElementById('reset_button').addEventListener('click', function() {
        chrome.runtime.sendMessage({type: "reset"});
    }, false);

    // When popup is opened, send get_history message to background.js and use
    // the data in response to build history table.
    chrome.runtime.sendMessage({type: "get_history"}, function (response) {
        let history = document.getElementById('history')
        response.entries.forEach(function (element) {
            let tr = document.createElement('tr');
            let td1 = document.createElement('td');
            td1.textContent = element.username
            tr.appendChild(td1)
            let td2 = document.createElement('td');
            td2.textContent = element.cell
            tr.appendChild(td2)
            let td3 = document.createElement('td');
            td3.textContent = element.value
            tr.appendChild(td3)
            history.appendChild(tr);
        });
    });

}, false);
