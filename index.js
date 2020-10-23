
const telegraf = require('telegraf');
const Telegram = require('telegraf/telegram')
const config = require('./config');
const weather = require('./weather');
const html2image = require('./html2image');
//TODO require('dotenv').config()

//const fetch = require('node-fetch');

const bot = new telegraf(config.bot_token);

const tt = {
	start: "@bevoliberovallelaghi_bot al tuo servizio!🌤🌦🍻",
	cmds: "scrivi /list per l'elenco delle stazioni meteo",
};

bot.start( ctx => {
	console.log('Bot start...');
	ctx.reply(tt.start);
	ctx.reply(tt.cmds);
});

bot.command('list', ctx => {
	ctx.reply(weather.list());
});

for(let name in config.stations) {

	
	
	bot.command(name, ctx => {

		weather.conditions(name, res => {

			let station = config.stations[name];
			
			html2image(res, buf => {

				let medias = [{
					source: buf,
					caption: weather.simpleFormat(res)+"\n\n"+tt.cmds
				}];
				// https://github.com/telegraf/telegraf/blob/develop/docs/examples/media-bot.js
				if(station.webcam) {
					
					console.log('media',station)

					fetch(station.webcam).then(res =>  {
						medias.push({
							source: res.buffer(),
							//media: { url: station.webcam },
							caption: 'webcam',
							//type: 'photo'
						});
						ctx.replyWithMediaGroup(medias);
					});

					
				}
				else
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

bot.on('message', ctx => ctx.reply(tt.cmds));

bot.on('message', ctx => {
	console.log('onMessage',ctx)
});

bot.on('text', ct => {
	text = ct.update.message.text;
	console.log('onText:', process.env);
});

bot.launch();
