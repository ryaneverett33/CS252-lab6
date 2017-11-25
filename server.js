const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const port = process.argv[2] || 9000;
var gameRoot = "/testingKyle/";

//C:\Users\Ryan\Repositories\CS252-lab6\testingKyle

http.createServer(function (req, res) {
  //console.log(`${req.method} ${req.url}`);
  //console.log("{0} {1}".format(req.method, req.url));
	console.log(req.method + " " + req.url);
  
  // parse URL
  const parsedUrl = url.parse(req.url);
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
  });


}).listen(parseInt(port));

//console.log(`Server listening on port ${port}`);
console.log("Server listening on port", port);
console.log(path);