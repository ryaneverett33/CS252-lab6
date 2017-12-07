var ConnectionPool = require('tedious-connection-pool');
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;

var poolConfig = {
    min: 2,
    max: 4,
    log: true
};

var connectionConfig = {  
  userName: 'dino',  
  password: 'cs252Purdue',  
  server: 'dinodb.database.windows.net',   
  options: {
    encrypt: true, database: 'DinoDb'
  }  
};

var pool = new ConnectionPool(poolConfig, connectionConfig);

pool.on('error', function(err) {
    console.error(err);
});

function fillObject(columns) {
  var obj = {};
  for (var i = 0; i < columns.length; i++) {
    var column = columns[i];
    //console.log("name, value", column.metadata.colName, column.value);
      obj[column.metadata.colName] = column.value;
  }
  return obj;
}

function set(column, value, name, callback) { 
  pool.acquire(function (err, connection) {
    // If no error, then good to proceed.  
    //table columns: Id, Name, Password, Wins, HighScore (Id is AUTO_INCREMENT, Name is UNIQUE)
    if (column === 'Password') {
      request = new Request("UPDATE users SET Password = @Value WHERE Name = @Name;", function(err) {  
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
      });  
      request.addParameter('Value', TYPES.NVarChar , value);  
      request.addParameter('Name', TYPES.NVarChar, name); 
    }

    else if (column === 'Wins') {
      request = new Request("UPDATE users SET Wins = @Value WHERE Name = @Name;", function(err) {  
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
      }); 
      request.addParameter('Value', TYPES.Int , value);  
      request.addParameter('Name', TYPES.NVarChar, name); 
    }

    else if (column === 'HighScore') {
      request = new Request("UPDATE users SET HighScore = @Value WHERE Name = @Name;", function(err) {  
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
      });
      request.addParameter('Value', TYPES.Int , value);  
      request.addParameter('Name', TYPES.NVarChar, name);  
    }
    var value = -1;
    request.on('row', function(columns) {  
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
      var user = fillObject(columns);
      //user["name"] = name;
      if (callback != null) {
        console.log("Returning ", user);
        callback(1);
        return;
      }
    });
    request.on('done', function () {
      connection.release();
      callback(value);
      return;
    });      
    connection.execSql(request);  
  });  
}
 

exports.set = set;