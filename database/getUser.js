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
    return null;
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

//calls callback(user object)
function get(name, callback) { 
  pool.acquire(function (err, connection) {
    if (err) {
      console.log(err);
      if (callback != null) {
        callback(null);
      }
    }
    // If no error, then good to proceed.  
    console.log("Connected!");  
    request = new Request("SELECT Password, Wins, HighScore FROM users WHERE Name=@Name;", function(err, rowcount) {  
      if (err) {  
          //console.log('err', err);
          if (callback != null) {
            callback(null);
          }
      }
      if (rowcount == 0) {
        //console.log("AFFECTED 0 rows");
        if (callback != null) {
          callback(null);
        }
      }
    });  
    request.addParameter('Name', TYPES.NVarChar, name);  

    request.on('row', function(columns) {  
      /*columns.forEach(function(column) {  
        if (column.value === null) {  
          console.log('NULL');
        } else {  
          console.log(column.value);         
        }  
      });
      console.log(columns[0].value);
      console.log(columns);
      if (callback != null) {
        callback(columns);
      }*/
      var user = fillObject(columns);
      user["name"] = name;
      if (callback != null) {
        callback(user);
      }
    });
    connection.execSql(request);
  });  
}

function query(name) {  
   
}  

exports.get = get;
