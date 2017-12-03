var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;
var pool = require('./pool.js');

//callback(boolean) - true if successful add, false if otherwise
function add(name, password, callback) {
  pool.get(function (err, connection) {
    if (err) {
      console.error(err);
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
}


exports.add = add;
