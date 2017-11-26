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

function add(name, password) { 
  connection.on('connect', function(err) {  
    // If no error, then good to proceed.  
    console.log("Connected!");  
    query(name, password); 
  });  
}


function query(name, password) {  
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
  connection.execSql(request); 
}  

exports.add = add;
