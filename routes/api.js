/* eslint new-cap:0 */
"use strict";

var express = require('express');
var router = express.Router();
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config');

router.post('/auth', function (req, res) {
    User.findOne({
		name: req.body.name
	}, function(err, user) {

		if (err) throw err;

		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {

			// check if password matches
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {

				// if user is found and password is right
				// create a token
				var payload = {
					user: req.body.name
				};
				var token = jwt.sign(payload, config.secret, {
					expiresIn: '10m'
				});

				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}

		}

	});
});

router.get('/', function (req, res) {
    var message = 'Hello ' + req.user.user + ' token expires on ' + new Date(req.user.exp*1000);
    res.status(200).json(message).end();
});

router.get('/public', function (req, res) {
    var obj = {
        message: 'welcome to public'
    };
    res.status(200).json(obj).end();
});

router.get('/setup', function(req, res) {
    var nick = new User({
        name: 'peter',
        password: 'abc123',
        admin: true
    });

      // save the sample user
    nick.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    });
});

module.exports = router;
