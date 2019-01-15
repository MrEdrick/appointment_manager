var fs = require('fs');

var moment = require('moment');

var tables = ' patients_files pf ';

var columns = ' pf.ID_PATIENT_FILE, pf.DESCRIPTION_UNIQUE, pf.DESCRIPTION, ' +
              ' pf.DETAILING,  pf.DATE_HOUR_PATIENT_FILE, ' +
              ' pf.DATE_HOUR_INSERTION, pf.ID_PATIENT ';

var documentsPath = './app/public/uploads/patients/documents/';

patientFileParse = function (req, callback) {
    try {
        var patientFile = {
            ID_PATIENT_FILE: parseInt(req.body.idPatientFile),
            DESCRIPTION_UNIQUE: req.body.descriptionUnique,
            DESCRIPTION: req.body.description || '',
            DETAILING: req.body.detailing || '',
            DATE_HOUR_INSERTION: moment(req.body.dateHourInsertion).format('YYYY-MM-DD HH:mm'),
            DATE_HOUR_PATIENT_FILE: moment(req.body.dateHourPatientFile).format('YYYY-MM-DD HH:mm'),
            ID_PATIENT: parseInt(req.body.idPatient || 0),
        };

        return callback(null, patientFile);
    } catch (e) {
        return callback(e, null);
    }
}

var doValidations = function (req, callback) {
    var err;
        
    err = req.validationErrors();

    callback(err);
}

patientFileInsertUpdate = function (dao, application, patientFile, res, callback) {
	var rows;
	let erros;
	var filter = 'WHERE 1 = ?';
	var parameters = [1];

	if ((patientFile.ID_PATIENT_FILE || 0) != 0) {
		filter = filter + ' AND ID_PATIENT_FILE = ?';
		parameters.push(patientFile.ID_PATIENT_FILE);
	}

	if ((patientFile.ID_PATIENT || 0) != 0) {
		filter = filter + ' AND ID_PATIENT = ?';
		parameters.push(patientFile.ID_PATIENT);
    }

	if ((patientFile.DESCRIPTION_UNIQUE || 0) != 0) {
		filter = filter + ' AND DESCRIPTION_UNIQUE = ?';
		parameters.push(patientFile.DESCRIPTION_UNIQUE);
    }

	if (parameters.length == 1) {
		parameters[0] = 2;
	}

	dao.select(application, 'patients_files', 'ID_PATIENT_FILE', filter, parameters, 0, '',
		function (err, rows) {
			if (err != null) {
				res.render('edit-appointments', { validation: erros });
				return callback(err);
			} else {
				if (rows.length == 0) {
					dao.insert(application, 'patients_files', patientFile, '', function (err, response) {
						if (err != null) {
							return callback(err, null);
						} else {
							return callback(null, response.insertId);
						}
					});
				} else {
					dao.update(application, 'patients_files',
						' DESCRIPTION = ?, DETAILING = ?, DATE_HOUR_PATIENTE_FILE = ?, ID_PATIENT = ? ',
                        [patientFile.DESCRIPTION, patientFile.DETAILING, 
                         patientFile.DATE_HOUR_PATIENTE_FILE, (parseInt(patientFile.ID_PATIENT) || 0)],
						function (err, res) {
							if (err != null) {
								return callback(err);
							} else {
								return callback(null, rows[0].ID_PATIENT_FILE);
							}
						});
				}
			}
		});
}

module.exports.upload = function (application, req, res) {
    fs.rename(req.files.file.path, documentsPath + req.body.descriptionUnique, function(err) {
        if (err) {
            res.status(500).json({error: err});
        } else {
            res.status(200).json({});
        } 

    });
}

module.exports.insert = function (application, req, res) {
    let err;
    let erros;
    let patientFile;

    doValidations(req, function (erros) {
        if (erros) {
            res.render('edit-patients', { validation: erros });
            return;
        } else {
            patientFileParse(req, function (err, patientFile) {
                if (err != null) {
                    res.render('edit-patients', { validation: erros });
                    return;
                } else {
                    patientFileInsertUpdate(new application.app.models.dao, application, patientFile, function (err) {
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

    dialogs.confirm('Tem certeza que deseja deletar este arquivo?').then(function (ok) {
        if (ok) {
            dao.delete(application, 'patientsFiles', 'WHERE ID_PATIENT_FILE', [parseInt(req.body.idPatientFile)], function (err, res) {
                if (err != undefined) {

                } else {
                    dao.select(application,
                        tables,
                        columns,
                        filter, parameters, 0, '', function (err, rows) {
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
            patientFileParse(req, function (err, patientFile) {
                if (err != null) {
                    res.render('edit-appointments', { validation: erros });
                    return;
                } else {
                    patientFileInsertUpdate(new application.app.models.dao, application, patientFile, function (err) {
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

module.exports.select = function (application, req, callback) {
    var dao = new application.app.models.dao;

    var err;
    var rows;

    var index = 0;
    var filter = 'WHERE 1 = ?';
    var parameters = [1];

    if ((req.body.constructor === Object) && (Object.keys(req.body).length > 0)) {
        if (req.body.type == 'searchList') {
            if ((req.body.idPatient || 0) == 0) {
                filter = filter + ' AND pf.ID_PATIENT = ?';
                parameters.push(req.body.idPatient);
            }

            if ((req.body.patientFileDescription || 0) == 0) {
                filter = filter + ' AND pf.DESCRIPTION LIKE ?';
                parameters.push(req.body.patientFileDescription);
            }

			if ((req.body.date != undefined) && (req.body.date != '') && (req.body.date.length == 10)) {
				filter = filter + ' AND CAST(ap.DATE_HOUR_APPOINTMENT AS DATE) = ?';
				parameters.push(moment(req.body.date, 'DD/MM/YYYY').format('YYYY/MM/DD'));
			}
        }

        if (req.body.type == 'searchOne') {
            if ((req.body.idPatientFile || 0) == 0) {
                filter = filter + ' AND pf.ID_PATIENT_FILE = ?';
                parameters.push(parseInt(req.body.idPatientFile));
            }
        }
    };

    if ((req.params.param != undefined) && (req.params.param != '0')) {
        if (req.params.param.indexOf('=') < -1) {
            index = parseInt(req.params.param);
        } else {
            if (req.params.param.indexOf('idPatient=') > -1) {
                filter = filter + ' AND pf.ID_PATIENT = ?';
            }

            parameters.push(parseInt(req.params.param.substring(req.params.param.indexOf('=') + 1, req.params.param.length)));
        }
    } else {
        parameters[0] = -1;
    }

    dao.select(application,
        tables,
        columns,
        filter, parameters, index, '', function (err, rows) {
            callback(err, rows);
        });
}