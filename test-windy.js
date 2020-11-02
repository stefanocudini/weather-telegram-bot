/**
//REQUIRE apt install gifsicle

*/
const fs = require('fs');
const { spawn } = require('child_process');

const tmp = require('tmp');

const config = require('./config');

const windy = require('./windy');

windy.windNow((buf) => {

	//if(!buf) return;

	let outfile = tmp.tmpNameSync({prefix:'windy2image-', postfix: '.gif'});

	fs.writeFileSync(outfile, buf);

	var child = spawn("gifview", ["-a", outfile]);


	/*setTimeout(()=> {
		//child.kill();
		fs.unlink(outfile);
	}, 5000)*/

});

//});