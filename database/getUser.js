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

function get(name) { 
  connection.on('connect', function(err) {
    if (err) {
      console.log(err);
    }
    // If no error, then good to proceed.  
    console.log("Connected!");  
    query(name);  
  });  
}

function query(name) {  
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
}  

exports.get = get;
