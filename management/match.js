function match(roomid, MAXPLAYERS) {
    console.log("Creating match: %d with maxplayers: %d", roomid, MAXPLAYERS);
    this.roomid = roomid;
    //PlayerObj { "username" : "string", "socket" : socket }
    this.players = [];
    this.playerCount = 0;
    this.MAXPLAYERS = MAXPLAYERS;
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
    //Sends a start signal to all the players and initalizes the board
    //Start obj : {roomid: int, playerCount: int, players: [usernames]}
    this.start = function() {
        for (var i = 0; i < this.playerCount; i++) {
            //tell each player to start the game
            var playersocket = this.players[i].socket;
            playersocket.emit('Server.startMatch', this.getMatchObj());
        }
        //initalize the board
    }
}
exports.match = match;