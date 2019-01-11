var tables = ' anamneses_questions aq ';

var columns = ' aq.ID_ANAMNESE_QUESTION, aq.DESCRIPTION, ' + 
              ' aq.ID_ANAMNESE, aq.ID_QUESTION_DESCRIPT, aq.ID_QUESTION_TOGGLE ';

module.exports.select = function (application, req, callback) {
    var err;
    var rows;
    var filter = 'WHERE 1 = ?';
    var parameters = [1];

    if ((req.body.constructor === Object) && (Object.keys(req.body).length > 0)) {
        if (req.body.type == 'searchList') {
            if ((req.body.anamneseQuestionDescription != undefined) && (req.body.anamneseQuestionDescription != '')) {
                filter = filter + ' AND aq.DESCRIPTION LIKE ?';
                parameters.push(req.body.anamneseQuestionDescription);
            }

            if ((req.body.idAnamnese || 0) != 0) {
                filter = filter + ' AND aq.ID_ANAMNESE = ?';
                parameters.push(parseInt(req.body.idAnamnese));
            
            }

            if ((req.body.idQuestionDescript || 0) != 0) {
                filter = filter + ' AND aq.ID_QUESTION_DESCRIPT = ?';
                parameters.push(parseInt(req.body.idQuestionDescript));
            
            }

            if ((req.body.idQuestionToggle || 0) != 0) {
                filter = filter + ' AND aq.ID_QUESTION_TOGGLE = ?';
                parameters.push(parseInt(req.body.idQuestionToggle));
            
            }
        }

        if (req.body.type == 'searchOne') {
            if ((req.body.idAnamneseQuestion || 0) != 0) {
                filter = filter + ' AND aq.ID_ANAMNESE_QUESTION = ?';
                parameters.push(parseInt(req.body.idAnamneseQuestion));
            
            }
        }
    };

    if (req.params.param != undefined) {
        if ((req.params.param != undefined) && (req.params.param != null)) {
            filter = filter + ' AND aq.ID_ANAMNESE_QUESTION = ?';
            parameters.push(req.params.param);
        } else {
            filter = filter + ' AND aq.ID_ANAMNESE_QUESTION = ?';
            parameters.push(-1);       
        }
    
    }

    var dao = new application.app.models.dao;

    dao.select(application, tables, columns, filter, parameters, undefined, function (err, rows) {
            callback(err, rows);
        });
}