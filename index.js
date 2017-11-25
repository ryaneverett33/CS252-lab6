var http = require('http');

var server = http.createServer(function(request, response) {
	var message = "Request: " + request + "\n";
	message += "Cwd: " + process.cwd() + "\n";
	message += "HELLO BITCHES" + "\n";
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end(message);

});

var port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
