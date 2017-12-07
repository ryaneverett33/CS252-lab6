var track = require('../management/track.js')
exports.setHandler = function (req, res, body) {
    /*console.log("Handling login route");
    res.send(200, "Hello world");*/
    console.log("Handling set user route");
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
    var column = json.column;
    var value = json.value;
    var cookie = json.cookie;
    console.log("Cookie: %s", cookie);
    track.setUser(column, value, cookie, function (id) {
        if (id < 0) {
            console.log("Failed to set user");
            res.setHeader("content-type", "application/json");
            res.send(400, JSON.stringify({ result: "fail" }));
            return;
        } else {
            console.log("Successfully set user");
            //successful set user
            res.setHeader("content-type", "application/json");
            res.send(200, JSON.stringify({ result: "success" }));
            return;
        }
    });
}