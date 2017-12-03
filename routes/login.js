var jsonBody = require('body/json');
var track = require('../management/track.js')
exports.loginHandler = function (req, res, body) {
    /*console.log("Handling login route");
    res.send(200, "Hello world");*/
    console.log("Handling login route");
    var json;
    try {
        json = JSON.parse(body);
        if (json == null) {
            res.setHeader("content-type", "application/json");
            res.send(400, JSON.stringify({ error: "Bad JSON" }));
            return;
        }
    }
    catch(err) {
        res.setHeader("content-type", "application/json");
        res.send(400, JSON.stringify({ error: "Bad JSON" }));
        return;
    }
    console.log("Body: %s", body);
    console.log("json: %s", json);
    var username = json.username;
    var password = json.password;
    console.log("Username: %s, Password: %s", username, password);
    track.login(username, password, function (result) {
        var cookie = result;
        console.log("cookie", cookie);
        if (cookie === 0 || cookie == 0) {
            //couldn't login
            console.log("Invalid login");
            res.setHeader("content-type", "application/json");
            res.send(400, JSON.stringify({ error: "Invalid username or password" }));
            return;
        }
        else {
            //successful login
            console.log("Successful login");
            res.setHeader("content-type", "application/json");
            res.send(200, JSON.stringify({ cookie: cookie }));
            return;
        }
    });
}