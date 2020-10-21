/*
https://docs.google.com/document/d/1eKCnKXI9xnoMGRRzOL1xPCBihNV2rOet08qpE_gArAY/edit
https://api.weather.com/v2/pws/observations/current?stationId=IMADRUZZ2&format=json&units=m&apiKey=0daf84ead44348e9af84ead44348e94b
*/
const _ = require('lodash');
const https = require('https');
const moment = require('moment');
const WeatherUndergroundNode = require('weather-underground-node');

const config = require('./config');
const util = require('./util');

moment.locale('it');

function formatCondition(place, json) {

	if(!json.observations)
		return null;

	let o = json.observations[0];
	let m = json.observations[0].metric;	
	var v = {
		botName: config.bot_name,
		title: config.stations[place].title,
		windSpeed: m.windSpeed,
		windGust: m.windGust,
		windDir: o.winddir - 180,
		windDirH: util.azimut(o.winddir).toUpperCase(),
		temp: m.temp,
		ele: m.elev,  
		date: moment(o.obsTimeLocal).format('LLL'),
		time: moment(o.obsTimeLocal).fromNow()
	};
	return v;
};

module.exports = {

	formatCondition: formatCondition,

	conditions: function(place, cb) {
		cb = cb || _.noop;

		if(config.stations[place]) {

			let id = config.stations[place].id;

			let wu = new WeatherUndergroundNode(config.wu_apikey);

			wu
			.PWSCurrentContitions(id)
			.request(function (err, res) {

				var cond = formatCondition(place, res);

				var text = err ? err.msg : cond;

				cb(text);
			});
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