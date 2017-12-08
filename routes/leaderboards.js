var getter = require('../database/getLeaderboards.js');

// { "amount" : int}
//how many results are returned, 10 is the minimum
function get(req, res, body) {
    console.log("Handling get leaderboards route");
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
    if (json.amount == null) {
        res.setHeader("content-type", "application/json");
        res.send(400, JSON.stringify({ error: "Invalid Arguments" }));
        return;
    }
    var realamount = json.amount;
    if (realamount < 10) {
        realamount = 10;
    }
    //[ { Name: 'Ric Flair', Wins: 33, HighScore: 41 },
    getter.get(realamount, function(arr) {
        res.setHeader("content-type", "application/json");
        res.send(200, JSON.stringify(arr));
        return;
    });
}

exports.leaderboardHandler = get;