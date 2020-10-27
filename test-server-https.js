
var https = require('https')
var pem = require('pem')
var express = require('express')

pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
	if (err) {
		throw err
	}
	
	var app = express();

	app.use((req, res, next) => {
		console.log(req.method, req.url);
		console.log(req.headers);
		res.send('o hai!')
		next();
	});

	https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(443)
})