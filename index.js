
const _ = require('lodash');

const telegraf = require('telegraf');
const telegram = require('telegraf/telegram');
const telegrafLogger = require('telegraf-update-logger'); 

const config = require('./config');
const weather = require('./weather');
const html2image = require('./html2image');
//TODO require('dotenv').config()

const bot = new telegraf(config.bot_token);

bot.use(telegrafLogger({
	colors: true,
	log: (str) => console.log(new Date().toISOString(), str)
}));

/*var botMe = bot.telegram.getMe();
(async () => {
	console.log('me', await botMe.then())
	
	id: 1319224921,
	  is_bot: true,
	  first_name: 'Bevo Libero Vallelaghi 🌤⛅️🌦🍻',
	  username: 'bevoliberovallelaghi_bot',
	  can_join_groups: true,
	  can_read_all_group_messages: false,
	  supports_inline_queries: false
	  
})();*/

bot.start( ctx => {
	console.log('Bot start...');
	ctx.reply(config.i18n.list);
});

bot.command('list', ctx => {
	ctx.reply(weather.list());
});

for(let name in config.stations) {
	
	bot.command(name, ctx => {

		weather.conditions(name, data => {

			console.log('weather conditions', name, data.date);

			let station = config.stations[name];

			data.botInfo = ctx.botInfo;
			data.station = name;

			html2image(data, buf => {

				let medias = [{
					media: { source: buf },
					type: 'photo',
					caption: config.i18n.list//weather.simpleFormat(data)
				}];
				// https://github.com/telegraf/telegraf/blob/develop/docs/examples/media-bot.js
				if(station.webcam) {
					medias.push({
						//source: res.buffer(),
						media: { url: station.webcam },
						type: 'photo'
					});
				}

				ctx.replyWithMediaGroup(medias);
			});
		});

	});
}

/*bot.command('meteo', ctx => {
	let msg = context.update.message
	let param = msg.text.split(' ')[1];
	console.log('command /meteo', param);
});*/

bot.on('message', ctx => {
	console.log('onMessage',ctx.message.from.username)
	ctx.reply(config.i18n.list);
});

bot.launch();
