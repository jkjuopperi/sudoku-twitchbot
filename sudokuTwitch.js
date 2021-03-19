let lastActivity = performance.now(); // DOMHighResTimeStamp
let requestQueue = [];

/**
 * Detect mouse clicks and key presses. Keep lastActivity timestamp
 * updated so we know to avoid doing game moves in middle of user interaction.
 */
function activityDetected(event) {
    lastActivity = event.timeStamp;
}
document.body.addEventListener('click', activityDetected);
document.body.addEventListener('keydown', activityDetected);

/**
 * Handle one game move
 */
function handleRequest(request) {
    if (request.type === "sudoku") {
        console.log("Sudoku move cell: " + request.cell + " value: " + request.value);

        // Extract row and column (0-based index)
        let match = request.cell.toLowerCase().match(/^([a-i])([1-9])$/)
        let column = match[1].charCodeAt(0) - 97 // Convert column from a-i to 0 based index
        let row = parseInt(match[2]) - 1 // Convert from 1 based to 0 based index

        // Find the correct game-cell and click it.
        let cells = document.getElementsByClassName("game-cell");
        let gameCell = cells[9 * row + column];
        gameCell.click();

        // Find the correct numpad key and click it.
        if (request.value) {
            document.getElementsByClassName("numpad-item")[request.value-1].click();
            gameCell.classList.add("chat-user-cell");
        } else {
            document.getElementsByClassName("game-controls-erase")[0].click();
            gameCell.classList.remove("chat-user-cell")
        }
    }
}

/**
 * Process requestQueue if nothing has been clicked in about four seconds.
 * Otherwise postpone processing and try again shortly.
 */
function processQueue() {
    if (requestQueue.length < 1) {
        console.log("Nothing to do");
        return;
    }
    let requiredIdle = 4000;
    let now = performance.now();
    let idle = now - lastActivity;
    console.log("Processing queue at " + now + " with last activity at " + lastActivity + " idle " + idle);
    if (idle > requiredIdle) {
        console.log("Going to process requests");
        let request;
        while ((request = requestQueue.shift())) {
            console.log("Processing request: " + request);
            handleRequest(request);
        }
    } else {
        let postponeBy = requiredIdle - idle + 100;
        console.log("Postponing by " + postponeBy);
        setTimeout(function () {
            console.log("Processing queue after postpone of " + postponeBy);
            processQueue();
        }, postponeBy);
    }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("Queue request: " + request)
        requestQueue.push(request);
        processQueue();
    }
);

// Say hello to background.js. This starts up the IRC connection.
chrome.extension.sendMessage({ type: 'hello' });

// Keep saying hello every 5 seconds.
var twitchbot_hello_timer = setInterval(function () {
    chrome.extension.sendMessage({ type: 'hello' });
}, 5000);

function inject_numbers () {
    let game_wrapper = document.getElementsByClassName('game-wrapper')[0];
    let x_arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    x_arr.forEach(function (value, i) {
        let elem = document.createElement('div');
        elem.classList.add('stream-number');
        elem.textContent = value;
        elem.style.top = '-5%';
        elem.style.left = '' + ((100/9)*i + (100/18)) + '%';
        game_wrapper.appendChild(elem);
    });
    let y_arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    y_arr.forEach(function (value, i) {
        let elem = document.createElement('div');
        elem.classList.add('stream-number');
        elem.textContent = value;
        elem.style.left = '-4%';
        elem.style.top = '' + ((100/9)*i + 3 ) + '%';
        game_wrapper.appendChild(elem);
    });
}
setTimeout(inject_numbers, 1000);

