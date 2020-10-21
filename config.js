
require('dotenv').config();

module.exports = {

	bot_token: process.env.BOT_TOKEN,

	wu_apikey: process.env.WU_APIKEY,

	stations: {
		'lagolo': {
			id: 'IMADRUZZ2',
			title: 'Lagolo decollo',
		},
		'stivo': {
			id: 'IARCO21',
			title: 'Rifugio Monte Stivo'
		},
		'margone': {
			id: 'ITRENTIN86',
			title: 'Margone'
		},
		'torbole': {
			id: 'INAGOTOR2',
			title: 'Torbole'
		}
	}
};