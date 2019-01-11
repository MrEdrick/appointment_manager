var tables = ' questions_toggle qt ';

var columns = ' qt.ID_QUESTION_TOGGLE, qt.DESCRIPTION ';

module.exports.select = function (application, req, callback) {
    var err;
    var rows;
    var filter = 'WHERE 1 = ?';
    var parameters = [1];

    if ((req.body.constructor === Object) && (Object.keys(req.body).length > 0)) {
        if (req.body.type == 'searchList') {
            if ((req.body.questionToggleDescription != undefined) && (req.body.questionToggleDescription != '')) {
                filter = filter + ' AND qt.DESCRIPTION LIKE ?';
                parameters.push(req.body.anamneseToggleDescription);
            }
        }

        if (req.body.type == 'searchOne') {
            if ((req.body.idQuestionToggle || 0) != 0) {
                filter = filter + ' AND qt.ID_QUESTION_TOGGLE = ?';
                parameters.push(parseInt(req.body.idQuestionToggle));
            
            }
        }
    };

    if (req.params.param != undefined) {
        if ((req.params.param != undefined) && (req.params.param != null)) {
            filter = filter + ' AND qt.ID_QUESTION_TOGGLE = ?';
            parameters.push(req.params.param);
        } else {
            filter = filter + ' AND qt.ID_QUESTION_TOGGLE = ?';
            parameters.push(-1);       
        }
    }

    var dao = new application.app.models.dao;

    dao.select(application, tables, columns, filter, parameters, undefined, function (err, rows) {
            callback(err, rows);
        });
}