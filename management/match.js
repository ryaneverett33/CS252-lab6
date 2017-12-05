var boardmaker = require('./board.js');

function match(roomid, MAXPLAYERS) {
    console.log("Creating match: %d with maxplayers: %d", roomid, MAXPLAYERS);
    this.roomid = roomid;
    //PlayerObj { "username" : "string", "socket" : socket }
    this.players = [];
    this.playerCount = 0;
    this.MAXPLAYERS = MAXPLAYERS;
    this.board = boardmaker.board(99);
    //States: 0 - waiting to start, 1 playing, 2 gameover
    this.currentState = 0
    //returns a boolean if the room contains the user or not
    this.containsPlayer = function(username) {
        if (this.players == null || this.playerCount == 0) {
            console.log("containsPlayer::No players in room");
            return false;
        }
        for (var i = 0; i < this.playerCount; i++) {
            var obj = this.players[i];
            if (obj.username === username) {
                return true;
            }
        }
        return false;
    };
    //returns the index of the player in the array
    this.indexOf = function(username) {
        if (this.players == null || this.playerCount == 0) {
            console.log("indexOf::No players in room");
            return -1;
        }
        for (var i = 0; i < this.playerCount; i++) {
            var obj = this.players[i];
            if (obj.username === username) {
                return i;
            }
        }
        return -1;
    };
    //Returns boolean if successful connection
    this.join = function(username, socket) {
        console.log("Attempting to join: %d", this.roomid);
        if (this.containsPlayer(username)) {
            console.log("Aready contains player");
            return false;
        }
        if (this.playerCount == this.MAXPLAYERS) {
            console.log("FULL");
            return false;
        }
        var playerObj = {
            username : username,
            socket : socket
        };
        this.players.push(playerObj);
        this.playerCount++;
        return true;
    };
    //Returns boolean if successful leave
    this.leave = function(username) {
        if (!this.containsPlayer(username)) {
            return false;
        }
        var index = this.indexOf(username);
        if (index == -1) {
            console.log("leave() contains username but recieved an incorrect index");
            return false;
        }
        this.players.slice(index, 0);
        return true;
    };
    //Returns true if match will be full on next join, false otherwise
    this.willBeFull = function() {
        return ((this.playerCount + 1) == this.MAXPLAYERS);
    }
    //Returns true if match is currently full, false otherwise
    this.isFull = function() {
        return (this.playerCount == this.MAXPLAYERS);
    }
    this.getUsernames = function() {
        var usernames = [];
        for (var i = 0; i < this.playerCount; i++) {
            usernames.push(this.players[i].username);
        }
        return usernames;
    }
    // roomid: int, playerCount: int, players: [usernames]
    this.getMatchObj = function() {
        return {
            roomid: this.roomid,
            playerCount : this.playerCount,
            players : this.getUsernames()
        };
    }
    // TBD
    this.getBoardObj = function(startIndex) {
        throw "NotImplemented";
    }
    //Send signal of type type to every player
    //returns nothing
    this.sendToPlayers = function(type,obj) {
        if (type == null || obj == null) {
            console.log("match.sendToPlayers was given invalid arguments");
            return;
        }
        for (var i = 0; i < this.playerCount; i++) {
            var playersocket = this.players[i].socket;
            playersocket.emit(type, obj);
        }
    }
    //Sends signal of type type to all players except for player
    //Returns nothing
    this.sendToPlayers = function(username, type, obj) {
        if (username == null || type == null || obj == null) {
            console.log("match.sendToPlayers(player) was given invalid arguments");
            return;
        }
        for (var i = 0; i < this.playerCount; i++) {
            var player = this.players[i];
            if (player.username === username) {
                continue;
            }
            var playersocket = player.socket;
            playersocket.emit(type, obj);
        }
    }
    //actionObj { "roomid" : int, "username" : string, "action" : "jump|duck|hit"}
    //Socket is the socket of the sender
    this.handlePlayerAction = function (socket, actionObj) {
        if (actionObj.username == null) {
            socket.emit("Player.error", { error: "Invalid username" });
            return;
        }
        if (actionObj.action == null) {
            socket.emit("Player.error", { error: "Invalid Player Action" });
            return;
        }
        var valid = actionObj.action.toLowerCase() === "jump";
        valid = valid || actionObj.action.toLowerCase() === "duck";
        valid = valid || actionObj.action.toLowerCase() === "hit";
        if (valid) {
            this.sendToPlayers(actionObj.username, "Match.playerUpdate", {
                username : actionObj.username,
                action : actionObj.action
            });
        }
        else {
            socket.emit("Player.error", { error: "Invalid Player Action" });
            return;
        }
    }
    //boardObj { "roomid" : int, "distance" : int}
    this.getBoard = function(socket, boardObj) {
        if (boardObj.distance == null || boardObj.distance < 0) {
            socket.emit('Match.error', { error : "Invalid board distance" })
        }
        else {
            socket.emit('Match.boardUpdate', board.getSegment(boardObj.distance));
        }
    }
    //Sends a start signal to all the players and initalizes the board
    //Start obj : {roomid: int, playerCount: int, players: [usernames]}
    this.start = function() {
        //initalize the board
        //Generate start obj with board info and match info
        //Tell players the match has started
        this.sendToPlayers('Server.startMatch', this.getMatchObj);
    }
}
exports.match = match;