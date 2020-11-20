
const fetch = require('node-fetch');


module.exports = {

	fromLocation: function(loc, cb) {

		var url = 'https://labs.easyblog.it'+
			  `/maps/geotiff-picker/dem?lat=${loc.latitude}&amp;lng=${loc.longitude}`;

		fetch(url).then(resp => {
			//cb( resp.buffer() )
			console.log(resp.buffer())
		});
		
	}
}