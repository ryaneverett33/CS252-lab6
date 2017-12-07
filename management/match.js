var boardmaker = require('./board.js');

function match(roomid, MAXPLAYERS) {
    console.log("Creating match: %d with maxplayers: %d", roomid, MAXPLAYERS);
    this.roomid = roomid;
    //PlayerObj { "username" : "string", "socket" : socket, "alive" : boolean }
    this.players = [];
    this.playerCount = 0;
    this.MAXPLAYERS = MAXPLAYERS;
    this.board = boardmaker.board(99);

    this.safeEmit = function(socket, type, message) {
        if (socket.isConnected()) {
            socket.emit(type, message);
        }
        else {
            console.log("Socket disconnected, could not emit");
        }
    }
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
            socket : socket,
            alive : true
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
        this.killPlayer(username);
        if (this.isGameOver()) {
            this.sendGameOver(this.getWinner());
        }
        return true;
        /*this.players.slice(index, 0);
        return true;*/
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
        var usernames = new Array(this.playerCount);
        for (var i = 0; i < this.playerCount; i++) {
            usernames[i] = this.players[i].username;
        }
        return usernames;
    }
    // roomid: int, playerCount: int, players: [usernames]
    this.getMatchObj = function() {
        return {
            roomid: this.roomid,
            playerCount : this.playerCount,
            players : this.getUsernames(),
            board : this.getBoardObj(0)
        };
    }
    //Returns array [{ "id" : int, "enemy" : string, "spawnTime", float}]
    this.getBoardObj = function(startIndex) {
        return this.board.getSegment(startIndex);
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
    this.sendToPlayersExcept = function(username, type, obj) {
        if (username == null || type == null || obj == null) {
            console.log("match.sendToPlayersExcept was given invalid arguments");
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
            this.sendToPlayersExcept(actionObj.username, "Match.playerUpdate", {
                username : actionObj.username,
                action : actionObj.action
            });
        }
        else {
            socket.emit("Player.error", { error: "Invalid Player Action" });
            return;
        }
        if (actionObj.action.toLowerCase() === "hit") {
            //handle the hit
            this.killPlayer(actionObj.username);
            if (this.isGameOver()) {
                this.sendGameOver(getWinner());
            }
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
    //returns true/false
    this.isGameOver = function() {
        var alivePlayers = 0;
        for (var player in this.players) {
            if (!player.alive) {
                alivePlayers++;
            }
        }
        if (alivePlayers > 1) {
            return true;
        }
        else {
            return false;
        }
    }
    this.killPlayer = function(username) {
        for (var player in this.players) {
            if (player.username === username) {
                player.alive = false;
                player.socket.emit("Player.dead");
                return;
            }
        }
    }
    this.getWinner = function() {
        for (var player in this.players) {
            if (player.alive) {
                return player.username;
            }
        }
        return null;
    }
    this.sendGameOver = function(winner) {
        var matchOverObj = {
            winner : winner
        };
        this.sendToPlayers("Server.endMatch", matchOverObj);
    }
    this.containsSocket = function(socket) {
        for (var player in this.players) {
            if (player.socket === socket) {
                return true;
            }
        }
        return false;
    }
    //Sends a start signal to all the players and initalizes the board
    //Start obj : {roomid: int, playerCount: int, players: [usernames]}
    this.start = function() {
        //initalize the board
        //Generate start obj with board info and match info
        //Tell players the match has started
        this.sendToPlayers('Server.startMatch', this.getMatchObj());
    }
}
exports.match = match;