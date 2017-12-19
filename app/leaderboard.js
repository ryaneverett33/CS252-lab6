var madeTable = false;
var index = 0;
var tableSize = 11;
var tableId = "leaderboardTable";
var lastLength = -1;
var nextbutton = null;
var prevbutton = null;
var pageNumber = null;
function handleTable() {
    index = 0;
    if (!madeTable) makeTable();
    enableNextButton();
    disablePrevButton();
    fillTable();
}

function nextButton() {
    console.log("Clicked next button");
    index++;
    enablePrevButton();
    fillTable();
}
function prevButton() {
    console.log("Clicked prev button");
    if (index > 0) {
        enableNextButton();
        index--;
        if (index == 0) {
            disablePrevButton();
        }
        fillTable();
    }
    else {
        disablePrevButton();
    }
}
function disableNextButton() {
    nextbutton.disabled = true;
}
function disablePrevButton() {
    prevbutton.disabled = true;
}
function enableNextButton() {
    nextbutton.disabled = false;
}
function enablePrevButton() {
    prevbutton.disabled = false;
}
function updatePageNumber() {
    if (index > 0) {
        pageNumber.innerHTML = '<b>' + (index + 1).toString() + '</b>';
        pageNumber.setAttribute('class', 'win-cell');
    }
    else {
        pageNumber.innerHTML = "&nbsp;";
    }
    
}
function fillTable() {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function() {
        if (this.status == 200) {
            var json;
            try {
                json = JSON.parse(this.responseText);
            }
            catch (e) {
                console.error("Couldn't parse /leaderboards/get response");
                console.error("Response: %s", this.responseText);
                console.error("Error: %s", e);
                return;
            }
            /*{
                Name,
                Wins,
                HighScore
            }*/
            console.log(json.length);
            if (json.length == lastLength) {
                index--;
                disableNextButton();
                return;
            }
            var table = document.getElementById(tableId);
            var tableIndex = 1;
            console.log("Start: %d End: %d", ((tableSize - 1) * index), ((tableSize - 1) * index + (tableSize) - 1));
            for (var i = ((tableSize - 2) * index); i < ((tableSize - 1) * index + (tableSize) - 1); i++) {
                if (tableIndex == 11) {
                    continue;
                }
                var row = table.rows[tableIndex];
                var nameCell = row.cells[0];
                var winCell = row.cells[1];
                var scoreCell = row.cells[2];
                if (i < json.length) {
                    console.log(json[i]);
                    nameCell.innerHTML = json[i].Name;
                    winCell.innerHTML = json[i].Wins;
                    scoreCell.innerHTML = json[i].HighScore;
                }
                else {
                    //make it empty;
                    disableNextButton();
                    nameCell.innerHTML = "&nbsp;";
                    winCell.innerHTML = "&nbsp;";
                    scoreCell.innerHTML = "&nbsp;";
                }
                nameCell.setAttribute('class', 'name-cell');
                winCell.setAttribute('class', 'win-cell');
                scoreCell.setAttribute('class', 'score-cell');
                tableIndex++;
            }
            lastLength = json.length;
            updatePageNumber();
        }
        else {
            console.log("failed to load leaderboard");
        }
    });
    xhr.open("POST", "/leaderboards/get");
    if (index == 0) {
        xhr.send(JSON.stringify({ amount : ((tableSize - 1) * index) + (tableSize - 1)}));
    }
    else {
        xhr.send(JSON.stringify({ amount : ((tableSize - 1) * index) + (tableSize - 1) - (index)}));
    }
}
function makeTable() {
    if (madeTable) {
        return;
    }
    var board = document.getElementById(tableId);
    //make headers
    var headerrow = board.insertRow(0);
    var nameCell = headerrow.insertCell(0);
    nameCell.innerHTML = "<b>Name</b>";
    var winsCell = headerrow.insertCell(1);
    winsCell.innerHTML = "<b>Wins</b>";
    var scoreCell = headerrow.insertCell(2);
    scoreCell.innerHTML = "<b>HighScore</b>";
    for (var i = 1; i < tableSize; i++) {
        var row = board.insertRow(i);
        var cell1 = row.insertCell(0);
        cell1.innerHTML = "Name";
        var cell2 = row.insertCell(1);
        cell2.innerHTML = "Wins";
        var cell3 = row.insertCell(2);
        cell3.innerHTML = "HighScore";
    }
    var lastrow = board.insertRow(tableSize);
    var prevCell = lastrow.insertCell(0);
    var pageCell = lastrow.insertCell(1);
    var nextCell = lastrow.insertCell(2);
    prevCell.innerHTML = '<button onclick="prevButton()" id="prevbtn">Prev</button>';
    nextCell.innerHTML = '<button onclick="nextButton()" id="nextbtn">Next</button>';
    prevbutton = document.getElementById("prevbtn");
    nextbutton = document.getElementById("nextbtn");
    pageNumber = pageCell;
    madeTable = true;
    disablePrevButton();
}