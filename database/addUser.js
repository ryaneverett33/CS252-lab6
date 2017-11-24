var Connection = require('tedious').Connection; 
var Request = require('tedious').Request  
var TYPES = require('tedious').TYPES;

var config = {  
  userName: 'yourusername',  
  password: 'yourpassword',  
  server: 'yourserver.database.windows.net',   
  options: {
    encrypt: true, database: 'AdventureWorks'
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
  //table columns: Id, Name, Password, Wins, HighScore, CreateDate (Id is AUTO_INCREMENT, Name is UNIQUE)
  request = new Request("INSERT INTO users OUTPUT INSERTED.Id VALUES (null, @Name, @Password, 0, 0, CURRENT_TIMESTAMP);", function(err) {  
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
        console.log("User id of inserted item is " + column.value);  
      }  
    });  
  });       
  connection.execSql(request);  
}  

exports.add = add;
