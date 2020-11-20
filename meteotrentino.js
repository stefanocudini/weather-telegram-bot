/*
https://docs.google.com/document/d/1eKCnKXI9xnoMGRRzOL1xPCBihNV2rOet08qpE_gArAY/edit
https://api.weather.com/v2/pws/observations/current?stationId=IMADRUZZ2&format=json&units=m&apiKey=0daf84ead44348e9af84ead44348e94b
*/
const _ = require('lodash');
const fetch = require('node-fetch');
const puppeteer = require("puppeteer");
const NodeCache = require( "node-cache" );
const moment = require('moment');

//TODO move into config
moment.locale('it');

const config = require('./config');
const util = require('./util');

var url = "https://www.meteotrentino.it/#!/menu?menuItem=1";

const cache = new NodeCache({
	stdTTL: config.meteo.cache_ttl,
	checkperiod: config.meteo.cache_ttl*2
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
	
	//await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

	await page.goto(url);

	//	https://github.com/puppeteer/puppeteer/blob/v5.4.1/docs/api.md#pagewaitforselectororfunctionortimeout-options-args
	
	//await page.waitForSelector(' .leaflet-marker-pane');
	await page.waitFor('.leaflet-marker-icon');
	//await page.waitFor(1000);

	await page.evaluate(() => {
	  document
			.querySelectorAll('.cc_banner-wrapper,.leaflet-control-zoom')
			.forEach((e)=> {
				e.parentNode.removeChild(e);
			})
	});

/*NOT WORK	let title = moment().day(day).format('dddd D MMMM');

	await page.evaluate((title) => {
		let e = document.querySelector('.leaflet-control-attribution');
		e.innerHTML = `<big style="font-size:16px;text-transform:capitalize">${title}</big>`;
	}, title);*/

	//await page.click('.cc_btn.cc_btn_accept_all')
	
	//await page.waitFor(1000);

	await page.click('.btn-group > button:nth-child('+day+')');
	await page.waitFor(100);

	const element = await page.$('.leaflet-container');
	//const element = await page.$('body');

	const out = await element.screenshot({
		type: config.photos.type
	});

	await browser.close();
	
	//TODO await browser.close();
	return out;
}

module.exports = {

	radar: function(cb) {

		fetch(config.meteo.radar_url).then(resp => {
			cb( resp.buffer() )
		});

		resp.body.pipe(process.stdout);

	},

	nextDays: function(cb) {
		cb = cb || _.noop;

		if(cache.has('nextDays')) {

			cb( cache.get('nextDays') );
		}
		else {
			
			Promise.all([
				dayImage(1),
				dayImage(2),
				dayImage(3),
			]).then(images => {
				
				cache.set('nextDays', images);

				cb(images);
			});
		}
	}

}
