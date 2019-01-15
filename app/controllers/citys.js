var tablesCity = 'citys ci';

var columnsCity = 'ci.ID_CITY, ci.CITY, ci.CITY_CODE, ci.ID_STATE';

module.exports.select = function (application, req, callback) {
    var err;
    var rows;
    var filter = 'WHERE 1 = ?';
    var parameters = [1];

    if ((req.body.constructor === Object) && (Object.keys(req.body).length > 0)) {
        if (req.body.type == 'searchList') {
            if ((req.body.city != undefined) && (req.body.city != '')) {
                filter = filter + ' AND ci.CITY LIKE ?';
                parameters.push(req.body.city);
            }

            if ((req.body.idState != '0') && (req.body.idState != '') && (req.body.idState != undefined)) {
                filter = filter + ' AND ci.ID_STATE = ?';
                parameters.push(parseInt(req.body.idState));
            }

            if ((req.body.cityCode != undefined) && (req.body.cityCode != '')) {
                filter = filter + ' AND ci.CITY_CODE LIKE ?';
                parameters.push(req.body.cityCode);
            }
        }

        if (req.body.type == 'searchOne') {
            if ((req.body.idCity != '0') && (req.body.idCity != '') && (req.body.idCity != undefined)) {
                filter = filter + ' AND ci.ID_CITY = ?';
                parameters.push(parseInt(req.body.idCity));
            }
        }
    };

    if ((req.params.param != undefined) && (req.params.param != null)) {
        filter = filter + ' AND ci.ID_STATE = ?';
        parameters.push(req.params.param);
    } else {
        filter = filter + ' AND ci.ID_STATE = ?';
        parameters.push(0);       
    }

    var dao = new application.app.models.dao;

    dao.select(application,
        tablesCity,
        columnsCity,
        filter, parameters, undefined, ' ORDER BY ci.CITY ', function (err, rows) {
            callback(err, rows);
        });
}