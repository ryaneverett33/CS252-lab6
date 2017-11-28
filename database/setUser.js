var Connection = require('tedious').Connection; 
var Request = require('tedious').Request  
var TYPES = require('tedious').TYPES;

var config = {  
  userName: 'dino',  
  password: 'cs252Purdue',  
  server: 'dinodb.database.windows.net',   
  options: {
    encrypt: true, database: 'DinoDb'
  }  
};  
var connection = new Connection(config);

function set(column, value, name) { 
  connection.on('connect', function(err) {  
    // If no error, then good to proceed.  
    console.log("Connected!");  
    query(column, value, name);  
  });  
}


function query(column, value, name) {  
  //table columns: Id, Name, Password, Wins, HighScore (Id is AUTO_INCREMENT, Name is UNIQUE)
  console.log(column);
  console.log(value);
  console.log(name);
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
   

  console.log("Executing request...");
  request.on('row', function(columns) {  
    columns.forEach(function(column) {  
      if (column.value === null) {  
        console.log('NULL');  
      } else {  
        console.log("User id of inserted item is " + column.value);  
      }  
    });  
  });       
  connection.execSql(request);  
  console.log("Request completed.");

}  

exports.set = set;
