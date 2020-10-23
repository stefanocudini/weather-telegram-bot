const fs = require('fs');
const _ = require('lodash');
const nodeHtmlToImage = require('node-html-to-image');
//	https://github.com/frinyvonnick/node-html-to-image
const imgDir = __dirname+'/images/';

var imgLogo = 'data:image/svg+xml;base64,'+fs.readFileSync(imgDir+'logo.svg', {encoding:'base64'});
var imgWindDial = 'data:image/svg+xml;base64,'+fs.readFileSync(imgDir+'WindDial.svg', {encoding:'base64'});
var imgWindMarker = 'data:image/svg+xml;base64,'+fs.readFileSync(imgDir+'WindMarker.svg', {encoding:'base64'});

var html = new Buffer.from(fs.readFileSync(__dirname+'/image.html')).toString('utf8');

async function getImage(data) {	//return a Buffer

	_.extend(data, {
		imgLogo: imgLogo,
		imgWindDial: imgWindDial,
		imgWindMarker: imgWindMarker,
	})

	var out = await nodeHtmlToImage({
		html: html,
		content: data,
		//output: outfile,
		type: 'png', //jpeg
		//quality: 90,
		//transparent: true,
		//encoding: 'base64'
		puppeteerArgs: {	//	https://github.com/puppeteer/puppeteer/blob/8370ec88ae94fa59d9e9dc0c154e48527d48c9fe/docs/api.md#puppeteerlaunchoptions
			defaultViewport: {
				width: 300,
				height: 180
			},
			args: ['--no-sandbox', '--disable-setuid-sandbox']
		//	executablePath: '/usr/bin/google-chrome-stable',
		//	userDataDir: '/home/user/browsers/chrome',
		}
	});
	return out;
}

module.exports = function(data, cb) {
	cb = cb || _.noop;

	getImage(data).then(cb);
};