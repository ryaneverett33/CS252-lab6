var track = require('../management/track.js');

//takes a cookie|errorcode value and returns if it is an errorcode or cookie
function isErrorCode(value) {
    return (value <= 10 && value >= -10);
}
//Returns an error message (String)
function getErrorMessage(errorcode) {
    //errcodes are from [-10,10]
    //0 - invalid arguments
    //1 - user already exists
    //2 - Failed to add user
    //3 - shit went south
    switch (errorcode) {
        case 0:
            return "Invalid Arguments";
        case 1:
            return "User already exists";
        case 2:
            return "Failed to add user";
        case 3:
        default:
            return "Application error occured";
    }
}

exports.createHandler = function(req, res, body) {
    console.log("called createHandler");
    var json;
    try {
        json = JSON.parse(body);
        if (json == null || json === null) {
            res.setHeader("content-type", "application/json");
            res.send(400, JSON.stringify({ error: "Bad JSON" }));
            return;
        }
    }
    catch (err) {
        console.log(err);
        res.setHeader("content-type", "application/json");
        res.send(400, JSON.stringify({ error: "Bad JSON" }));
        return;
    }
    var username = json.username;
    var password = json.password;
    track.addUser(username, password, function(value) {
        if (isErrorCode(value)) {
            res.setHeader("content-type", "application/json");
            res.send(400, JSON.stringify({ error: getErrorMessage(value) }));
            return;
        }
        else {
            //successfully added user, return cookie
            res.setHeader("content-type", "application/json");
            res.send(200, JSON.stringify({ cookie: value }));
            return;
        }
    });
}