var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var pool = require('./pool.js');

function fillObject(columns) {
  var obj = {};
  for (var i = 0; i < columns.length; i++) {
    var column = columns[i];
    //console.log("name, value", column.metadata.colName, column.value);
    obj[column.metadata.colName] = column.value;
  }
  return obj;
}

function set(column, newvalue, name, callback) {
  pool.get(function (err, connection) {
    // If no error, then good to proceed.  
    //table columns: Id, Name, Password, Wins, HighScore (Id is AUTO_INCREMENT, Name is UNIQUE)
    var request = null;
    if (column === 'Password') {
      request = new Request("UPDATE users SET Password = @Value WHERE Name = @Name;", function (err, rowcount) {
        if (err) {
          console.log(err);
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
          console.log("Set succeeded");
          //user["name"] = name;
          if (callback != null) {
            pool.release(connection);
            callback(1);
            return;
          }
        }
      });
      request.addParameter('Value', TYPES.NVarChar, newvalue);
      request.addParameter('Name', TYPES.NVarChar, name);
    }

    else if (column === 'Wins') {
      request = new Request("UPDATE users SET Wins = @Value WHERE Name = @Name;", function (err, rowcount) {
        if (err) {
          console.log(err);
          connection.release();
          callback(-1);
          return;
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
          console.log("Set succeeded");
          //user["name"] = name;
          if (callback != null) {
            pool.release(connection);
            callback(1);
            return;
          }
        }
      });
      request.addParameter('Value', TYPES.Int, newvalue);
      request.addParameter('Name', TYPES.NVarChar, name);
    }

    else if (column === 'HighScore') {
      request = new Request("UPDATE users SET HighScore = @Value WHERE Name = @Name;", function (err, rowcount) {
        if (err) {
          console.log(err);
          pool.release(connection);

          callback(-1);
          return;
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
          console.log("Set succeeded");
          //user["name"] = name;
          if (callback != null) {
            pool.release(connection);
            callback(1);
            return;
          }
        }
      });
      request.addParameter('Value', TYPES.Int, newvalue);
      request.addParameter('Name', TYPES.NVarChar, name);
    }
    connection.execSql(request);
  });
}


exports.set = set;