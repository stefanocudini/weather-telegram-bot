
const fs = require('fs');
const { spawn } = require('child_process');

const tmp = require('tmp');

const config = require('./config');

const meteotrentino = require('./meteotrentino');

meteotrentino.nextDays((bufs) => {

	for(let i in bufs) {
		
		let buf = bufs[i];
		
		let outfile = tmp.tmpNameSync({prefix:'html2image-', postfix: '_'+i+'.png'});

		fs.writeFileSync(outfile, buf);

		var child = spawn('shotwell', [outfile]);
		
	}

	//setTimeout(()=> {
	//	child.kill();
	//}, 30000)

});

//});