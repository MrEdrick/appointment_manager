module.exports.dashboard = function(application, req, res) {
    res.render('dashboard');
}

module.exports.showDashboard = function(application, req, res){
	if (req.session.authorized) {
		res.redirect('dashboard');
	} else {
		res.render('index', {validation: {}});
	}
}

