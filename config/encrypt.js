var crypto = require('crypto');

var encrypt = function(str){
	return crypto.createHash('md5').update(str).digest('hex');
}

module.exports = function(){
	return encrypt;
}