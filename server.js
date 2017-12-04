const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const port = process.argv[2] || 9000;
var gameRoot = "/testingKyle/";
var io = require('socket.io')(http);


//C:\Users\Ryan\Repositories\CS252-lab6\testingKyle

http.createServer(function (req, res) {
  //console.log(`${req.method} ${req.url}`);
  //console.log("{0} {1}".format(req.method, req.url));
	console.log(req.method + " " + req.url);
  response.writeHead(200, {"Content-Type": "text/plain"});
	response.end("Shit doesn't work");
  // parse URL
  /*const parsedUrl = url.parse(req.url);
  // extract URL path
  //let pathname = `.${parsedUrl.pathname}`;
  var pathname = "" + parsedUrl.pathname;
  // based on the URL path, extract the file extention. e.g. .js, .doc, ...
  const ext = path.parse(pathname).ext;
  // maps file extention to MIME typere
  const map = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword'
  };
  var resolvedpath = process.cwd() + gameRoot + pathname;
  console.log("Resolved path: " + resolvedpath);
  fs.exists(resolvedpath, function (exist) {
    if(!exist) {
      // if the file is not found, return 404
      res.statusCode = 404;
	  //res.end("File {0} not found!".format(pathname));
	  res.end("File " + pathname + " not found!");
      //res.end(`File ${pathname} not found!`);
      return;
    }

    // if is a directory search for index file matching the extention
    if (fs.statSync(resolvedpath).isDirectory()) pathname += '/index' + ext;

    // read file from file system
    fs.readFile(resolvedpath, function(err, data){
      if(err){
        res.statusCode = 500;
        //res.end(`Error getting the file: ${err}.`);
		res.end("Error getting the file: " + err);
      } else {
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', map[ext] || 'text/plain' );
        res.end(data);
      }
    });
  });*/


}).listen(parseInt(port));

/***Socket IO backend***/

/*
look for available room
if room exists, join
otherwise create room
if user leaves room, count that as the end of the game, add a win to user still in lobby
*/

var rooms = [];  //all rooms to handle multiplayer games
var room_no = 1;  //used to create new room names
io.sockets.on('connection', function(socket) {
  socket.on('find_game', function() {
      //look for available room, if none found, create a new one
      if (typeof rooms[0] !== 'undefined' && rooms[0] !== null) {
        socket.join(rooms[0])
        room.emit('room_id', "room-"+room_no);  //send to clients in room
        //emit start game to both players (startgame will have calls to get data)
        io.sockets.in(rooms[0]).emit('startgame');

        //now that there are two people in the room, remove room from array
        rooms = rooms.shift();
      } else {
        //create new room for users to join
        socket.join("room-"+room_no);  //client joins new room
        rooms.push("room-"+room_no);  //add to rooms array
        var room = io.sockets.in("room-"+room_no);
        socket.on('created_room');

        room.on('leave', function(room) {
          //someone left the room, end the game
          //TODO: do that
      	  var index = rooms.indexOf(room);
      	  rooms.splice(index, 1);    
        });
        room_no++;
      }
  });
});



//console.log(`Server listening on port ${port}`);
console.log("Server listening on port", port);
console.log(path);
