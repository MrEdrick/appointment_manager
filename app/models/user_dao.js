function UserDAO(){
}

UserDAO.prototype.authenticate = function(application, paramters, callback){
	var dao = new application.app.models.dao;
	var password = application.config.encrypt('teste');

	dao.select(application,'users', '*', 'WHERE LOGIN = ? AND PASSWORD = ?', ['teste', password], 0, '', function(err, res){
		if (err != null) {
			return callback(err, res);
		}
		
		if (res.length == 0){
			dao.insert(application,'users', {LOGIN: 'teste', PASSWORD: password}, '', function(err, res){
				dao.select(application,'users', '*', 'WHERE LOGIN = ? AND PASSWORD = ?', paramters, 0, '', function(err, res){
					return callback(err, res);
				});
			});
		} else {
			dao.select(application,'users', '*', 'WHERE LOGIN = ? AND PASSWORD = ?', paramters, 0, '', function(err, res){
				return callback(err, res);
			});
		}
	});
}

module.exports = function(){
	return UserDAO;
}