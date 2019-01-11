var tablesRoom = 'rooms ro';

var columnsRoom = 'ro.ID_ROOM, ro.DESCRIPTION';


roomParse = function (req, callback) {
    try {
        var room = {
            ID_ROOM: parseInt(req.body.idRoom),
            DESCRIPTION: req.body.Description
        };

        return callback(null, room);
    } catch (e) {
        return callback(e, null);
    }
}


var roomInsertUpdate = function () {

}


var doValidations = function (req, callback) {
    var err;

    req.assert('description', 'Informe a descrição do sala').notEmpty();

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
            roomParse(req, function (err, room) {
                if (err != null) {
                    res.send({ validation: erros });
                    return;
                } else {
                    roomInsertUpdate(new application.app.models.dao, application, room, function (err) {
                        if (err != null) {
                            res.send({ validation: erros });
                            return;
                        } else {
                            res.render('list-rooms', { validation: {} });
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
            dao.delete(application, 'rooms', 'WHERE ID_ROOM', [parseInt(req.body.idRoom)], function (err, res) {
                if (err != undefined) {

                } else {
                    dao.select(application,
                        tablesRoom,
                        columnsRoom,
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
            res.send({ validation: erros });
            return;
        } else {
            roomParse(req, function (err, appointment) {
                if (err != null) {
                    res.render('edit-rooms', { validation: erros });
                    return;
                } else {
                    roomInsert(new application.app.models.dao, application, room, function (err) {
                        if (err != null) {
                            res.render('edit-rooms', { validation: erros });
                            return;
                        } else {
                            res.render('list-rooms', { validation: {} });
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
                filter = filter + ' AND ro.DESCRIPTION LIKE ?';
                parameters.push(req.body.description);
            }
        }

        if (req.body.type == 'searchOne') {
            if ((req.body.idRoom != '0') && (req.body.idRoom != '') && (req.body.idRoom != undefined)) {
                filter = filter + ' AND ro.ID_ROOM = ?';
                parameters.push(parseInt(req.body.idRoom));
            }
        }
    };

    var dao = new application.app.models.dao;

    dao.select(application,
        tablesRoom,
        columnsRoom,
        filter, parameters, undefined, function (err, rows) { 
            callback(err, rows);
        });
}