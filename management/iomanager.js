var matchmaker = require('./match.js');

//Stores the io object for safe keeping
var socketobj;
//All the rooms used for matchmaking

//[roomid] = matchobj 
var currentGames = {};  //describes games currently being played
//[roomid] = matchobj
var openGames = {};     //describes games waiting for another player
var openGameCount = 0;
var openGameIds = [];
var currentGameCount = 0;

//game settings
var MAXPLAYERS = 2;

//Safely emits a message over a socket, no err today bois
this.safeEmit = function(socket, type, message) {
    if (socket.connected) {
        socket.emit(type, message);
    }
}

//FROM MDN
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
//generates a valid roomid
function generateRoomid() {
    var roomid = -1;
    var contains = false;
    do {
        roomid = getRandomArbitrary(0, 9999);
        //search for the existing room
        if (currentGames[roomid] != null || openGames[roomid] != null) {
            contains = true;
        }
    }
    while (roomid > 0 && contains);
    return roomid;
}

//Checks if a game has finished or not
function isMatchOver(match) {
    if (match == null) {
        return true;
    }
    return match.isGameOver();
}
//Removes a finished game, ASSUMES isMatchOver HAS BEEN CALLED PRIOR
function finishGame(match) {
    if (match == null) {
        return;
    }
    console.log("Game over!, removing from currentGames");
    currentGames[match.roomid] = null;
    currentGameCount--;
}

//returns a new match for adding a player to
function findOpenRoom(roomid) {
    console.log("Finding open room");
    if (openGameCount == 0) {
        if (roomid != null) {
            //no match available
            return null;
        }
        else {
            console.log("Creating new room");
            //create new match and return it
            var newid = generateRoomid();
            var room = new matchmaker.match(newid, MAXPLAYERS);
            openGames[newid] = room;
            openGameIds.push(newid);
            openGameCount++;
            return room;
        }
    }
    else {
        if (roomid != null) {
            var match = openGames[roomid];
            if (match != null) {
                if (match.willBeFull()) {
                    console.log("will be full, removing from opengames");
                    //remove from opengames and openGameIds and add to currentGames
                    openGames[roomid] = null;
                    openGameIds.pop();
                    console.log(openGameIds);
                    openGameCount--;
                    currentGameCount++;
                    currentGames[roomid] = match;
                }
            }
            return match;
        }
        else {
            var match = openGames[openGameIds[0]];
            if (match != null) {
                if (match.willBeFull() ) {
                    console.log("will be full, removing from opengames");
                    //remove from opengames and openGameIds and add to currentGames
                    openGames[match.roomid] = null;
                    openGameIds.pop();
                    openGameCount--;
                    currentGameCount++;
                    currentGames[match.roomid] = match;
                }
            }
            return match;
        }
    }
}
//gameObj {"username":string, "roomid":roomid}
// Match.foundGame : {error : string} | {roomid : int}
function findGame(gameObj, socket) {
    if (gameObj.username == null) {
        safeEmit(socket, 'Match.error', {
            error : "Invalid Arguments"
        });
    }
    console.log("Recieved: ", gameObj);
    var match = findOpenRoom(gameObj.roomid);
    if (match == null) {
        console.log("Did not find open room");
        //couldn't find a match
        safeEmit(socket, 'Match.error', {
            error : "Couldn't find match with given roomid"
        });
        return;
    }
    else {
        console.log("Found open room");
        //join game
        if (match.join(gameObj.username, socket)) {
            console.log("joined match");
            safeEmit(socket, 'Match.foundGame', {
                roomid : match.roomid
            });
            if (match.isFull()) {
                console.log("Starting match");
                //start the match
                match.start();
            }
        }
        else {
            console.log("Failed to join match");
            safeEmit(socket, 'Match.error', {
                error : "Failed to join match"
            });
            return;
        }
    }
}
//returns a match currently being played
function getRoom(roomid) {
    if (roomid == null) {
        return null;
    }
    return currentGames[roomid];
}
//returns a match that is open
function getOpenRoom(roomid) {
    if (roomid == null) {
        return null;
    }
    return openGames[roomid];
}
//actionObj { "roomid" : int, "username" : string, "action" : "jump|duck|hit"}
function handlePlayerAction(socket, actionObj) {
    //get match 
    console.log(actionObj);
    if (actionObj.roomid == null) {
        console.log("HandlePlayerAction was given an invalid object, roomid is null");
        safeEmit(socket, "Player.error", { error : "Roomid is invalid"});
        return;
    }
    var match = getRoom(actionObj.roomid);
    if (match == null) {
        console.log("HandlePlayerAction couldn't get match");
        safeEmit(socket, "Player.error", { error : "Roomid is invalid"});
        return;
    }
    match.handlePlayerAction(socket, actionObj);
    if (isMatchOver(match)) {
        finishGame(match);
    }
}
//boardObj { "roomid" : int, "distance" : int}
function getBoard(socket, boardObj) {
    console.log("Recieved: " + boardObj);
    if (boardObj.roomid == null) {
        safeEmit(socket, "Match.error", { error : "Roomid is invalid"});
        return;
    }
    var match = getRoom(boardObj.roomid);
    if (match == null) {
        safeEmit(socket, "Match.error", { error : "Roomid is invalid"});
        return;
    }
    match.getBoard(socket, boardObj);
    if (isMatchOver(match)) {
        finishGame(match);
    }
}

//getPlayersObj { "roomid" : int }
function getPlayers(socket, getPlayersObj) {
    console.log("Recieved: " + getPlayersObj);
    if (getPlayersObj.roomid == null) {
        safeEmit(socket, "Match.error", { error : "Roomid is invalid"});
        return;
    }
    var match;
    match = getRoom(getPlayersObj.roomid);
    if (match == null) {
        //check if the game hasn't started yet
        match = getOpenRoom(getPlayersObj.roomid);
    }
    if (match == null) {
        safeEmit(socket, "Match.error", { error : "Roomid is invalid"});
        return;
    }
    var players = match.getUsernames();
    if (players == null) {
        safeEmit(socket, "Match.error", { error : "Couldn't get players"});
        return;
    }
    else {
        safeEmit(socket, "Match.players", { players : players });
        if (isMatchOver(match)) {
            finishGame(match);
        }
    }
}
//leaveObj { "roomid" : int, "username" : string }
function leaveMatch(socket, leaveObj) {
    console.log(leaveObj);
    if (leaveObj.roomid == null) {
        safeEmit(socket, "Match.error", { error : "Roomid is invalid"});
        return;
    }
    if (leaveObj.username == null) {
        safeEmit(socket, "Match.error", { error : "Username is invalid"});
        return;
    }
    var match;
    match = getRoom(leaveObj.roomid);
    if (match == null) {
        //check if the game hasn't started yet
        match = getOpenRoom(leaveObj.roomid);
    }
    if (match == null) {
        safeEmit(socket, "Match.error", { error : "Roomid is invalid"});
        return;
    }
    match.leave(leaveObj.username);
    if (isMatchOver(match)) {
        finishGame(match);
    }
}
//Find where the socket is connected to, leave that match
//return nothing
function handleDisconnect(socket) {
    //check currentGames first
    for (var i = 0; i < currentGameCount; i++) {
        var key = Object.keys(currentGames)[i];
        if (key != null) {
            var match = currentGames[key];
            if (match != null) {
                //console.log("match %d was found", match.roomid);
                var username = match.containsSocket(socket);
                if (username != null) {
                    console.log("%s left %d via disconnect", username, match.roomid);
                    match.leave(username);
                    break;
                }
            }
        }
    }
    //check openGames
    for (var i = 0; i < openGameCount; i++) {
        var key = Object.keys(openGames)[i];
        if (key != null) {
            var match = openGames[key];
            if (match != null) {
                var username = match.containsSocket(socket);
                if (username != null) {
                    console.log("%s left %d via disconnect", username, match.roomid);
                    match.leave(username);
                    break;
                }
            }
        }
    }
}
exports.init = function(io) {
    socketobj = io;
    io.sockets.on('connection', function(socket) {
        console.log("Connected");
        //Handles creating a new game and 
        socket.on('Match.findGame', function(gameObj) {
            findGame(gameObj, socket);
        });
        socket.on('Player.jump', function(actionObj) {
            handlePlayerAction(socket, actionObj);
        });
        socket.on('Player.duck', function(actionObj) {
            handlePlayerAction(socket, actionObj);
        });
        socket.on('Player.hit', function(actionObj) {
            handlePlayerAction(socket, actionObj);
        });
        socket.on('Match.getBoard', function(distanceObj) {
            getBoard(socket, distanceObj);
        });
        socket.on('Match.leave', function(leaveObj) {
            leaveMatch(socket, leaveObj);
        });
        socket.on('Match.getPlayers', function(getPlayersObj) {
            getPlayers(socket, getPlayersObj);
        });
        //When the user disconnects, perform this
        socket.on('disconnect', function() {
            //console.log("Disconnected");
            handleDisconnect(socket);
        });
    });
};