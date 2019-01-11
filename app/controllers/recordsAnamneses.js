var tables = ' records_anamneses ra ';

var columns = ' ra.ID_RECORD_ANAMNESE, ra.DESCRIPTION ';

module.exports.select = function (application, req, callback) {
    var err;
    var rows;
    var filter = 'WHERE 1 = ?';
    var parameters = [1];

    if ((req.body.constructor === Object) && (Object.keys(req.body).length > 0)) {
        if (req.body.type == 'searchList') {
            if ((req.body.recordAnamneseDescription != undefined) && (req.body.recordAnamneseDescription != '')) {
                filter = filter + ' AND ra.DESCRIPTION LIKE ?';
                parameters.push(req.body.recordAnamneseDescription);
            }
        }

        if (req.body.type == 'searchOne') {
            if ((req.body.idRecordAnamnese || 0) != 0) {
                filter = filter + ' AND ra.ID_RECORD_ANAMNESE = ?';
                parameters.push(parseInt(req.body.idRecordAnamnese));
            }
        }
    };

    if (req.params.param != undefined) {
        if ((req.params.param != undefined) && (req.params.param != null)) {
            filter = filter + ' AND ra.ID_RECORD_ANAMNESE = ?';
            parameters.push(req.params.param);
        } else {
            filter = filter + ' AND ra.ID_RECORD_ANAMNESE = ?';
            parameters.push(-1);       
        }
    }

    var dao = new application.app.models.dao;

    dao.select(application, tables, columns, filter, parameters, undefined, function (err, rows) {
            callback(err, rows);
        });
}