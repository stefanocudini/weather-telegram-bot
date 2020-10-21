const fs = require('fs');
const tmp = require('tmp');
const open = require('open');
const _ = require('lodash');
const nodeHtmlToImage = require('node-html-to-image');
//	https://github.com/frinyvonnick/node-html-to-image
const imgDir = __dirname+'/images/';

var imgLogo = 'data:image/png;base64,'+fs.readFileSync(imgDir+'logo.png', {encoding:'base64'});
var imgWindDial = 'data:image/svg+xml;base64,'+fs.readFileSync(imgDir+'WindDial.svg', {encoding:'base64'});
var imgWindMarker = 'data:image/svg+xml;base64,'+fs.readFileSync(imgDir+'WindMarker.svg', {encoding:'base64'});

var html = new Buffer.from(fs.readFileSync(__dirname+'/image.html')).toString('utf8');

async function getImage(data) {

	_.extend(data, {
		imgLogo: imgLogo,
		imgWindDial: imgWindDial,
		imgWindMarker: imgWindMarker,
	})

	var out = await nodeHtmlToImage({
		html: html,
		content: data,
		//output: outfile,
		//type: 'png', //jpeg
		//quality: 80,
		//transparent: true,
		//encoding: 'base64'
		//puppeteerArgs: {
			//https://github.com/puppeteer/puppeteer/blob/8370ec88ae94fa59d9e9dc0c154e48527d48c9fe/docs/api.md#puppeteerlaunchoptions
		//}
	});
	/*.then(() => {
		console.log('out image', outfile)
		open(outfile);
	});*/
	return out;
}

module.exports = function(data, cb) {
	cb = cb || _.noop;

	getImage(data).then(cb);
};

if (require.main === module) {
 	module.exports(process.argv[2], o => {
		//process.stdout.write(o);
		
		const outfile = tmp.tmpNameSync({prefix:'html2image-', postfix:'.png'});

		fs.writeFileSync(outfile, o)

		open(outfile);
	});
}