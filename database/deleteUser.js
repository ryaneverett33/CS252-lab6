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

function deleteU(name) { 
  connection.on('connect', function(err) {  
    // If no error, then good to proceed.  
    console.log("Connected!");  
    query(name);  
  });  
}


function query(name) {  
  request = new Request("DELETE FROM users WHERE Name=@Name;", function(err) {  
  if (err) {  
      console.log(err);}  
  });  
  request.addParameter('Name', TYPES.NVarChar, name);        
  connection.execSql(request);  
}  

exports.delete = deleteU;

