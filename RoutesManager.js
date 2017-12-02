/*
This exists so index isn't poluted with a crap done of require statements
TO ADD A ROUTE
1. Create the route handler in the routes folder
2. Put the proper require statement in this file
3. Add the route delegate in here by exporting it
4. Add the route in index.initRouter() with the proper route (https://www.npmjs.com/package/node-router#route-chaining)
Remember to call your delegate method defined here, and not the route handler itself
*/
var login = require('./routes/login');
var create = require('./routes/create');
var example = require('/routes/example');
var static = require('./routes/static');

exports.login = function(req, res, nex) {
    console.log("called login");
    login.loginHandler(req, res);
}
exports.static = function(req, res, nex) {
    console.log("called static");
    static.staticHandler(req, res);
}
exports.example = function(req, res, nex) {
    console.log("called example");
    example.exampleHandler(req, res);
}
exports.create = function(req, res, nex) {
    console.log("called create user");
    create.createHandler(req, res);
}