var tablesDoctor = 'doctors do';

var columnsDoctor = 'do.ID_DOCTOR, do.NAME, do.CRO, do.PHOTO, do.ID_ROOM, do.COMMISSION';

doctorParse = function (req, callback) {
	try {
		var doctor = {
			ID_DOCTOR: parseInt(req.body.idDoctor),
			NAME: req.body.doctorName,
			CRO: req.body.cro,
			PHOTO: req.body.photo,
			COMMISSION: req.body.commission,
			ID_ROOM: req.body.idRoom
		}

		return callback(null, doctor);
	} catch (e) {
		return callback(e, null);
	}
}

var doctorInsertUpdate = function () {

}

var doValidations = function (req, callback) {
	var err;
	
	req.assert('doctor.cro', 'Informe o CRO').notEmpty();

	req.assert('patient.doctorName', 'O nome do doutor').notEmpty();

	err = req.validationErrors();

	callback(err);
}


module.exports.insert = function (application, req, res) {
	var err;
	var erros;

	doValidations(erros);

	if (erros) {
		res.render('edit-doctors', { validation: erros });
		return;
	} else {
		doctorParse(req, function (err, doctor) {
			if (err != null) {
				res.render('edit-doctors', { validation: erros });
				return;
			} else {
				doctorInsertUpdate(new application.app.models.dao, application, doctor, function (err) {
					if (err != null) {
						res.render('edit-doctors', { validation: erros });
						return;
					} else {
						res.render('list-doctors', { validation: {} });
					}
				});
			}
		});
	}

}

module.exports.delete = function (application, req, res) {
	var rows;
	var err;
	var ok;

	if ((req.params.idDoctor != '0') && (req.params.idDoctor != '')) {
		return;
	}

	dialogs.confirm('Tem certeza que deseja deletar este cadastro de dentista?').then(function (ok) {
		if (ok) {
			dao.delete(application, 'doctors', 'WHERE ID_DOCTOR', [parseInt(req.body.idDoctor)], function (err, res) {
				if (err != undefined) {

				} else {
					dao.select(application,
						tablesDoctor,
						columnsDoctor,
						filter, parameters, 0, '', function (err, rows) { });
				}
			});
		}
	}, function () {
		// no 
	})
}

module.exports.update = function (application, req, res) {
	var err;
	var erros;

	doValidations(erros);

	if (erros) {
		res.render('edit-doctors', { validation: erros });
		return;
	} else {
		doctorParse(req, function (err, doctor) {
			if (err != null) {
				res.render('edit-doctors', { validation: erros });
				return;
			} else {
				doctorInsert(new application.app.models.dao, application, doctor, function (err) {
					if (err != null) {
						res.render('edit-doctors', { validation: erros });
						return;
					} else {
						res.render('list-doctors', { validation: {} });
					}
				});
			}
		});
	}
}

module.exports.select = function (application, req, callback) {
	var err;
	var filter = 'WHERE STATUS = ?';
	var parameters = ['A'];

	if ((req.body.constructor === Object) && (Object.keys(req.body).length > 0)) {
		if (req.body.type == 'searchList') {
			if ((req.body.cro != undefined) && (req.body.cro != '')) {
				filter = filter + ' AND do.CRO LIKE ?';
				parameters.push(req.body.cro);
			}

			if ((req.body.name != undefined) && (req.body.name != '')) {
				filter = filter + ' AND do.NAME LIKE ?';
				parameters.push(req.body.name);
			}
		}

		if (req.body.type == 'searchOne') {
			if ((req.body.cro != '') && (req.body.cro != undefined)) {
				filter = filter + ' AND do.CRO = ?';
				parameters.push(parseInt(req.body.cro));
			}
		}
	};

	var dao = new application.app.models.dao;

	dao.select(application,
		tablesDoctor,
		columnsDoctor,
		filter, parameters, undefined, ' ORDER BY do.NAME ', function (err, rows) {
			callback(err, rows);
		});
}