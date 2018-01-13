var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var pool = require('./pool.js');

/*function fillObject(columns) {
    var obj = {};
    for (var i = 0; i < columns.length; i++) {
        var column = columns[i];
        //console.log("name, value", column.metadata.colName, column.value);
        obj[column.metadata.colName] = column.value;
    }
    return obj;
}*/
function fillUser(results) {
    //Name, Wins, HighScore
    /*
    var user = {
          Id : results[0].Id,
          Name : results[0].Name,
          Password : results[0].Password,
          Wins : results[0].Win,
          HighScore : results[0].HighScore
        }
    */
    if (results == null || results.Name == null || results.Wins == null || results.HighScore == null) {
        return null;
    }
    return {
        Name : results.Name,
        Wins : results.Wins,
        HighScore : results.HighScore
    };
}

//calls callback(user object[])
//[ { Name: 'Ric Flair', Wins: 33, HighScore: 41 },
function get(count, callback) {
    /*pool.get(function (err, connection) {
        var arr = [];
        if (err) {
            console.log(err);
            if (callback != null) {
                pool.release(connection);
                callback(null);
                return;
            }
        }
        // If no error, then good to proceed.  
        console.log("Connected!");
        //SELECT Top 10 Name, Wins, HighScore FROM Users Order By HighScore DESC;
        request = new Request("SELECT Top " + count.toString() + " Name, 
Wins, HighScore FROM users Order By HighScore Desc;", function (err, 
rowcount) {
            if (err) {
                console.log('err', err);
                if (callback != null) {
                    pool.release(connection);
                    callback(null);
                    return;
                }
            }
            if (rowcount == 0) {
                console.log("AFFECTED 0 rows");
                if (callback != null) {
                    pool.release(connection);
                    callback(null);
                    return;
                }
            }
            else {
                //return here
                pool.release(connection);
                if (callback != null) {
                    callback(arr);
                    return;
                }
            }
        });
        //request.addParameter('count', TYPES.SmallInt, count);
        request.on('row', function (columns) {
            var user = fillObject(columns);;
            arr.push(user);
        });
        connection.execSql(request);
    });*/
    //SELECT Name, Wins, HighScore FROM Users Order By Highscore Desc Limit 10;
    pool.query("SELECT Name, Wins, HighScore FROM users Order By Highscore Desc Limit ?;", [count], function (error, results, fields) {
        if (error) {
            console.error("Failed to get leaderboards, error: %s", error);
            callback(null);
            return;
        }
        else {
            if (results.length == 0) {
                if (callback != null) {
                    callback([]);
                    return;
                }
            }
            else {
                //fill array
                //var arr = new Array(count);
                var arr = new Array(); //account for nulls
                for (var i = 0; i < count; i++) {
                    var user = fillUser(results[i]);
                    if (user == null) {
                        continue;
                    }

                    arr.push(user);
                }
                if (callback != null) {
                    callback(arr);
                    return;
                }
            }
        }
    })
}


exports.get = get;
