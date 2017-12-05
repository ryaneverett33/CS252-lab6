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
        socket.emit('Match.foundGame', {
            error : "Invalid Arguments"
        });
    }
    console.log("Recieved: ", gameObj);
    var match = findOpenRoom(gameObj.roomid);
    if (match == null) {
        console.log("Did not find open room");
        //couldn't find a match
        socket.emit('Match.foundGame', {
            error : "Couldn't find match with given roomid"
        });
        return;
    }
    else {
        console.log("Found open room");
        //join game
        if (match.join(gameObj.username, socket)) {
            console.log("joined match");
            socket.emit('Match.foundGame', {
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
            socket.emit('Match.foundGame', {
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
exports.init = function(io) {
    socketobj = io;
    io.sockets.on('connection', function(socket) {
        //Handles creating a new game and 
        socket.on('Match.findGame', function(gameObj) {
            findGame(gameObj, socket);
        });
        //When the user disconnects, perform this
        socket.on('disconnect', function() {
            
        });
    });
};