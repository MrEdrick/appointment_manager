var express = require('express'),
	consign = require('consign'),
	expressValidator = require('express-validator'),
	expressSession = require('express-session'),
	bodyParser = require('body-parser'),
	multiparty = require('connect-multiparty'),
	constants = require('constants'),
	moment = require('moment'),
	dialogs = require('dialogs');

var app = express();

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(express.static('./app/public'));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(multiparty({limit: '50mb'}));
app.use(expressValidator());

app.use(expressSession({
	secret: 'edrick421914199314400033andrea',
	resave: false,
	saveUninitialized: false
}));

app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "content-type");
	res.setHeader("Access-Control-Allow-Credentials", true);

	next();
});

consign()
	.include('./app/routes')
	.then('./app/models')
	.then('./config/db_connection.js')
	.then('./config/encrypt.js')
	.then('./app/controllers')
	.into(app);

module.exports = app;