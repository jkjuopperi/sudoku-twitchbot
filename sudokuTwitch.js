chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.type === "test") {
          console.log("TEST")
        } else if (request.type === "sudoku") {
            console.log("Sudoku move col: " + request.column + " row: " + request.row + " value: " + request.value);

            // Click the correct cell
            let cells = document.getElementsByClassName("game-cell");
            cells[9 * request.row + request.column].click()

            // Click the correct numpad key
            let numpadNums = document.getElementsByClassName("numpad-item")[request.value-1].click()
        }
    }
);
chrome.extension.sendMessage({ type: 'register' });
