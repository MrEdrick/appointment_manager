var tables = ' answers_anamneses_questions aaq ';

var columns = ' aaq.ID_ANSWER_ANAMNESE_QUESTION, aaq.ANSWER_TOGGLE, ' + 
              ' aaq.ANSWER_DESCRIPT, aaq.ID_ANAMNESE_QUESTION, aaq.ID_PATIENT ';

module.exports.select = function (application, req, callback) {
    var err;
    var rows;
    var filter = 'WHERE 1 = ?';
    var parameters = [1];

    if ((req.body.constructor === Object) && (Object.keys(req.body).length > 0)) {
        if (req.body.type == 'searchList') {
            if ((req.body.answerDescript != undefined) && (req.body.answerDescript != '')) {
                filter = filter + ' AND aaq.ANSWER_DESCRIPT LIKE ?';
                parameters.push(req.body.answerDescript);
            }

            if ((req.body.answerToggle != undefined) && (req.body.answerToggle != '')) {
                filter = filter + ' AND aaq.ANSWER_TOGGLE LIKE ?';
                parameters.push(req.body.answerToggle);
            }

            if ((req.body.idAnamneseQuestion || 0) != 0) {
                filter = filter + ' AND aaq.ID_ANAMNESE_QUESTION = ?';
                parameters.push(parseInt(req.body.idAnamneseQuestion));            
            }

            if ((req.body.idPatient || 0) != 0) {
                filter = filter + ' AND aaq.ID_PATIENT = ?';
                parameters.push(parseInt(req.body.idPatient));            
            }            
        }

        if (req.body.type == 'searchOne') {
            if ((req.body.idQuestionToggle || 0) != 0) {
                filter = filter + ' AND aaq.ID_QUESTION_TOGGLE = ?';
                parameters.push(parseInt(req.body.idQuestionToggle));
            
            }
        }
    };

    if (req.params.param != undefined) {
        if ((req.params.param != undefined) && (req.params.param != null)) {
            filter = filter + ' AND aaq.ID_ANSWER_ANAMNESE_QUESTION = ?';
            parameters.push(req.params.param);
        } else {
            filter = filter + ' AND aaq.ID_ANSWER_ANAMNESE_QUESTION = ?';
            parameters.push(-1);       
        }
    }

    var dao = new application.app.models.dao;

    dao.select(application, tables, columns, filter, parameters, undefined, function (err, rows) {
            callback(err, rows);
        });
}