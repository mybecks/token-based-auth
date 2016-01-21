"use strict";

var express = require('express');
var app = express();
var jwt = require('express-jwt');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var config = require('./config');
var routes = require('./routes/index');
mongoose.connect(config.url);

app.use(morgan('dev'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.set('superSecret', config.secret);
app.use(jwt({ secret: config.secret}).unless({path: ['/api/auth', '/api/public', '/api/setup']}));

app.use('/api', routes.api);

var port = process.env.PORT || 3000;
app.listen(port);
console.log('The magic happens on port ' + port);
