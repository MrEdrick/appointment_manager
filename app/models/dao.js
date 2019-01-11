function DAO(){
}

DAO.prototype.insert = function(application, table, parametersJSON, parametersString, callback){
    application.config.db_connection('INSERT INTO ' + table + ' SET ' + 
                                    (parametersString == '' ? parametersString : parametersString + ',') + ' ? ', 
                                     parametersJSON,  
    function(err, res){
        return callback(err, res);
    });
};    
 

DAO.prototype.select = function(application, table, fields, filter, parameters, index, callback){
    application.config.db_connection('SELECT ' + fields + ' FROM ' + table + ' ' + filter + (index != undefined ? ' LIMIT ' + (index  * 6) + ', 6' : ''), parameters, function(err, rows){
    	return callback(err, rows);
    });
};


DAO.prototype.delete = function(application, table, filter, parameters, callback){
    application.config.db_connection('DELETE FROM ' + table + ' ' + filter, parameters, function(err, res){
    	return callback(err, res);
    });
}; 

DAO.prototype.update = function(application, table, filterUpdate, filterWhere, parameters, callback){
    application.config.db_connection('UPDATE ' + table + ' SET ' + filterUpdate + ' ' + filterWhere, parameters, function(err, res){
    	return callback(err, res);
	});
};

module.exports = function(){
	return DAO;
}