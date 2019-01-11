var tables = ' questions_descript qd ';

var columns = ' qd.ID_QUESTION_DESCRIPT, qd.DESCRIPTION, qd.HAVE_LONG_ANSWER ';

module.exports.select = function (application, req, callback) {
    var err;
    var rows;
    var filter = 'WHERE 1 = ?';
    var parameters = [1];

    if ((req.body.constructor === Object) && (Object.keys(req.body).length > 0)) {
        if (req.body.type == 'searchList') {
            if ((req.body.questionDescriptDescription != undefined) && (req.body.questionDescriptDescription != '')) {
                filter = filter + ' AND qd.DESCRIPTION LIKE ?';
                parameters.push(req.body.anamneseQuestionDescription);
            }
        }

        if (req.body.type == 'searchOne') {
            if ((req.body.idQuestionDescript || 0) != 0) {
                filter = filter + ' AND qd.ID_QUESTION_DESCRIPT = ?';
                parameters.push(parseInt(req.body.idQuestionDescript));
            
            }
        }
    };

    if (req.params.param != undefined) {
        if ((req.params.param != undefined) && (req.params.param != null)) {
            filter = filter + ' AND qd.ID_QUESTION_DESCRIPT = ?';
            parameters.push(req.params.param);
        } else {
            filter = filter + ' AND qd.ID_QUESTION_DESCRIPT = ?';
            parameters.push(-1);       
        }
    }

    var dao = new application.app.models.dao;

    dao.select(application, tables, columns, filter, parameters, undefined, function (err, rows) {
            callback(err, rows);
        });
}