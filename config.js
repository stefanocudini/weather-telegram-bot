
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
		caching: 1000*60*60*5,	//5 minutes
		apikey: process.env.WU_APIKEY,
	},

	author: process.env.AUTHOR,

	imagesPath: __dirname+'/images/',

	photos: {
		type: 'png', //jpeg
		width: 280,
		height: 200
	},

	i18n: {
		azimuth: "Nord,Nord-NordEst,Nord-Est,Est-NordEst,Est,Est-SudEst,Sud-Est,Sud-SudEst,Sud,Sud-SudOvest,Sud-Ovest,Ovest-SudOvest,Ovest,Ovest-NordOvest,Nord-Ovest,Nord-NordOvest,Nord",
		list: "scrivi /list per l'elenco delle stazioni meteo",
	},

	stations: stations
};