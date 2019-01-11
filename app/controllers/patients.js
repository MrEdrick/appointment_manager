var tablesPatient = ' patients pa ' +
	' LEFT JOIN citys ci ON pa.ID_CITY = ci.ID_CITY ' +
	' LEFT JOIN states st ON ci.ID_STATE = st.ID_STATE ' +
	' LEFT JOIN doctors do ON pa.ID_DOCTOR = pa.ID_DOCTOR ';

var columnsPatiente = 'pa.ID_PATIENT, pa.NAME AS PATIENT_NAME, pa.RG, pa.CPF, pa.PHOTO AS PATIENT_PHOTO, ' +
	'pa.NUMBER_CARD, pa.PROFISSION, pa.EMAIL, pa.DATE_BIRTH, ' +
	'pa.PHONE, pa.CELL_PHONE,' +
	'pa.ADDRESS_CODE, pa.ADDRESS, pa.ADDRESS_NUMBER, pa.ADDRESS_COMPLEMENT, pa.DISTRICT,' +
	'ci.*, st.*, ' +
	'do.ID_DOCTOR, do.NAME AS DOCTOR_NAME, do.PHOTO AS DOCTOR_PHOTO, do.CRO';

patientParse = function (req, callback) {
	try {
		var patient = {
			ID_PATIENT: parseInt(req.body.idPatient),
			NAME: req.body.patientName,
			RG: req.body.rg,
			CPF: req.body.cpf,
			PHOTO: req.body.photo,
			NUMBER_CARD: req.body.numberCard,
			PROFISSION: req.body.profission,
			EMAIL: req.body.email,
			ADDRESS_CODE: req.body.addressCode,
			ADDRESS: req.body.address,
			ADDRESS_NUMBER: req.body.addressNumber,
			ADDRESS_COMPLEMENT: req.body.addressComplement,
			DISTRICT: req.body.distrtict,
			ID_DISTRICT: parseInt(rq.body.status.idDistrict),
			DATE_BIRTH: moment(req.body.patient.dateBirth, 'DD/MM/YYYY').format('YYYY/MM/DD'),
			PHONE: req.body.phone,
			CELL_PHONE: req.body.cellPhone,
		};

		return callback(null, patient);
	} catch (e) {
		return callback(e, null);
	}
}

var doValidations = function (req, callback) {
	var err;
	if ((req.body.patient.cpf.length == 0) && (req.body.patient.rg.length == 0) && (req.body.patient.number_card.length == 0)) {
		req.assert(['patient.cpf', 'patient.rg', 'patient.number_card'], 'Informe o RG ou o CPF ou o Nº do Cartão').notEmpty();
	}

	req.assert('patient.patientName', 'O nome do pacient deve ser preenchido').notEmpty();

	err = req.validationErrors();

	callback(err);
}

module.exports.insert = function (application, req, res) {
	let err;
	let erros;

	doValidations(req, function (erros) {
		if (erros) {
			res.render('edit-patients', { validation: erros });
			return;
		} else {
			patientParse(req, function (err, patient) {
				if (err != null) {
					res.render('edit-patients', { validation: erros });
					return;
				} else {
					patientInsertUpdate(new application.app.models.dao, application, patient, function (err) {
						if (err != null) {
							res.render('edit-patients', { validation: erros });
							return;
						} else {
							res.render('list-patients', { validation: {} });
						}
					});
				}
			});
		}
	});
}

module.exports.delete = function (application, req, res) {
	var err;
	var ok;

	if ((req.params.id != '0') && (req.params.id != '')) {
		return;
	}

	dialogs.confirm('Tem certeza que deseja deletar este paciente?').then(function (ok) {
		if (ok) {
			dao.delete(application, 'patients', 'WHERE ID_PATIENT', [parseInt(req.body.idPatient)], function (err, res) {
				if (err != undefined) {

				} else {
					dao.select(application,
						tablesPatient,
						columnsPatiente,
						filter, parameters, 0, function (err, rows) {
							callback(err, rows);
						});
				}
			});
		}
	}, function () {
		// no 
	})
}

module.exports.update = function (application, req, res) {
	let err;
	let erros;

	doValidations(req, function (erros) {
		if (erros) {
			res.render('edit-appointments', { validation: erros });
			return;
		} else {
			appointmentParse(req, function (err, appointment) {
				if (err != null) {
					res.render('edit-appointments', { validation: erros });
					return;
				} else {
					appointmentInsert(new application.app.models.dao, application, appointment, function (err) {
						if (err != null) {
							res.render('edit-appointments', { validation: erros });
							return;
						} else {
							res.render('list-appointments', { validation: {} });
						}
					});
				}
			});
		}
	});
}

module.exports.select = function (application, req, callback) {
	var dao = new application.app.models.dao;

	var err;
	var rows;

	var index = 0;
	var filter = 'WHERE 1 = ?';
	var parameters = [1];

	if ((req.body.constructor === Object) && (Object.keys(req.body).length > 0)) {
		if (req.body.type == 'searchList') {
			if ((req.body.cpf != undefined) && (req.body.cpf != '')) {
				filter = filter + ' AND pa.CPF LIKE ?';
				parameters.push(req.body.cpf);
			}

			if ((req.body.rg != undefined) && (req.body.rg != '')) {
				filter = filter + ' AND pa.RG LIKE ?';
				parameters.push(req.body.rg);
			}
		}

		if (req.body.type == 'searchOne') {
			if ((req.body.idPatient != '0') && (req.body.idPatient != '') && (req.body.idPatient != undefined)) {
				filter = filter + ' AND pa.ID_PATIENT = ?';
				parameters.push(parseInt(req.body.id));
			}

			if ((req.body.cpf != '') && (req.body.cpf != undefined)) {
				filter = filter + ' AND pa.CPF = ?';
				parameters.push(parseInt(req.body.cpf));
			}

			if ((req.body.rg != '') && (req.body.rg != undefined)) {
				filter = filter + ' AND pa.RG = ?';
				parameters.push(parseInt(req.body.rg));
			}

			if ((req.body.numberCard != '') && (req.body.numberCard != undefined)) {
				filter = filter + ' AND pa.NUMBER_CARD = ?';
				parameters.push(parseInt(req.body.numberCard));
			}
		}
	};

	if (req.params.param != undefined) {
		if (req.params.param.indexOf('=') < -1) {
			index = parseInt(req.params.param);		
		} else {
			if (req.params.param.indexOf('cpf=') > -1) {
				filter = filter + ' AND pa.CPF = ?';			
			}
			if (req.params.param.indexOf('rg=') > -1) {
				filter = filter + ' AND pa.RG = ?';			
			}
			if (req.params.param.indexOf('numberCard=') > -1) {
				filter = filter + ' AND pa.NUMBER_CARD = ?';			
			}
			
			parameters.push(parseInt(req.params.param.substring(req.params.param.indexOf('=') + 1, req.params.param.length)));	
		}	
	}

	dao.select(application,
		tablesPatient,
		columnsPatiente,
		filter, parameters, index, function (err, rows) {
			callback(err, rows);
		});
}