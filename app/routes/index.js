var err;
var rows;

module.exports = function (application) {
	application.get('/', function (req, res) {
		application.app.controllers.index.index(application, req, res);
	});

	application.get('/authenticate', function (req, res) {
		if (req.session.authorized == false) {
			application.app.controllers.index.index(application, req, res);
		};
	});

	application.post('/authenticate', function (req, res) {
		application.app.controllers.index.authenticate(application, req, res);
	});

	application.get('/:route/:param?', function (req, res) {
		if (req.params.route == 'favicon.ico') {
			return;
		}

		let selectResponse = function (err, rows) {
			res.setHeader('Content-Type', 'application/json');
			if (err != undefined) {
				res.write(JSON.stringify(err));
			} else {
				res.write(JSON.stringify(rows));
			};

			res.end();
		}

		let route = require('../controllers/' + req.params.route + '.js');

		route.select(application, req, selectResponse);
	});

	application.delete('/:route/:id?', function (req, res) {
		switch (req.params.route) {
			case 'appointments':
				application.app.controllers.appointments.delete(application, req, res);
				break;
		}
	});

	application.post('/:route', function (req, res) {
		let selectResponse = function (err, rows) {
			res.setHeader('Content-Type', 'application/json');
			if (err != undefined) {
				res.write(JSON.stringify(err));
			} else {
				res.write(JSON.stringify(rows));
			};

			res.end();
		}

		let route = require('../controllers/' + req.params.route + '.js');

		if ((req.body.type == 'searchList') || (req.body.type == 'searchOne')) {
			route.select(application, req, selectResponse);
		} else {
			if (req.body.type == 'insert') {
				route.insert(application, req, res);
			}

			if (req.body.type == 'update') {
				route.update(application, req, res);
			}


			if (req.body.type == 'upload') {
				route.upload(application, req, res);
			}
		}
	});

	application.patch('/:route', function (req, res) {

		switch (req.params.route) {
			case 'appointments':
				application.app.controllers.appointments.update(application, req, res);
				break;
		}
	});

}