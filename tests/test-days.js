
const moment = require('moment');

//TODO move into config
moment.locale('it');
for(let i = 0; i<3; i++)
	console.log( moment().day(i).format('dddd D MMMM') )