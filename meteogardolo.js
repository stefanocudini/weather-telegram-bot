/*
https://docs.google.com/document/d/1eKCnKXI9xnoMGRRzOL1xPCBihNV2rOet08qpE_gArAY/edit
https://api.weather.com/v2/pws/observations/current?stationId=IMADRUZZ2&format=json&units=m&apiKey=0daf84ead44348e9af84ead44348e94b
*/
const _ = require('lodash');
const fetch = require('node-fetch');

const cheerio = require('cheerio');

const NodeCache = require( "node-cache" );
const moment = require('moment');

//TODO move into config
moment.locale('it');

const config = require('./config');
const util = require('./lib/util');

var url = "https://www.meteogardolo.it/stazioni-meteo/cima-palon-2098-m";
//TODO add id of station

const cache = new NodeCache({
	stdTTL: config.meteo.cache_ttl,
	checkperiod: config.meteo.cache_ttl*2
});


function formatCondition(name, m) {

	const winddir = parseFloat(m['Vento'][1].match(/^.*\((.*)\)$/)[1])
		, date = m.date.match(/^Ultimo aggiornamento:(.*)$/)[1].replace(',','')
		, ele = m.ele.match(/^(.*) m.*$/)[1]

	return {
		title: config.stations[name].title,
		windSpeed: parseFloat(m['Vento'][0]),
		// windGust: m.windGust,
		windDir: winddir,
		windDirh: util.azimuth(winddir),
		windDirH: util.azimuth(winddir, true),
		temp: parseFloat(m['Temperatura'][0]),
		ele: parseInt(ele),
		date: moment(date, 'DD/MM/YYYY HH:mm').format('LLL'),
		time: moment(date, 'DD/MM/YYYY HH:mm').fromNow()
		//webcam: config.stations[name].webcam
	};
};

function getCondition(wid) {

//TODO use wid

	return new Promise(async(resolve, reject) => {

		const response = await fetch(url);
		const body = await response.text();

		const $ = cheerio.load(body);

		let out = {};

		$('.station-wrapper').each((i,el) => {
			const type = $(el).find('.info-title').text();
			if(type && !out[ type ]) {
				out[ type ] = [
					$(el).find('.info-value-uber').text(),
					$(el).find('.info-value-reg').text(),
				];
			}
		});

		out.ele = $('.station-subtitle > span').text();
		out.date = $('.station-subtitle:nth-child(3) > span').text();

		resolve(out);
	});
};

module.exports = {

	conditions: function(name, cb) {
		cb = cb || _.noop;

		if(config.stations[name]) {

			let wid = config.stations[name].wid;

			if(cache.has(wid)) {

				cb( cache.get(wid) );
			}
			else {

				getCondition(wid)
				.then(res => {

					var cond = formatCondition(name, res);

					cache.set(wid, cond);

					cb( cond );
				})
				.catch(err => {
					console.log('ERR',err)
					cb({error: err });
				})
			}

		}
		else
			cb(null);
	}
}

//run by command line
if (require.main === module) {
 	module.exports.conditions(process.argv[2], data => {
 		console.log(JSON.stringify(data,null,2))
 	}, false);
}
