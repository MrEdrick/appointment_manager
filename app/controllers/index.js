module.exports.index = function(application, req, res) {
    res.render('index', {validation: {}});
}

module.exports.authenticate = function(application, req, res){

	req.assert('login', 'Login não pode ser vazio').notEmpty();
	req.assert('password', 'Senha não pode ser vazia').notEmpty();

	var erros = req.validationErrors();

	if (erros){
		res.render('index', {validation: erros});
		return;
	}

	var password = application.config.encrypt(req.body.password);

	var userDao = new application.app.models.user_dao;
	userDao.authenticate(application, [req.body.login, password], function(err, result){
		if (err){
			res.render('index', {validation: erros});
			return;
		}

    	if (result.length > 0) {
			req.session.authorized = true;
			req.session.user = result[0].user;
			res.render('dashboard', {validation: {}});
			return;
    	} else {
			res.render('index', {validation: {}});
			return;    		
    	}
	});
}