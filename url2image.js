/*
https://docs.google.com/document/d/1eKCnKXI9xnoMGRRzOL1xPCBihNV2rOet08qpE_gArAY/edit
https://api.weather.com/v2/pws/observations/current?stationId=IMADRUZZ2&format=json&units=m&apiKey=0daf84ead44348e9af84ead44348e94b
*/
const _ = require('lodash');
const fetch = require('node-fetch');
const puppeteer = require("puppeteer");
const NodeCache = require( "node-cache" );

const config = require('./config');
const util = require('./lib/util');

const cache = new NodeCache({
	stdTTL: config.meteo.cache_ttl,
	checkperiod: config.meteo.cache_ttl*2
});

async function toImage(url, selector = 'body') {	//return a Buffer

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

	await page.waitFor(selector);
	//await page.waitFor(1000);
	await page.click('#ccon');
	//await page.waitFor(100);
	await page.click('.play-wrapper');
	//await page.waitFor(100);

	const element = await page.$(selector);

	const out = await element.screenshot({
		type: config.photos.type
	});

	await browser.close();

	//TODO await browser.close();
	return out;
}

module.exports = function(url, selector, cb) {
	cb = cb || _.noop;

/*
const cacheKery = `url2image_${}`md5 url;
if(cache.has(cacheKey)) {

		cb( cache.get(cacheKey) );
	}
	else {*/

		toImage(url, selector).then(image => {

			//cache.set(cacheKey, image);

			cb(image);

		})
	//}
}
