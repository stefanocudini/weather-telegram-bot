
const fetch = require('node-fetch');
const util = require('./util');

module.exports = {

	fromLocation: function(loc, cb) {

		var type = 'dem',
			host = 'https://labs.easyblog.it';

		/*fetch(url).then(res => res.json()).then(json => {
			console.log('response',json)

			cb(json.val)
		});
*/
		(async () => {

			type = 'dem';
			const dem = await fetch(`${host}/maps/geotiff-picker/${type}?lat=${loc.latitude}&lng=${loc.longitude}`);
			type = 'aspect';
			const asp = await fetch(`${host}/maps/geotiff-picker/${type}?lat=${loc.latitude}&lng=${loc.longitude}`);
			
			return Promise.all([dem.json(), asp.json()]).then(res => {
				
				//console.log(res);

				let ele = res[0].val,
					asp = util.azimuth(res[1].val, true);

				cb(`Altitudine: ${ele} metri slm\n`+`Esposizione: ${asp}`)
			});
		})();
	}
}