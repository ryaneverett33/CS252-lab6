//var Request = require('tedious').Request;
//var TYPES = require('tedious').TYPES;
var pool = require('./pool.js');
function BoolToInt(value) {
  if (value) {
    return 1;
  }
  else {
    return -1;
  }
}
//callback(boolINT [-1,1])
function set(column, newvalue, name, callback) {
  /*pool.get(function (err, connection) {
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
  });*/
  if (column === 'Password') {
    //"UPDATE users SET Password = @Value WHERE Name = @Name;"
    pool.query("UPDATE users SET Password=? WHERE Name=?;", [newvalue, name], function(error, results, fields){
      if (error) {
        console.error("An error occured when setting user password in database:", error);
        callback(-1);
        return;
      }
      else {
        if (callback != null) {
          callback(BoolToInt(results.affectedRows == 1));
        }
        return;
      }
    });
  }
  else if (column === 'Wins') {
    //"UPDATE users SET Wins = @Value WHERE Name = @Name;"
    pool.query("UPDATE users SET Wins=? WHERE Name=?;", [newvalue, name], function(error, results, fields) {
      if (error) {
        console.error("An error occured when setting user password in database:", error);
        callback(-1);
        return;
      }
      else {
        if (callback != null) {
          callback(BoolToInt(results.affectedRows == 1));
        }
        return;
      }
    });
  }
  else if (column === 'HighScore') {
    //"UPDATE users SET HighScore = @Value WHERE Name = @Name;"
    pool.query("UPDATE users SET HighScore=? WHERE Name=?;", [newvalue, name], function(error, results, fields) {
      if (error) {
        console.error("An error occured when setting user password in database:", error);
        callback(-1);
        return;
      }
      else {
        if (callback != null) {
          callback(BoolToInt(results.affectedRows == 1));
        }
        return;
      }
    });
  }
  else {
    console.error("Set User recieved an invalid column type");
    if (callback != null) {
      callback(-1);
    }
  }
}


exports.set = set;