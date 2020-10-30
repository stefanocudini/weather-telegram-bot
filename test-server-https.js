
const PORT = 8080;

const https = require('https')
const pem = require('pem')
const express = require('express')
const _ = require('lodash');
const moment = require('moment');

pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
	if (err) {
		throw err
	}
	
	var app = express();

	app.use((req, res, next) => {
		console.log(req.method, req.url);
		console.log(req.headers);
		
		res.end('ciao');

		next();
	});

	https
	.createServer({
		key: keys.serviceKey,
		cert: keys.certificate
	}, app)
	.listen(PORT)
})