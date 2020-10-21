
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

	wu_apikey: process.env.WU_APIKEY,

	stations: stations
};