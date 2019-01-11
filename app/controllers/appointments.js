var moment = require('moment');

var tablesAppointment = ' appointments ap ' +
	' INNER JOIN patients pa ON ap.ID_PATIENT = pa.ID_PATIENT ' +
	' LEFT JOIN citys ci ON pa.ID_CITY = ci.ID_CITY ' +
	' LEFT JOIN states st ON ci.ID_STATE = st.ID_STATE ' +
	' INNER JOIN doctors do ON ap.ID_DOCTOR = do.ID_DOCTOR ' +
	' INNER JOIN rooms ro ON ap.ID_ROOM = ro.ID_ROOM ' +
	' INNER JOIN agreements ag ON ap.ID_AGREEMENT = ag.ID_AGREEMENT ' +
	' INNER JOIN appointment_status ps ON ap.ID_APPOINTMENT_STATUS = ps.ID_APPOINTMENT_STATUS ';

var columnsAppointment = 'ap.ID_APPOINTMENT, ps.DESCRIPTION AS APPOINTMENT_STATUS, ap.DATE_HOUR_APPOINTMENT, ap.DATE_HOUR_INSERTION, ' +
	'ap.DESCRIPTION_PROCEDURE, ap.DETAILING_PROCEDURE, ' +
	'pa.ID_PATIENT AS ID_PATIENT_MAIN, pa.NAME AS PATIENT_NAME, pa.RG, pa.CPF, pa.PHOTO AS PATIENT_PHOTO, ' +
	'pa.NUMBER_CARD, pa.PROFISSION, pa.EMAIL, pa.DATE_BIRTH, ' +
	'pa.PHONE, pa.CELL_PHONE,' +
	'pa.ADDRESS_CODE, pa.ADDRESS, pa.ADDRESS_NUMBER, pa.ADDRESS_COMPLEMENT, pa.DISTRICT,' +
	'ci.*, st.*, ' +
	'do.ID_DOCTOR, do.NAME AS DOCTOR_NAME, do.PHOTO AS DOCTOR_PHOTO, do.CRO, ' +
	'ro.ID_ROOM, ro.ROOM_NUMBER, ro.DESCRIPTION AS ROOM_DESCRIPTION, ' +
	'ag.ID_AGREEMENT, ag.REGISTER_NUMBER, ag.DESCRIPTION AS AGREEMENT_DESCRIPTION, ' +
	'ps.ID_APPOINTMENT_STATUS, ps.DESCRIPTION AS APPOINTMENT_STATUS_DESCRIPTION';


appointmentParse = function (req, callback) {
	try {
		var appointment = {
			ID_APPOINTMENT: parseInt(req.body.idAppointment),
			DESCRIPTION_PROCEDURE: req.body.descriptionProcedure,
			DETAILING_PROCEDURE: req.body.detailingProcedure,
			ID_DOCTOR: parseInt(req.body.doctor.idDoctor),
			ID_AGREEMENT: parseInt(req.body.agreement.idAgreement),
			ID_ROOM: parseInt(req.body.room.idRoom),
			ID_APPOINTMENT_STATUS: parseInt(req.body.appointmentStatus.idAppointmentStatus),
			DATE_HOUR_APPOINTMENT: req.body.dateHourAppointment == '' ? 'DATE_HOUR_APPOINTMENT' : moment(req.body.dateHourAppointment, 'DD/MM/YYYY HH:mm:ss').format('YYYY/MM/DD HH:mm:ss'),
			patient: {
				ID_PATIENT: parseInt(req.body.patient.idPatient),
				NAME: req.body.patient.patientName,
				RG: req.body.patient.rg,
				CPF: req.body.patient.cpf,
				NUMBER_CARD: req.body.patient.numberCard,
				PHOTO: req.body.patient.photo,
				PROFISSION: req.body.patient.profission,
				EMAIL: req.body.patient.email,
				ADDRESS_CODE: req.body.patient.addressCode,
				ADDRESS: req.body.patient.address,
				ADDRESS_NUMBER: req.body.patient.addressNumber,
				ADDRESS_COMPLEMENT: req.body.patient.addressComplement,
				DISTRICT: req.body.patient.district,
				ID_CITY: parseInt(req.body.patient.idCity) || 0,
				DATE_BIRTH: req.body.patient.dateBirth == '' ? null : moment(req.body.patient.dateBirth, 'DD/MM/YYYY').format('YYYY/MM/DD'),
				PHONE: req.body.patient.phone,
				CELL_PHONE: req.body.patient.cellPhone,
			},
			toothByTooth: [],
			anamneseAnswer: [],
			patientFiles: [],
			patientFilesDeleted: []
		};

		for (i = 0; i < req.body.patient.toothByTooth.length; i++) {
			appointment.toothByTooth.push({
				TOOTH_NUMBER: req.body.patient.toothByTooth[i].numberTooth,
				TOOTH_DESCRIPTION: req.body.patient.toothByTooth[i].description
			});
		}

		for (i = 0; i < req.body.patient.anamneseAnswer.length; i++) {
			appointment.anamneseAnswer.push({
				ID_ANAMNESE_QUESTION: req.body.patient.anamneseAnswer[i].idAnamneseQuestion,
				ANSWER_DESCRIPT: req.body.patient.anamneseAnswer[i].answerDescript,
				ANSWER_TOGGLE: req.body.patient.anamneseAnswer[i].answerToggle
			});
		}

		let momentDateHourPatientFile;
		let momentDateHourInsertion;

		for (i = 0; i < req.body.patient.patientFiles.length; i++) {
			if (req.body.patient.patientFiles[i].state == 'saved') {
				continue;
			}  

			if (req.body.patient.patientFiles[i].state == 'deleted') {
				appointment.patientFilesDeleted.push({
					ID_PATIENT_FILE: parseInt(req.body.patient.patientFiles[i].idPatientFile),
					DESCRIPTION_UNIQUE: req.body.patient.patientFiles[i].descriptionUnique,
				});				
			} else {
				momentDateHourPatientFile = moment(req.body.patient.patientFiles[i].dateHourPatientFile, 'DD/MM/YYYY HH:mm:ss').isValid();
				momentDateHourInsertion = moment(req.body.patient.patientFiles[i].dateHourInsertion, 'DD/MM/YYYY HH:mm:ss').isValid();
	
				appointment.patientFiles.push({
					ID_PATIENT_FILE: parseInt(req.body.patient.patientFiles[i].idPatientFile),
					DESCRIPTION: req.body.patient.patientFiles[i].description,
					DESCRIPTION_UNIQUE: req.body.patient.patientFiles[i].descriptionUnique,
					DATE_HOUR_PATIENT_FILE: momentDateHourPatientFile ? moment(req.body.patient.patientFiles[i].dateHourPatientFile, 'DD/MM/YYYY HH:mm:ss').format('YYYY/MM/DD HH:mm:ss') : null,
					DATE_HOUR_INSERTION: momentDateHourInsertion ? moment(req.body.patient.patientFiles[i].dateHourInsertion, 'DD/MM/YYYY HH:mm:ss').format('YYYY/MM/DD HH:mm:ss') : null,
					DETAILING: ''
				});
			}
		}

		return callback(null, appointment);
	} catch (e) {
		return callback(e, null);
	}
}

appointmentPatientFilesInsertUpdate = function (dao, application, patientFiles, patientFilesDeleted, idPatient, res, callback) {
	let rows;
	let err;
	let erros;
	let filter;
	let parameters;

	let i = 0;

	let responseInsert = function (err, res) {
		if ((err || 0) != 0) {
			res.render('edit-appointments', { validation: err });
		} else {
			loop(0, null, patientFilesDeleted, 'delete', function (err) {
				responseDelete(err, res);
			});
		}
	}
	
	let responseDelete = function (err, res) {
		if ((err || 0) != 0) {
			res.render('edit-appointments', { validation: err });
			return callback(err);
		} else {
			return callback(null);
		}
	}

	let loop = function (i, err, array, action, callbackLoop) {
		if ((i < array.length) && ((err || 0) == 0)) {
			if (action == 'insert') {
				insertFile(i);	
			} else {
				deleteFile(i);
			}	
		} else {
			callbackLoop(err, res);
		}
	}

	let deleteFile = function (i) {
		dao.delete(application, 'patients_files', 'WHERE ID_PATIENT_FILE = ?', patientFilesDeleted[i].ID_PATIENT_FILE, function (erros, response) {
			if (erros != null) {
				i++;
				loop(i, null, patientFilesDeleted, 'delete', function (err, res) {
					responseDelete(err, res);
				});
				return;
			} else {
				i++;
				loop(i, null, patientFilesDeleted, 'delete', function (err, res) {
					responseDelete(err, res);
				});
				return;
			}
		});


	}

	let insertFile = function (i) {
		patientFiles[i].ID_PATIENT = idPatient;

		rows = null;
		erros = null;
		filter = ' WHERE ID_PATIENT_FILE = ? ';
		parameters = [patientFiles[i].ID_PATIENT_FILE];

		dao.select(application, 'patients_files', 'ID_PATIENT_FILE', filter, parameters, 0,
			function (erros, rows) {
				if (erros != null) {
					loop(0, erros, patientFiles, 'insert');
					return;
				} else {
					if (rows.length == 0) {
						dao.insert(application, 'patients_files', patientFiles[i], '', function (erros, response) {
							if (erros != null) {
								loop(0, erros, patientFiles, '', function (err, res) {
									responseInsert(err, res);
								});
								return;
							} else {
								i++;
								loop(i, null, patientFiles, 'insert', function (err, res) {
									responseInsert(err, res);
								});
								return;
							}
						});
					} else {
						dao.update(application, ' patients_files ',
							' DESCRIPTION = ?, DETAILING = ?, DATE_HOUR_PATIENT_FILE = ?, ID_PATIENT = ? ' + 
							' WHERE ID_PATIENT_FILE = ?',
							'',
							[patientFiles[i].DESCRIPTION, patientFiles[i].DETAILING, 
							 patientFiles[i].DATE_HOUR_PATIENT_FILE, 
							 (parseInt(patientFiles[i].ID_PATIENT) || 0), 
							 patientFiles[i].ID_PATIENT_FILE],
							function (err, res) {
								if (err != null) {
									loop(0, err, patientFiles, '', function (err, res) {
										responseInsert(err, res);
									});
									return;
								} else {
									i++;
									loop(i, null, patientFiles, 'insert', function (err, res) {
										responseInsert(err, res);
									});
									return;
								}
							});
					}
				}
			});
	}

	loop(0, null, patientFiles, 'insert', function (err) {
		responseInsert(err, res);
	});
}

appointmentAnamneseAnswersInsertUpdate = function (dao, application, anamneseAnswer, idPatient, res, callback) {
	let rows;
	let erros;
	let filter;
	let parameters;

	let i = 0;

	let loopInsert = function (i, err) {
		if ((i < anamneseAnswer.length) && ((err || 0) == 0)) {
			insert(i);
		} else {
			if ((err || 0) != 0) {
				res.render('edit-appointments', { validation: err });
				return callback(err);
			} else {
				return callback(null);
			}
		}
	}

	let insert = function (i) {
		anamneseAnswer[i].ID_PATIENT = idPatient;

		rows = null;
		erros = null;
		filter = ' WHERE ID_PATIENT = ? AND ID_ANAMNESE_QUESTION = ? ';
		parameters = [anamneseAnswer[i].ID_PATIENT, anamneseAnswer[i].ID_ANAMNESE_QUESTION];

		dao.select(application, 'answers_anamneses_questions', 'ID_ANSWER_ANAMNESE_QUESTION', filter, parameters, 0,
			function (erros, rows) {
				if (erros != null) {
					loopInsert(0, erros);
					return;
				} else {
					if (rows.length == 0) {
						dao.insert(application, 'answers_anamneses_questions', anamneseAnswer[i], '', function (erros, response) {
							if (erros != null) {
								loopInsert(0, erros);
								return;
							} else {
								i++;
								loopInsert(i, null);
								return;
							}
						});
					} else {
						dao.update(application, ' answers_anamneses_questions ',
							' ANSWER_TOGGLE  = ?, ANSWER_DESCRIPT = ? ' +
							' WHERE ID_ANSWER_ANAMNESE_QUESTION = ? ',
							'',
							[anamneseAnswer[i].ANSWER_TOGGLE, anamneseAnswer[i].ANSWER_DESCRIPT,
							rows[0].ID_ANSWER_ANAMNESE_QUESTION],
							function (err, res) {
								if (err != null) {
									loopInsert(0, err);
									return;
								} else {
									i++;
									loopInsert(i, null);
									return;
								}
							});
					}
				}
			});
	}

	loopInsert(0);
}

appointmentToothByToothInsertUpdate = function (dao, application, toothByTooth, idPatient, res, callback) {
	let rows;
	let erros;
	let filter;
	let parameters;

	let i = 0;

	let loopInsert = function (i, err) {
		if ((i < toothByTooth.length) && ((err || 0) == 0)) {
			insert(i);
		} else {
			if ((err || 0) != 0) {
				res.render('edit-appointments', { validation: err });
				return callback(err);
			} else {
				return callback(null);
			}
		}
	}

	let insert = function (i) {
		toothByTooth[i].ID_PATIENT = idPatient;

		rows = null;
		erros = null;
		filter = ' WHERE ID_PATIENT = ? AND TOOTH_NUMBER = ? ';
		parameters = [toothByTooth[i].ID_PATIENT, toothByTooth[i].TOOTH_NUMBER];

		dao.select(application, 'tooth_by_tooth', 'ID_TOOTH_BY_TOOTH', filter, parameters, 0,
			function (err, rows) {
				if (err != null) {
					loopInsert(0, err);
					return;
				} else {
					if (rows.length == 0) {
						dao.insert(application, 'tooth_by_tooth', toothByTooth[i], '', function (err, response) {
							if (err != null) {
								loopInsert(0, err);
								return;
							} else {
								i++;
								loopInsert(i, null);
								return;
							}
						});
					} else {
						dao.update(application, 'tooth_by_tooth',
							' TOOTH_DESCRIPTION  = ? ' +
							' WHERE ID_TOOTH_BY_TOOTH = ?', 
							'',
							[toothByTooth[i].TOOTH_DESCRIPTION,
							rows[0].ID_TOOTH_BY_TOOTH],
							function (err, res) {
								if (err != null) {
									loopInsert(0, err);
									return;
								} else {
									i++;
									loopInsert(i, null);
									return;
								}
							});
					}
				}
			});
	}

	loopInsert(i);
}

appointmentPatientInsertUpdate = function (dao, application, appointment, res, callback) {
	var rows;
	let erros;
	var filter = 'WHERE 1 = ?';
	var parameters = [1];

	if ((appointment.patient.CPF != undefined) && (appointment.patient.CPF != '')) {
		filter = filter + ' AND CPF = ?';
		parameters.push(appointment.patient.CPF);
	}

	if ((appointment.patient.RG != undefined) && (appointment.patient.RG != '')) {
		filter = filter + ' AND RG = ?';
		parameters.push(appointment.patient.RG);
	}

	if ((appointment.patient.NUMBER_CARD != undefined) && (appointment.patient.NUMBER_CARD != '')) {
		filter = filter + ' AND NUMBER_CARD = ?';
		parameters.push(appointment.patient.NUMBER_CARD);
	}

	if (parameters.length == 1) {
		parameters[0] = 2;
	}

	dao.select(application, 'patients', 'ID_PATIENT', filter, parameters, 0,
		function (err, rows) {
			if (err != null) {
				res.render('edit-appointments', { validation: erros });
				return callback(err);
			} else {
				if (rows.length == 0) {
					dao.insert(application, 'patients', appointment.patient, '', function (err, response) {
						if (err != null) {
							return callback(err, null);
						} else {
							return callback(null, response.insertId);
						}
					});
				} else {
					dao.update(application, 'patients',
						'NAME = ?, RG = ?, CPF = ?, NUMBER_CARD = ?, ' +
						'PHOTO = ?, PROFISSION = ?, EMAIL = ?, ADDRESS_CODE = ?, ' +
						'ADDRESS = ?, ADDRESS_NUMBER = ?, ADDRESS_COMPLEMENT = ?, ' +
						'DISTRICT = ?, ID_CITY = ?, DATE_BIRTH = ?, PHONE = ?, CELL_PHONE = ? ',
						'WHERE ID_PATIENT = ?',
						[appointment.patient.NAME, appointment.patient.RG, appointment.patient.CPF,
						appointment.patient.NUMBER_CARD, appointment.patient.PHOTO,
						appointment.patient.PROFISSION, appointment.patient.EMAIL, appointment.patient.ADDRESS_CODE,
						appointment.patient.ADDRESS, appointment.patient.ADDRESS_NUMBER,
						appointment.patient.ADDRESS_COMPLEMENT, appointment.patient.DISTRICT,
						(parseInt(appointment.patient.ID_CITY) || 0),
						appointment.patient.DATE_BIRTH, appointment.patient.PHONE, appointment.patient.CELL_PHONE,
						parseInt(rows[0].ID_PATIENT)],
						function (err, res) {
							if (err != null) {
								return callback(err);
							} else {
								return callback(null, rows[0].ID_PATIENT);
							}
						});
				}
			}
		});
}

appointmentInsertUpdate = function (dao, application, appointment, res, callback) {
	var insertUpdate = function (dao, application, appointment, idPatient, res, callback) {
		if ((appointment.ID_APPOINTMENT || 0) == 0) {
			dao.insert(application, 'appointments',
				{
					ID_PATIENT: parseInt(idPatient),
					ID_DOCTOR: parseInt(appointment.ID_DOCTOR),
					ID_AGREEMENT: parseInt(appointment.ID_AGREEMENT),
					ID_ROOM: parseInt(appointment.ID_ROOM),
					ID_APPOINTMENT_STATUS: parseInt(appointment.ID_APPOINTMENT_STATUS),
					DESCRIPTION_PROCEDURE: appointment.DESCRIPTION_PROCEDURE,
					DETAILING_PROCEDURE: appointment.DETAILING_PROCEDURE
				}, 
				((appointment.DATE_HOUR_APPOINTMENT || 0) && 
				 (appointment.DATE_HOUR_APPOINTMENT  != 'DATE_HOUR_APPOINTMENT')) ? 
					' DATE_HOUR_APPOINTMENT = ' + "'" + appointment.DATE_HOUR_APPOINTMENT + "'" : 
					' DATE_HOUR_APPOINTMENT = now() ' ,
				function (err, response) {
					if (err != null) {
						return callback(err);
					} else {
						return callback(null);
					}
				});
		} else {
			dao.update(application, 'appointments',
				' ID_PATIENT = ?, ID_DOCTOR = ?, ID_AGREEMENT = ?, ID_ROOM = ?, ' +
				' ID_APPOINTMENT_STATUS = ?, DESCRIPTION_PROCEDURE = ?, DETAILING_PROCEDURE = ?, ' + 
				' DATE_HOUR_APPOINTMENT = ?',
				' WHERE ID_APPOINTMENT = ? ',
				[parseInt(idPatient),
				parseInt(appointment.ID_DOCTOR),
				parseInt(appointment.ID_AGREEMENT),
				parseInt(appointment.ID_ROOM),
				parseInt(appointment.ID_APPOINTMENT_STATUS),
				appointment.DESCRIPTION_PROCEDURE,
				appointment.DETAILING_PROCEDURE,
				appointment.DATE_HOUR_APPOINTMENT,
				parseInt(appointment.ID_APPOINTMENT)],
				function (err, response) {
					if (err != null) {
						return callback(err);
					} else {
						return callback(null);
					}
				});
		}
	};

	appointmentPatientInsertUpdate(dao, application, appointment, res, function (err, idPatient) {
		if (err != null) {
			return callback(err);
		} else {
			if (idPatient == 0) {
				appointmentInsertUpdate(dao, application, appointment, res, function (err) {
					return callback(err);
				});
			} else {
				appointmentPatientFilesInsertUpdate(dao, application, appointment.patientFiles, appointment.patientFilesDeleted, idPatient, res, function (err) {
					if (err != null) {
						return callback(err);
					} else {
						appointmentToothByToothInsertUpdate(dao, application, appointment.toothByTooth, idPatient, res, function (err) {
							if (err != null) {
								return callback(err);
							} else {
								appointmentAnamneseAnswersInsertUpdate(dao, application, appointment.anamneseAnswer, idPatient, res, function (err) {
									if (err != null) {
										return callback(err);
									} else {
										insertUpdate(dao, application, appointment, idPatient, res, function (err) {
											if (err != null) {
												res.render('edit-appointments', { validation: err });
												return callback(err);
											} else {
												return callback(null);
											}
										});
									}
								});
							};
						
						});
					}
				});
			}
		}
	});
}

var doValidations = function (req, callback) {
	var err;
	if ((req.body.patient.cpf.length == 0) && (req.body.patient.rg.length == 0) && (req.body.patient.numberCard.length == 0)) {
		req.assert(['patient.cpf', 'patient.rg', 'patient.number_card'], 'Informe o RG ou o CPF ou o Nº do Cartão').notEmpty();
	}

	req.assert('patient.patientName', 'O nome do pacient deve ser preenchido').notEmpty();

	req.assert('patient.idCity', 'A cidade deve ser escolhida').notEmpty();

	req.assert('doctor.doctorName', 'O nome do dentista deve ser preenchido').notEmpty();

	req.assert('agreement.idAgreement', 'Informe o convênio').notEmpty();

	req.assert('room.idRoom', 'Informe a sala').notEmpty();

	err = req.validationErrors();

	callback(err);
	return;
}

module.exports.insert = function (application, req, res) {
	let err;
	let erros;
	let appointment;

	res.setHeader('Content-Type', 'application/json');

	doValidations(req, function (erros) {
		if (erros) {
			res.send({ validation: erros });
			return;
		} else {
			appointmentParse(req, function (err, appointment) {
				if (err != null) {
					res.send({ validation: erros });
					return;
				} else {
					appointmentInsertUpdate(new application.app.models.dao, application, appointment, res, function (err) {
						if (err != null) {
							res.send({ validation: erros });
							return;
						} else {
							res.send({});
							return;
						}
					});
				}
			});
		}
	});
}

module.exports.delete = function (application, req, res) {
	var err;
	var dao = new application.app.models.dao;

	if ((req.params.id == '0') || (req.params.id == '')) {
		return;
	}

	dao.delete(application, 'appointments', 'WHERE ID_APPOINTMENT = ?', [parseInt(req.params.id) || -1], function (err, result) {
		if (err != undefined) {
			res.send({ validation: err });
			return;
		} else {
			res.send({});
			return;
		}
	});
}

module.exports.update = function (application, req, res) {
	let err;
	let erros;
	let appointment;
	res.setHeader('Content-Type', 'application/json');

	doValidations(req, function (erros) {
		if (erros) {
			res.send({ validation: erros });
			return;
		} else {
			appointmentParse(req, function (err, appointment) {
				if (err != null) {
					res.send({ validation: erros });
					return;
				} else {
					appointmentInsertUpdate(new application.app.models.dao, application, appointment, res, function (err) {
						if (err != null) {
							res.send({ validation: erros });
							return;
						} else {
							res.send({});
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
	var date;

	var index;
	var filter = 'WHERE 1 = ?';
	var parameters = [1];


	if ((req.body.constructor === Object) && (Object.keys(req.body).length > 0)) {
		if (req.body.type == 'searchList') {
			if ((req.body.cpf != undefined) && (req.body.cpf != '')) {
				filter = filter + ' AND pa.CPF LIKE ?';
				parameters.push(req.body.cpf + '%');
			}

			if ((req.body.rg != undefined) && (req.body.rg != '')) {
				filter = filter + ' AND pa.RG LIKE ?';
				parameters.push(req.body.rg + '%');
			}

			if ((req.body.cardNumber != undefined) && (req.body.cardNumber != '')) {
				filter = filter + ' AND pa.NUMBER_CARD LIKE ?';
				parameters.push(req.body.cardNumber + '%');
			}

			if ((req.body.namePatient != undefined) && (req.body.namePatient != '')) {
				filter = filter + ' AND pa.NAME LIKE ?';
				parameters.push(req.body.namePatient + '%');
			}

			if ((req.body.idAppointmentStatus != undefined) && (req.body.idAppointmentStatus != '0')) {
				filter = filter + ' AND ap.ID_APPOINTMENT_STATUS = ?';
				parameters.push(req.body.idAppointmentStatus);
			}

			if ((req.body.cro != undefined) && (req.body.cro != '')) {
				filter = filter + ' AND do.CRO LIKE ?';
				parameters.push(req.body.cro + '%');
			}

			if ((req.body.nameDoctor != undefined) && (req.body.nameDoctor != '')) {
				filter = filter + ' AND do.NAME LIKE ?';
				parameters.push(req.body.nameDoctor + '%');
			}

			if ((req.body.date != undefined) && (req.body.date != '') && (req.body.date.length == 10)) {
				filter = filter + ' AND CAST(ap.DATE_HOUR_INSERTION AS DATE) = ?';
				parameters.push(moment(req.body.date, 'DD/MM/YYYY').format('YYYY/MM/DD'));
			}

			if ((req.body.idAgreement != undefined) && (req.body.idAgreement != '0')) {
				filter = filter + ' AND ap.ID_AGREEMENT = ?';
				parameters.push(req.body.idAgreement);
			}
		}

		if (req.body.type == 'searchOne') {
			if ((req.body.id != '0') && (req.body.id != '') && (req.body.id != undefined)) {
				filter = filter + ' AND ap.ID_APPOINTMENT = ?';
				parameters.push(parseInt(req.body.id));
			}
		}

	}

	if (req.params.param != undefined) {
		if (req.params.param.indexOf('id=') > -1) {
			filter = filter + ' AND ap.ID_APPOINTMENT = ?';
			parameters.push(parseInt(req.params.param.substring(req.params.param.indexOf('=') + 1, req.params.param.length)));
		} else {
			index = parseInt(req.params.param);
		}
	}

	dao.select(application,
		tablesAppointment,
		columnsAppointment,
		filter, parameters, index, function (err, rows) {
			callback(err, rows);
			return;
		});
}