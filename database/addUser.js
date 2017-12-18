//var Request = require('tedious').Request
//var TYPES = require('tedious').TYPES;
var pool = require('./pool.js');

//callback(boolean) - true if successful add, false if otherwise
/*function add(name, password, callback) {
  pool.get(function (err, connection) {
    if (err) {
      console.error(err);
      pool.release(connection);
      return;
    }
    // If no error, then good to proceed.  
    //console.log("Connection acquired!");  
    //table columns: Id, Name, Password, Wins, HighScore (Id is AUTO_INCREMENT, Name is UNIQUE)
    request = new Request("INSERT users (Name, Password, Wins, HighScore) OUTPUT INSERTED.Id VALUES (@Name, @Password, 0, 0);", function (err, rowcount) {
      if (err) {
        console.log('err', err);
        if (callback != null) {
          pool.release(connection);
          callback(true);
          return;
        }
      }
      if (rowcount == 0) {
        console.log("AFFECTED 0 rows");
        if (callback != null) {
          pool.release(connection);
          callback(false);
          return;
        }
      }
      else {
        pool.release(connection);
      }
    });
    request.addParameter('Name', TYPES.NVarChar, name);
    request.addParameter('Password', TYPES.NVarChar, password);

    request.on('row', function (columns) {
      columns.forEach(function (column) {
        if (column.value === null) {
          console.log('NULL');
          callback(false);
          return;
        } else {
          console.log(column.value);
          callback(true);
          return;
        }
      });
    });
    connection.execSql(request);
  });
}*/
function add(name, password, callback) {
  //get a connection for multiple queries instead of using pool.query
  pool.get(function(error, connection) {
    if (error) {
      console.error("An error occured adding user to databse: %s", error);
      callback(false);
      return;
    }
    else {
      //console.log(connection);
      //insert and then select
      //request = new Request("INSERT users (Name, Password, Wins, HighScore) OUTPUT INSERTED.Id VALUES (@Name, @Password, 0, 0);", function (err, rowcount) {
      connection.query('INSERT INTO users VALUES (NULL,?,?,0,0);', [name, password], function(error2, results, fields) {
        console.log("queried");
        if (error2) {
          console.error("An error occured adding user to database: %s", error2);
          callback(false);
          try {
            connection.release();
          }
          catch (e) {}
          return;
        }
        else {
          /*
          OkPacket {
          fieldCount: 0,
          affectedRows: 1,
          insertId: 0,
          serverStatus: 2,
          warningCount: 0,
          message: '',
          protocol41: true,
          changedRows: 0 }
          */
          /*if (results.affectedRows == 1) {
            console.log("added user");
          }*/
          if (callback != null) {
            callback(results.affectedRows == 1);
          }
          pool.release(connection);
          return;
        }
      });
    }
  });
}

//DOES NOT CHECK IF USER ALREADY EXISTS
//reason: track already handles checking before calling adding
exports.add = add;
