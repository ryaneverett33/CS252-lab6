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


function add(name, password) { 
  pool.acquire(function (err, connection) {
    if (err) {
      console.error(err);
      return;
    }  
    // If no error, then good to proceed.  
    console.log("Connection acquired!");  
    //table columns: Id, Name, Password, Wins, HighScore (Id is AUTO_INCREMENT, Name is UNIQUE)
    request = new Request("INSERT users (Name, Password, Wins, HighScore) OUTPUT INSERTED.Id VALUES (@Name, @Password, 0, 0);", function(err) {  
    if (err) {  
        console.log(err);}  
    });  
    request.addParameter('Name', TYPES.NVarChar, name);  
    request.addParameter('Password', TYPES.NVarChar , password);  

    request.on('row', function(columns) {  
      columns.forEach(function(column) {  
        if (column.value === null) {  
          console.log('NULL');  
        } else {  
          console.log(column.value);  
        }  
      });  
    });
    request.on('done', function () {
      connection.release();
    });  
    connection.execSql(request); 
  });  
}


exports.add = add;
