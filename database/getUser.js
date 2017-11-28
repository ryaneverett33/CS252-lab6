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

function get(name) { 
  pool.acquire(function (err, connection) {
    if (err) {
      console.log(err);
    }
    // If no error, then good to proceed.  
    console.log("Connected!");  
    request = new Request("SELECT Password, Wins, HighScore FROM users WHERE Name=@Name;", function(err) {  
    if (err) {  
        console.log(err);}  
    });  
    request.addParameter('Name', TYPES.NVarChar, name);  

    request.on('row', function(columns) {  
      columns.forEach(function(column) {  
        if (column.value === null) {  
          console.log('NULL');  
        } else {  
          console.log(column.value);  
        }  
      });  
    });       
    connection.execSql(request);   
  });  
}

function query(name) {  
   
}  

exports.get = get;
