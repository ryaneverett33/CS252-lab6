var http = require('http');
var Router = require('node-router');
var router = Router();
var route = router.push;
var routesManager = require("./RoutesManager.js");
var pool = require("./database/pool.js");
var io = require("socket.io");
var iomanager = require('./management/iomanager.js');
var server;

//Sets up routing for endpoints
function routerInit() {
	route("POST", "/user/login", routesManager.login);
	route("POST", "/user/create", routesManager.create);
	route(routesManager.static);
}

routerInit();
pool.init();
var port = process.env.PORT || 1337;
server = http.createServer(router);
server.listen(port);
io.listen(server);
iomanager.init(io);
console.log("Server running at http://localhost:%d", port);
