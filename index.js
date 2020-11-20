const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');

//TODO move into config
moment.locale('it');

const telegraf = require('telegraf');
const telegram = require('telegraf/telegram');
const telegrafLogger = require('telegraf-update-logger'); 

const config = require('./config');
const wu = require('./weather_underground');
const html2image = require('./html2image');

const meteotrentino = require('./meteotrentino');

const windy = require('./windy');

const elevation = require('./elevation');


const bot = new telegraf(config.bot_token);

bot.use(telegrafLogger({
	//colors: true,
	log: (str) => console.log(moment().format('lll'), str)
}));

bot.start( ctx => {
	console.log('Bot start...');
	ctx.reply(config.i18n.list);
});

bot.command('logs', ctx => {
	if(ctx.from.username!==config.admin) return;
	if(fs.existsSync(__dirname+'/access.log')) {
		ctx.reply(fs.readFileSync(__dirname+'/access.log').toString('utf8'));

		//TODO tail file
	}
});

bot.command(['list','stazioni'], ctx => {
	ctx.reply(wu.list()+"\n\n"+config.i18n.list);
});

bot.command('radar', ctx => {
	ctx.replyWithAnimation({ url: config.meteo.radar_url }).then(()=>{
		ctx.reply(config.i18n.list);
	});
});

bot.command('meteo', ctx => {
	meteotrentino.nextDays((bufs) => {
		let medias = _.map(bufs, (buf, k)=> {
			return {
				media: { source: buf },
				type: 'photo',
				//caption: moment().day(k).format('dddd')
			};
		});

		ctx.replyWithMediaGroup(medias).then(()=>{
			ctx.reply(config.i18n.meteo+config.i18n.list);
		});
	})
});

bot.command('windy', ctx => {
	windy.windNow((buf) => {
		ctx.replyWithPhoto({
			source: buf,
			type: 'photo',
		}).then(()=>{
			ctx.reply(config.i18n.list);
		});
	});
});

bot.command('altitudine', ctx => {
	ctx.reply(config.i18n.elevation);
	
});

bot.on('message', ctx => {
	if(ctx.message.location) {
		elevation.fromLocation(ctx.message.location, res => {
			ctx.reply(res);
		})
	}
})

for(let name in config.stations) {
	
	bot.command(name, ctx => {

		wu.conditions(name, data => {

			let station = config.stations[name];

			data.botInfo = ctx.botInfo;
			data.station = name;

			html2image.dataToImage(data, buf => {

				let medias = [{
					media: { source: buf },
					type: 'photo',
					caption: config.i18n.list//wu.simpleFormat(data)
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

bot.on('message', ctx => {
	ctx.reply(config.i18n.list);
});

bot.launch();
