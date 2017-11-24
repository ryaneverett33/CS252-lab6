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

function set(column, value, name) { 
  connection.on('connect', function(err) {  
    // If no error, then good to proceed.  
    console.log("Connected!");  
    query(column, value, name);  
  });  
}


function query(column, value, name) {  
  request = new Request("UPDATE users SET @Column=@Value WHERE Name=@Name;", function(err) {  
  if (err) {  
      console.log(err);}  
  });  
  request.addParameter('Column', TYPES.NVarChar , column);  
  request.addParameter('Value', TYPES.NVarChar , value);  
  request.addParameter('Name', TYPES.NVarChar, name);  

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

exports.set = set;
