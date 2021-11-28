/*
https://docs.google.com/document/d/1eKCnKXI9xnoMGRRzOL1xPCBihNV2rOet08qpE_gArAY/edit
https://api.weather.com/v2/pws/observations/current?stationId=IMADRUZZ2&format=json&units=m&apiKey=0daf84ead44348e9af84ead44348e94b
*/
const _ = require('lodash');
const https = require('https');
const moment = require('moment');
const WeatherUndergroundNode = require('weather-underground-node');
const NodeCache = require('node-cache');

const config = require('./config');
const util = require('./lib/util');

moment.locale('it');

const cache = new NodeCache({
	stdTTL: config.weather.cache_ttl,
	checkperiod: config.weather.cache_ttl*2
});

function formatCondition(name, json) {
	if(!json.observations)
		return null;

	let o = json.observations[0];
	let m = json.observations[0].metric;

	return {
		title: config.stations[name].title,
		windSpeed: m.windSpeed,
		windGust: m.windGust,
		windDir: o.winddir - 180,
		windDirh: util.azimuth(o.winddir),
		windDirH: util.azimuth(o.winddir, true),
		temp: m.temp,
		ele: m.elev,
		date: moment(o.obsTimeLocal).format('LLL'),
		time: moment(o.obsTimeLocal).fromNow(),
		webcam: config.stations[name].webcam
	};
};

function getCondition(wid) {

	return new Promise((resolve, reject) => {

		let wu = new WeatherUndergroundNode(config.weather.apikey);

		//console.log('WU request...',wid)

		wu
		.PWSCurrentContitions(wid)
		.request(function(err, response) {
			//_.get(response,'observations[0].obsTimeUtc')
			if(err) {
				reject(err);
			}
			else {
				resolve(response);
			}
		});

	});
};

module.exports = {

	formatCondition,

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
					cb({error: err });
				})
			}

		}
		else
			cb(null);
	},

	list: function() {
		return _.map(Object.keys(config.stations), k => {
			return '/'+k;
		}).join("\n\n");
	},

	simpleFormat: function(data) {
		_.templateSettings.escape = /\{(.+?)\}/g;

		var ttmpl = "{title}\nVento {windSpeed}km/h \nRaffica {windGust}km/h \nDirezione {windDir} {windDirH} \nTemperatura {temp}°C \n{date}";
		var mtmpl = _.template(ttmpl);

		return mtmpl(data);
	}
}

//run by command line
if (require.main === module) {
 	module.exports.conditions(process.argv[2], data => {
 		console.log(JSON.stringify(data))
 	}, false);
}
