chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.type === "sudoku") {
            console.log("Sudoku move cell: " + request.cell + " value: " + request.value);

            // Extract row and column (0-based index)
            let match = request.cell.toLowerCase().match(/^([a-i])([1-9])$/)
            let column = match[1].charCodeAt(0) - 97 // Convert column from a-i to 0 based index
            let row = parseInt(match[2]) - 1 // Convert from 1 based to 0 based index

            // Find the correct game-cell and click it.
            let cells = document.getElementsByClassName("game-cell");
            cells[9 * row + column].click()

            // Find the correct numpad key and click it.
            let numpadNums = document.getElementsByClassName("numpad-item")[request.value-1].click()
        }
    }
);

// Say hello to background.js. This starts up the IRC connection.
chrome.extension.sendMessage({ type: 'hello' });

// Keep saying hello every 5 seconds.
var twitchbot_hello_timer = setInterval(function () {
    chrome.extension.sendMessage({ type: 'hello' });
}, 5000);
