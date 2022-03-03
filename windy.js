/*
https://docs.google.com/document/d/1eKCnKXI9xnoMGRRzOL1xPCBihNV2rOet08qpE_gArAY/edit
https://api.weather.com/v2/pws/observations/current?stationId=IMADRUZZ2&format=json&units=m&apiKey=0daf84ead44348e9af84ead44348e94b
*/
const fs = require('fs');

const _ = require('lodash');
const puppeteer = require("puppeteer");
const NodeCache = require( "node-cache" );
const moment = require('moment');

//TODO move into config
moment.locale('it');

const config = require('./config');
const util = require('./lib/util');

const url = 'https://www.windy.com/?850h,46.000,11.083,9';

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

	await page.waitFor('.leaflet-tile-container');

	//	https://github.com/puppeteer/puppeteer/blob/v5.4.1/docs/api.md#pagewaitforselectororfunctionortimeout-options-args
	await page.evaluate(() => {
		var els = [
			'#logo-wrapper',
			'#search',
			'#open-in-app',
			'#mobile-menu',
			'#mobile-calendar'
		];
		document
			.querySelectorAll(els.join())
			.forEach( e => {
				e.parentNode.removeChild(e);
			});
	});

	const element = await page.$('.leaflet-container');

	//await page.waitFor('#plugins');
	//let x = parseInt(config.photos.width / 2);
	//await page.mouse.down(150,150);
	/*await page.evaluate((x) => {
		$('.leaflet-container').trigger('click');
	}, x)*/

	await page.waitFor(3000);

	const buf = await element.screenshot({
		type: 'png'
	});

	await browser.close();

	return buf
}

module.exports = {

	windNow: function(cb) {
		cb = cb || _.noop;

		if(cache.has('windNow')) {

			cb( cache.get('windNow') );
		}
		else {

			dayImage(1).then(image => {

				cache.set('windNow', image);

				cb(image);
			});
		}
	}

}
