//Stores the io object for safe keeping
var socketobj;
/*
Handles all io operations
*/
exports.init = function(io) {
    socketobj = io;
    io.sockets.on('connection', function(socket) {

        //When the user disconnects, perform this
        socket.on('disconnect', function() {

        });
    });
};