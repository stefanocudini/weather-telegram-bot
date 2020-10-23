
const fs = require('fs');
const { spawn } = require('child_process');

const tmp = require('tmp');

const config = require('./config');
const weather = require('./weather');
const html2image = require('./html2image');

var place = 'panarotta';

const testW = {
	"observations": [
		{
			"stationID": "ITRENTIN86",
			"obsTimeUtc": "2020-10-20T13:45:00Z",
			"obsTimeLocal": "2020-10-20 15:45:00",
			"neighborhood": "Margone",
			"softwareType": "WeatherDisplay:10.37R",
			"country": "IT",
			"solarRadiation": null,
			"lon": 10.960914,
			"realtimeFrequency": null,
			"epoch": 1603201500,
			"lat": 46.068172,
			"uv": null,
			"winddir": 186,
			"humidity": 76,
			"qcStatus": -1,
			"metric": {
				"temp": 10,
				"heatIndex": 10,
				"dewpt": 6,
				"windChill": 9,
				"windSpeed": 5,
				"windGust": 8,
				"pressure": 1026.41,
				"precipRate": 0.0,
				"precipTotal": 0.0,
				"elev": 949
			}
		}
	]
};
var res = null;
//weather.conditions(place, res => {

	if(res==null) {
		
		testW.observations[0].winddir = parseInt(process.argv[2]);
		
		console.log(testW)

		res = weather.formatCondition(place, testW);
	}

	html2image(res, (buf, html) => {

		let outfile = tmp.tmpNameSync({prefix:'html2image-', postfix:'.png'});

		fs.writeFileSync(outfile, buf);

		var child = spawn('shotwell', [outfile]);
		
		setTimeout(()=> {
			child.kill();
		},10000)

	});

//});