/*
This exists so index isn't poluted with a crap done of require statements
TO ADD A ROUTE
1. Create the route handler in the routes folder
2. Put the proper require statement in this file
3. Add the route delegate in here by exporting it
4. Add the route in index.initRouter() with the proper route (https://www.npmjs.com/package/node-router#route-chaining)
Remember to call your delegate method defined here, and not the route handler itself
*/
var login = require('./routes/login.js');
var create = require('./routes/create.js');
var example = require('./routes/example.js');
var static = require('./routes/static.js');
var get = require('./routes/get.js');
var set = require('./routes/set.js');
var leaderboards = require('./routes/leaderboards.js');

exports.login = function (req, res, nex) {
    console.log("called login");
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        // at this point, `body` has the entire request body stored in it as a string
        login.loginHandler(req, res, body);
    });
}
exports.static = function (req, res, nex) {
    console.log("called static");
    static.staticHandler(req, res);
}
exports.example = function (req, res, nex) {
    console.log("called example");
    example.exampleHandler(req, res);
}
exports.create = function (req, res, nex) {
    console.log("called create user");
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        // at this point, `body` has the entire request body stored in it as a string
        create.createHandler(req, res, body);
    });
}

exports.get = function (req, res, nex) {
    console.log("called get");
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        // at this point, `body` has the entire request body stored in it as a string
        get.getHandler(req, res, body);
    });
}

exports.set = function (req, res, nex) {
    console.log("called set");
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        // at this point, `body` has the entire request body stored in it as a string
        set.setHandler(req, res, body);
    });
}
exports.leaderboards = function (req, res, nex) {
    console.log("called set");
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        // at this point, `body` has the entire request body stored in it as a string
        leaderboards.leaderboardHandler(req, res, body);
    });
}