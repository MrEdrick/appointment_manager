var tablesAgreement = 'agreements ag';

var columnsAgreement = 'ag.ID_AGREEMENT, ag.DESCRIPTION';


agreementParse = function (req, callback) {
    try {
        var agreement = {
            ID_AGREEMENT: parseInt(req.body.idAgreement),
            DESCRIPTION: req.body.Description
        };

        return callback(null, agreement);
    } catch (e) {
        return callback(e, null);
    }
}

var agrementInsertUpdate = function () {

}

var doValidations = function (req, callback) {
    var err;

    req.assert('description', 'Informe a descrição do convênio').notEmpty();

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
            agreementParse(req, function (err, appointment) {
                if (err != null) {
                    res.send({ validation: erros });
                    return;
                } else {
                    agreementInsertUpdate(new application.app.models.dao, application, appointment, function (err) {
                        if (err != null) {
                            res.send({ validation: erros });
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

module.exports.delete = function (application, req, res) {
    var rows;
    var err;
    var ok;

    if ((req.params.id != '0') && (req.params.id != '')) {
        return;
    }

    dialogs.confirm('Tem certeza que deseja deletar esta consulta?').then(function (ok) {
        if (ok) {
            dao.delete(application, 'appointments', 'WHERE ID_APPOINTMENT', [parseInt(req.body.id)], function (err, res) {
                if (err != undefined) {

                } else {
                    dao.select(application,
                        tablesAgreement,
                        columnsAgreement,
                        filter, parameters, 0, '', function (err, rows) { });
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
            agreementParse(req, function (err, appointment) {
                if (err != null) {
                    res.render('edit-agreements', { validation: erros });
                    return;
                } else {
                    agreementInsert(new application.app.models.dao, application, appointment, function (err) {
                        if (err != null) {
                            res.render('edit-agreements', { validation: erros });
                            return;
                        } else {
                            res.render('list-agreements', { validation: {} });
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
                filter = filter + ' AND ag.DESCRIPTION LIKE ?';
                parameters.push(req.body.description);
            }
        }

        if (req.body.type == 'searchOne') {
            if ((req.body.idAgreement != '0') && (req.body.idAgreement != '') && (req.body.idAgreement != undefined)) {
                filter = filter + ' AND ap.ID_AGREEMENT = ?';
                parameters.push(parseInt(req.body.idAgreement));
            }
        }
    };

    var dao = new application.app.models.dao;

    dao.select(application,
        tablesAgreement,
        columnsAgreement,
        filter, parameters, undefined, ' ORDER BY ag.DESCRIPTION ', function (err, rows) { 
            callback(err, rows);
        });
}