/*
https://docs.google.com/document/d/1eKCnKXI9xnoMGRRzOL1xPCBihNV2rOet08qpE_gArAY/edit
https://api.weather.com/v2/pws/observations/current?stationId=IMADRUZZ2&format=json&units=m&apiKey=0daf84ead44348e9af84ead44348e94b
*/
const fs = require('fs');

const _ = require('lodash');
const puppeteer = require("puppeteer");
const NodeCache = require( "node-cache" );
const moment = require('moment');
const GIFEncoder = require('gifencoder');
const pngFileStream = require('png-file-stream');
const tmp = require('tmp');

const toArray = require('stream-to-array')

//TODO move into config
moment.locale('it');

const config = require('./config');
const util = require('./util');

const url = 'https://www.windy.com/?850h,46.000,11.083,10';

const gifFrames = 30;
const gifDelay = 80;
const gifPngsPrefix = 'windy'+_.now().toString().substr(0,9)+'-frame';
const gifEncoder = new GIFEncoder(config.photos.width, config.photos.width);

const cache = new NodeCache({
	stdTTL: config.windy.cache_ttl,
	checkperiod: config.windy.cache_ttl*2
});

async function dayImage(day = 1) {	//return a Buffer
	
	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: {
			width: config.photos.width,
			height: config.photos.width
		},
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});

	const page = await browser.newPage();
	
	await page.goto(url);

	//	https://github.com/puppeteer/puppeteer/blob/v5.4.1/docs/api.md#pagewaitforselectororfunctionortimeout-options-args
	await page.evaluate(() => {
		document
			.querySelectorAll('#search, #mobile-menu, #mobile-calendar, #plugins')
			.forEach((e)=> {
				e.parentNode.removeChild(e);
			})
	});

	await page.waitFor('.leaflet-tile-loaded');

	/*let title = moment().day(day).format('dddd D MMMM');
	await page.evaluate((title) => {
		let a = document.querySelector('.leaflet-control-attribution');
		a.innerHTML = `<big style="font-size:16px;text-transform:capitalize">${title}</big>`;
	}, title);*/

	const element = await page.$('.leaflet-container');

	var pngs = [];
 	for (let i = 0; i<gifFrames; i++) {
		
		const buf = await element.screenshot({
			type: 'png'
		});

		let pngtmp = tmp.tmpNameSync({prefix: gifPngsPrefix+i});

		fs.writeFileSync(pngtmp, buf);

		pngs.push(pngtmp);

		await page.waitFor(gifDelay);
	}

	await browser.close();

	const gifStrem = gifEncoder.createWriteStream({
		repeat: 0,
		delay: gifDelay,
		quality: 8
	});

	const stream = pngFileStream('/tmp/'+gifPngsPrefix+'*')
		.pipe(gifStrem)
	
	//console.log(pngs);

	/*stream.on('finish', () => {
		pngs.forEach( (f) => {
			console.log(f)
			fs.unlink(f);
		});
	});*/

	return toArray(stream).then(function (parts) {
		return Buffer.concat(parts);
	});

/*

	return new Promise((resolve, reject) => {

		//resolve(buf)
		var chunks = [];
		
		stream.on('data', (chunk) => {
			console.log('stream data', chunk)
			
			chunks.push(Buffer.from(chunk)); 
		});

		stream.on('finish', () => {
			
			let data = Buffer.concat(chunks);

			console.log('on stream finish',data)
			
			resolve(data);

		});
	});
	*/
	
	//return encoder.out.getData();
}

module.exports = {

	windNow: function(cb) {
		cb = cb || _.noop;

		/*if(cache.has('nextDays')) {

			cb( cache.get('nextDays') );
		}
		else {*/
			
			dayImage(1).then(image => {
				
				//cache.set('nextDays', image);

				cb(image);
			});
		//}
	}

}
