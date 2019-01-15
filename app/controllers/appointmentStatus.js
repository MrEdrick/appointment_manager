var tablesAppointmentStatus = 'appointment_status ps';

var columnsAppointmentStatus = 'ps.ID_APPOINTMENT_STATUS, ps.DESCRIPTION';


appointmentStatusParse = function (req, callback) {
    try {
        var appointmentStatus = {
            ID_APPOINTMENT_STATUS: parseInt(req.body.idAppointmentStatus),
            DESCRIPTION: req.body.Description
        };

        return callback(null, room);
    } catch (e) {
        return callback(e, null);
    }
}


var appointmentStatusInsertUpdate = function () {

}


var doValidations = function (req, callback) {
    var err;

    req.assert('description', 'Informe a descrição do status').notEmpty();

    err = req.validationErrors();

    callback(err);
}

module.exports.insert = function (application, req, res) {
    let err;
    let erros;

    doValidations(req, function (erros) {
        if (erros) {
            res.send({ validation: erros });
            return;
        } else {
            appointmentStatusParse(req, function (err, room) {
                if (err != null) {
                    res.send({ validation: erros });
                    return;
                } else {
                    appointmentStatusInsertUpdate(new application.app.models.dao, application, appointmentStatus, function (err) {
                        if (err != null) {
                            res.send({ validation: erros });
                            return;
                        } else {
                            res.render('list-appointment-status', { validation: {} });
                        }
                    });
                }
            });
        }
    });
}

module.exports.delete = function (application, req, res) {
    var rows;
    var err;
    var ok;

    if ((req.params.id != '0') && (req.params.id != '')) {
        return;
    }

    dialogs.confirm('Tem certeza que deseja deletar este status?').then(function (ok) {
        if (ok) {
            dao.delete(application, 'appointment_status', 'WHERE ID_APPOINTMENT_STATUS', [parseInt(req.body.idAppointmentStatus)], function (err, res) {
                if (err != undefined) {

                } else {
                    dao.select(application,
                        tablesAppointmentStatus,
                        columnsAppointmentStatus,
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
            res.send({ validation: erros });
            return;
        } else {
            appointmentStatusParse(req, function (err, appointmentStatus) {
                if (err != null) {
                    res.render('edit-appointment-status', { validation: erros });
                    return;
                } else {
                    appointmentStatusInsert(new application.app.models.dao, application, appointmentStatus, function (err) {
                        if (err != null) {
                            res.render('edit-appointment-status', { validation: erros });
                            return;
                        } else {
                            res.render('list-appointment-status', { validation: {} });
                        }
                    });
                }
            });
        }
    });
}

module.exports.select = function (application, req, callback) {
    var err;
    var rows;
    var filter = 'WHERE 1 = ?';
    var parameters = [1];

    if ((req.body.constructor === Object) && (Object.keys(req.body).length > 0)) {
        if (req.body.type == 'searchList') {
            if ((req.body.description != undefined) && (req.body.description != '')) {
                filter = filter + ' AND ps.DESCRIPTION LIKE ?';
                parameters.push(req.body.description);
            }
        }

        if (req.body.type == 'searchOne') {
            if ((req.body.idAppointmentStatus != '0') && (req.body.idAppointmentStatus != '') && (req.body.idAppointmentStatus != undefined)) {
                filter = filter + ' AND ps.ID_APPOINTMENT_STATUS = ?';
                parameters.push(parseInt(req.body.idAppointmentStatus));
            }
        }
    };

    var dao = new application.app.models.dao;

    dao.select(application,
        tablesAppointmentStatus,
        columnsAppointmentStatus,
        filter, parameters, undefined, ' ORDER BY ps.DESCRIPTION ', function (err, rows) { 
            callback(err, rows);
        });
}