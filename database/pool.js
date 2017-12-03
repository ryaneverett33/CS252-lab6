/*
Use this pool instead of indiviually managing the pool per route
Use get per on('row'), use release on new request()
DO NOT USER RELEASE on on('row')
*/

var ConnectionPool = require('tedious-connection-pool');

var poolConfig;
var connectionConfig;
var pool;

exports.init = function() {
    poolConfig = {
        min: 2,
        max: 10,
        log: true
    };
    
    connectionConfig = {  
      userName: 'dino',  
      password: 'cs252Purdue',  
      server: 'dinodb.database.windows.net',   
      options: {
        encrypt: true, database: 'DinoDb'
      }  
    };
    
    pool = new ConnectionPool(poolConfig, connectionConfig);
    
    pool.on('error', function(err) {
        console.error(err);
        return null;
    });
}
//function (err, connection)
exports.get = function(callback) {
    pool.acquire(callback);
}
exports.release = function(connection) {
    connection.release();
}