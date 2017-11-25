var http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
var gameRoot = "\testingKyle\";

var server = http.createServer(function(req, res) {
	/*var message = "Request: " + request + "\n";
	message += "Cwd: " + process.cwd() + "\n";
	message += "HELLO BITCHES" + "\n";
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end(message);*/
	var parsedUrl = url.parse(req.url);
	  // extract URL path
	  //let pathname = `.${parsedUrl.pathname}`;
	  var pathname = "" + parsedUrl.pathname;
	  // based on the URL path, extract the file extention. e.g. .js, .doc, ...
	  var ext = path.parse(pathname).ext;
	  // maps file extention to MIME typere
	  var map = {
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
	  res.writeHead("content-type: text/plain");
	  res.end("Resolved path: " + resolvedpath);
	  /*fs.exists(resolvedpath, function (exist) {
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
});

var port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
