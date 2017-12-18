//var Request = require('tedious').Request;
//var TYPES = require('tedious').TYPES;
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

//calls callback(user object)
/*function get(name, callback) {
  pool.get(function (err, connection) {
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
    request = new Request("SELECT Password, Wins, HighScore FROM users WHERE Name=@Name;", function (err, rowcount) {
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
        pool.release(connection);
      }
    });
    request.addParameter('Name', TYPES.NVarChar, name);
    var obj = {};
    request.on('row', function (columns) {*/
      /*columns.forEach(function(column) {  
        /*if (column.value === null) {  
          console.log('NULL');  
        } else {
          console.log(column.value);
          obj[column] = column.value;  
        }  
      });*/
      //console.log(columns[0].value);
      //console.log(columns);
      /*if (callback != null) {
        callback(columns);
      }*/
      /*var user = fillObject(columns);
      user["name"] = name;
      if (callback != null) {
        console.log("Returning ", user);
        callback(user);
        return;
      }
    });
    connection.execSql(request);
  });
}*/
function get(name, callback) {
  pool.query('SELECT * FROM users WHERE Name=?;', [name], function(error, results, fields) {
    if (error) {
      console.error("An error occured getting user: %s",error);
      callback(null);
      return;
    }
    if (results.length == 0) {
      if (callback != null) {
        callback(null);
        return;
      }
    }
    else {
      if (callback != null) {
        /*
        Id: 37,
        Name: 'demoUser3',
        Password: 'password',
        Wins: 1,
        HighScore: 3
        */
        var user = {
          Id : results[0].Id,
          Name : results[0].Name,
          Password : results[0].Password,
          Wins : results[0].Win,
          HighScore : results[0].HighScore
        }
        callback(user);
        return;
      }
    }
  });
}

exports.get = get;
