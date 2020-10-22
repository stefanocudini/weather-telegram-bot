
const telegraf = require('telegraf');
const Telegram = require('telegraf/telegram')
const config = require('./config');
const weather = require('./weather');
const html2image = require('./html2image');
//TODO require('dotenv').config()


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

for(let id in config.stations) {
	
	bot.command(id, ctx => {

//TODO replyWithVoice
		
		/*html2image(id, buf => {
			ctx.replyWithPhoto({
				source: buf
			});
		});*/

		weather.conditions(id, res => {
			
			html2image(res, buf => {
				ctx.replyWithPhoto({
					source: buf
				}, {
					caption: weather.simpleFormat(res)+"\n\n"+tt.cmds
				})
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

bot.on('text', ct => {
	text = ct.update.message.text;
	console.log('onText:', process.env);
});

bot.launch();
