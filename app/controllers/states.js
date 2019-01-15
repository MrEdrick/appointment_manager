var tablesState = 'states st';

var columnsState = 'st.ID_STATE, st.STATE, st.UF';

module.exports.select = function (application, req, callback) {
    var err;
    var rows;
    var filter = 'WHERE 1 = ?';
    var parameters = [1];

    if ((req.body.constructor === Object) && (Object.keys(req.body).length > 0)) {
        if (req.body.type == 'searchList') {
            if ((req.body.state != undefined) && (req.body.state != '')) {
                filter = filter + ' AND st.STATE LIKE ?';
                parameters.push(req.body.state);
            }
        }

        if (req.body.type == 'searchOne') {
            if ((req.body.idState != '0') && (req.body.idState != '') && (req.body.idState != undefined)) {
                filter = filter + ' AND st.ID_STATE = ?';
                parameters.push(parseInt(req.body.idState));
            }
        }
    };

    var dao = new application.app.models.dao;

    dao.select(application,
        tablesState,
        columnsState,
        filter, parameters, undefined, ' ORDER BY st.STATE ', function (err, rows) { 
            callback(err, rows);
        });
}