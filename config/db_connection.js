var mysql = require('mysql');

var execSQLQuery = function(sqlQry, sqlArray, callback){
  const connection = mysql.createConnection({
    port: 3306,
    host: '127.0.0.1',
 	  user: 'root',
 	  password: 'cpdadmin',
 	  database: 'am'
  });
  
  connection.query(sqlQry, sqlArray, function(err, rows) {
    connection.end();
    
    if (err) {
        callback(err, null);
    } else 
        callback(null, rows);
  }); 
}


module.exports = function(){
  return execSQLQuery;
}