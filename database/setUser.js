var ConnectionPool = require('tedious-connection-pool');var Request = require('tedious').Request  
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

function set(column, value, name) { 
  pool.acquire(function (err, connection) {
    // If no error, then good to proceed.  
    //table columns: Id, Name, Password, Wins, HighScore (Id is AUTO_INCREMENT, Name is UNIQUE)
    if (column === 'Password') {
      request = new Request("UPDATE users SET Password = @Value WHERE Name = @Name;", function(err) {  
      if (err) {  
          console.log(err);}  
      });  
      request.addParameter('Value', TYPES.NVarChar , value);  
      request.addParameter('Name', TYPES.NVarChar, name); 
    }

    else if (column === 'Wins') {
      request = new Request("UPDATE users SET Wins = @Value WHERE Name = @Name;", function(err) {  
      if (err) {  
          console.log(err);}  
      }); 
      request.addParameter('Value', TYPES.Int , value);  
      request.addParameter('Name', TYPES.NVarChar, name); 
    }

    else if (column === 'HighScore') {
      request = new Request("UPDATE users SET HighScore = @Value WHERE Name = @Name;", function(err) {  
      if (err) {  
          console.log(err);}  
      });
      request.addParameter('Value', TYPES.Int , value);  
      request.addParameter('Name', TYPES.NVarChar, name);  
    }
    
    request.on('row', function(columns) {  
      columns.forEach(function(column) {  
        if (column.value === null) {  
          console.log('NULL');  
        } else {  
          console.log("User id of inserted item is " + column.value);  
        }  
      });  
    });  
    request.on('done', function () {
      connection.release();
    });      
    connection.execSql(request);  
  });  
}
 

exports.set = set;
