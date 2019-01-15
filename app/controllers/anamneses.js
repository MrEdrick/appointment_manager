var tables = ' anamneses an ';

var columns = ' an.ID_ANAMNESE, an.DESCRIPTION, an.ID_RECORD_ANAMNESE ';

module.exports.select = function (application, req, callback) {
    var err;
    var rows;
    var filter = 'WHERE 1 = ?';
    var parameters = [1];

    if ((req.body.constructor === Object) && (Object.keys(req.body).length > 0)) {
        if (req.body.type == 'searchList') {
            if ((req.body.anamneseDescription != undefined) && (req.body.anamneseDescription != '')) {
                filter = filter + ' AND an.DESCRIPTION LIKE ?';
                parameters.push(req.body.anamneseDescription);
            }

            if ((req.body.idRecordAnamnese || 0) != 0) {
                filter = filter + ' AND an.ID_RECORD_ANAMNESE = ?';
                parameters.push(parseInt(req.body.idRecordAnamnese));
            
            }
        }

        if (req.body.type == 'searchOne') {
            if ((req.body.idAnamnese || 0) != 0) {
                filter = filter + ' AND an.ID_ANAMNESE = ?';
                parameters.push(parseInt(req.body.idAnamnese));
            }
        }
    };

    if (req.params.param != undefined) {
        if ((req.params.param != undefined) && (req.params.param != null)) {
            filter = filter + ' AND an.ID_ANAMNESE = ?';
            parameters.push(req.params.param);
        } else {
            filter = filter + ' AND an.ID_ANAMNESE = ?';
            parameters.push(-1);       
        }
    }

    var dao = new application.app.models.dao;

    dao.select(application, tables, columns, filter, parameters, undefined, '', function (err, rows) {
            callback(err, rows);
        });
}