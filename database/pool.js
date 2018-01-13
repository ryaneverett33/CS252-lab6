/*
Use this pool instead of indiviually managing the pool per route
Use get per on('row'), use release on new request()
DO NOT USER RELEASE on on('row')
*/

var mysql = require('mysql');

//var ConnectionPool = require('tedious-connection-pool');

var pool;

exports.init = function() {
    /*connectionConfig = {  
      userName: 'dino',  
      password: 'cs252Purdue',  
      server: 'dinodb.database.windows.net',   
      options: {
        encrypt: true, database: 'DinoDb'
      }  
    };*/
    
    pool = mysql.createPool({
        connectionLimit : 10,
        host : 'dinodash.scheduleit.duckdns.org',
        user : 'dino',
        password : 'cs252Purdue',
        database : 'DinoDb',
	    port : 3306
    });
}
//callback (err, connection)
exports.get = function(callback) {
    //callback(pool.getConnection(callback));
    pool.getConnection(callback);
}
exports.release = function(connection) {
    connection.release();
}
//callback = function(error,results,fields)
exports.query = function(sql, callback) {
    pool.query(sql, callback);
}
exports.query = function(sql, values, callback) {
    pool.query(sql, values, callback);
}
