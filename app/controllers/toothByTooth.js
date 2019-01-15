var tablesToothByTooth = 'tooth_by_tooth tt';

var columnsToothByTooth = 'tt.ID_TOOTH_BY_TOOTH, tt.TOOTH_NUMBER, tt.TOOTH_DESCRIPTION, tt.ID_PATIENT';

module.exports.select = function (application, req, callback) {
    var err;
    var rows;
    var filter = 'WHERE 1 = ?';
    var parameters = [1];

    if ((req.body.constructor === Object) && (Object.keys(req.body).length > 0)) {
        if (req.body.type == 'searchList') {
            if ((req.body.toothDescription != undefined) && (req.body.toothDescription != '')) {
                filter = filter + ' AND tt.TOOTH_DESCRIPTION LIKE ?';
                parameters.push(req.body.toothDescription);
            }

            if ((req.body.toothNumber != '0') && (req.body.toothNumber != '') && (req.body.toothNumber != undefined)) {
                filter = filter + ' AND tt.TOOTH_NUMBER= ?';
                parameters.push(parseInt(req.body.toothNumber));
            }

            if ((req.body.idPatient != '0') && (req.body.idPatient != '') && (req.body.idPatient != undefined)) {
                filter = filter + ' AND tt.ID_PATIENT = ?';
                parameters.push(parseInt(req.body.idPatient));
            }
        }

        if (req.body.type == 'searchOne') {
            if ((req.body.idToothByTooth != '0') && (req.body.idToothByTooth != '') && (req.body.idToothByTooth != undefined)) {
                filter = filter + ' AND tt.ID_TOOTH_BY_TOOTH = ?';
                parameters.push(parseInt(req.body.idToothByTooth));
            }
        }
    };

    if (req.params.param != undefined) {
        if ((req.params.param != undefined) && (req.params.param != null)) {
            filter = filter + ' AND tt.ID_PATIENT = ?';
            parameters.push(req.params.param);
        } else {
            filter = filter + ' AND tt.ID_PATIENT = ?';
            parameters.push(-1);
        }
    }


    var dao = new application.app.models.dao;

    dao.select(application,
        tablesToothByTooth,
        columnsToothByTooth,
        filter, parameters, undefined, '', function (err, rows) {
            callback(err, rows);
        });
}