var tablesDistrict = 'district di';

var columnsDistrict = 'di.ID_DISTRICT, di.DISTRICT, di.ID_CITY';

module.exports.select = function (application, req, callback) {
    var err;
    var rows;
    var filter = 'WHERE 1 = ?';
    var parameters = [1];

    if ((req.body.constructor === Object) && (Object.keys(req.body).length > 0)) {
        if (req.body.type == 'searchList') {
            if ((req.body.district != undefined) && (req.body.district != '')) {
                filter = filter + ' AND di.DISTRICT LIKE ?';
                parameters.push(req.body.district);
            }

            if ((req.body.idCity != '0') && (req.body.idCity != '') && (req.body.idCity != undefined)) {
                filter = filter + ' AND di.ID_CITY = ?';
                parameters.push(parseInt(req.body.idCity));
            }

        }

        if (req.body.type == 'searchOne') {
            if ((req.body.idDistrict != '0') && (req.body.idDistrict != '') && (req.body.idDistrict != undefined)) {
                filter = filter + ' AND di.ID_DISTRICT = ?';
                parameters.push(parseInt(req.body.idDistrict));
            }
        }
    };

    var dao = new application.app.models.dao;

    dao.select(application,
        tablesDistrict,
        columnsDistrict,
        filter, parameters, undefined, function (err, rows) { 
            callback(err, rows);
        });
}