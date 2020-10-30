
const fs = require('fs');

require('dotenv').config();

const fileSts = __dirname+'/stations.json';

var stations = {
	'lagolo': {
		id: 'IMADRUZZ2',
		title: 'Lagolo',
	},
	'stivo': {
		id: 'IARCO21',
		title: 'Rifugio Monte Stivo'
	}
};

if(fs.existsSync(fileSts)) {
	try
	{
		stations = JSON.parse(fs.readFileSync(fileSts));
	}
	catch(err) {
		console.error('Error to read', fileSts, err)
	}
}

module.exports = {

	bot_token: process.env.BOT_TOKEN,

	weather: {
		cache_ttl: 60*60*5,	//5 minutes
		apikey: process.env.WU_APIKEY,
	},

	radar: {
		url: 'https://content.meteotrentino.it/dati-meteo/radar/home/mosaico.gif'
	},

	author: process.env.AUTHOR,

	imagesPath: __dirname+'/images/',

	photos: {
		cache_ttl: 60*60*2,	//1 minutes
		type: 'png', //jpeg
		width: 300,
		height: 200
	},

	i18n: {
		azimuth: "Nord,Nord-NordEst,Nord-Est,Est-NordEst,Est,Est-SudEst,Sud-Est,Sud-SudEst,Sud,Sud-SudOvest,Sud-Ovest,Ovest-SudOvest,Ovest,Ovest-NordOvest,Nord-Ovest,Nord-NordOvest,Nord",
		list: "/list per l'elenco delle stazioni meteo\n\n/radar per il radar di meteotrentino",
	},

	stations: stations
};