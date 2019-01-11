var	fs = require('fs');

var responseHTML = function(req, res){
	var html = req.params.html;
	
	fs.readFile('./app/views/' + html, 'utf8', function(err, content){
		if(err){
			res.status(400).json(err);
			return;
		}
		
		res.writeHead(200, {'Content-Type':'text/html'});
		

		if (req.params.id != undefined) {
			content = content.replace(	'<input class="invisible" name="edit-id" id="edit-id" type="text" value="0">',
							          	'<input class="invisible" name="edit-id" id="edit-id" type="text" value="' + req.params.id + '">'); 
		}

		res.end(content);
	});
}

var responseFile = function(req, res, action){
	var pathFile = req.params.file.substring(req.params.file.indexOf('-') + 1, req.params.file.lastIndexOf('-'));
	var typeFile = req.params.file.substring(0, req.params.file.indexOf('-'));
	var file = req.params.file;

	if (action == 'insert') {
		fs.readFile('./app/public/uploads/' + typeFile + '/' + pathFile  + '/' + file, function(err, content){
			if(err){
				res.status(400).json(err);
				return;
			}
			
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end('<img class="img-' + pathFile + '" name="img-' + pathFile + '-' + file + '" id="img-' + pathFile  + '-' + file + '"  src="data:image/jpeg;base64, ' + new Buffer(content).toString('base64') + '">');
		});
	}

	if (action == 'delete') {
		fs.exists('./app/public/uploads/' + typeFile + '/' + pathFile  + '/' + file, (exist) => {
			if (exist) {
				fs.unlinkSync('./app/public/uploads/' + typeFile + '/' + pathFile  + '/' + file, function(err) {
					if (err) {
						res.status(200).json(err);
						return;
					}
				});
			}
		});
	}

}

module.exports = function(application){
	
	application.get('/dashboard', function(req, res){
		
		if (req.session.authorized == false) {
			application.app.controllers.index.index(application, req, res);	
		};

		application.app.controllers.dashboard.dashboard(application, req, res);	
	});

	application.get('/app/html/:html', function(req, res){
		responseHTML(req, res);
	});	

	application.get('/app/html/:html/:id', function(req, res){
		responseHTML(req, res);
	});	

	application.get('/app/public/uploads/:file', function(req, res){
		responseFile(req, res, 'insert');
	});	

	application.delete('/app/public/uploads/:file', function(req, res){
		responseFile(req, res, 'delete');
	});	

}
