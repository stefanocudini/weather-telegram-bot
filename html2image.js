const fs = require('fs');
const _ = require('lodash');
const nodeHtmlToImage = require('node-html-to-image');
//	https://github.com/frinyvonnick/node-html-to-image
const NodeCache = require( "node-cache" );

const config = require('./config');

const cache = new NodeCache({
	stdTTL: config.photos.cache_ttl,
	checkperiod: config.photos.cache_ttl*2
});

var imgLogo = 'data:image/svg+xml;base64,'+fs.readFileSync(config.imagesPath+'logo.svg', {encoding:'base64'});
var imgWindDial = 'data:image/svg+xml;base64,'+fs.readFileSync(config.imagesPath+'WindDial.svg', {encoding:'base64'});
var imgWindMarker = 'data:image/svg+xml;base64,'+fs.readFileSync(config.imagesPath+'WindMarker.svg', {encoding:'base64'});

var html = new Buffer.from(fs.readFileSync(__dirname+'/image.html')).toString('utf8');

async function jsonImage(data) {	//return a Buffer

	_.extend(data, {
		bot_name: config.bot_name,
		author: config.author,
		//
		imgLogo: imgLogo,
		imgWindDial: imgWindDial,
		imgWindMarker: imgWindMarker,
	})

	var out = await nodeHtmlToImage({
		html: html,
		content: data,
		//output: outfile,
		type: config.photos.type,
		//quality: 90,
		//transparent: true,
		//encoding: 'base64'
		puppeteerArgs: {	//	https://github.com/puppeteer/puppeteer/blob/8370ec88ae94fa59d9e9dc0c154e48527d48c9fe/docs/api.md#puppeteerlaunchoptions
			defaultViewport: {
				width: config.photos.width,
				height: config.photos.width
			},
			args: ['--no-sandbox', '--disable-setuid-sandbox']
		//	executablePath: '/usr/bin/google-chrome-stable',
		//	userDataDir: '/home/user/browsers/chrome',
		}
	});
	return out;
}

module.exports = {
	
	//TODO rename jsonToImage
	dataToImage: function(json, cb) {
		cb = cb || _.noop;

		if(cache.has(json.station)) {

			console.log('Cache...', json.station);

			cb( cache.get(json.station) );
		}
		else {
			
			jsonImage(json).then(res => {
				
				cache.set(json.station, res);

				cb( res );	
			});
		}
	}
};