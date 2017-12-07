var track = require('../management/track.js')
exports.getHandler = function (req, res, body) {
    /*console.log("Handling login route");
    res.send(200, "Hello world");*/
    console.log("Handling get user route");
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
    var cookie = json.cookie;
    console.log("Cookie: %s", cookie);
    track.getUser(cookie, function (highscore, wins) {
        var hs = highscore;
        var wns = wins;
        console.log("highscore", hs);
        console.log("wins", wns);
        if (hs < 0 || wns < 0) {
            //couldn't login
            console.log("couldn't get user info");
            res.setHeader("content-type", "application/json");
            res.send(400, JSON.stringify({ error: "Couldn't get user info" }));
            return;
        }
        else {
            //successful get user
            console.log("Successful login");
            res.setHeader("content-type", "application/json");
            res.send(200, JSON.stringify({ highscore: hs, wins: wns }));
            return;
        }
    });
}