/*
	testing cache using throttle
*/
const _ = require('lodash');
const moment = require('moment');

var f = _.throttle(()=> {
		
		var out = moment().format('HH:mm:ss');

		console.log('execute remote request')
		
		return out;

	},5000, {
		//trailing:true,
		leading: true
	});

setInterval(()=>{
	
	var lastv = f();

	console.log('cache value',lastv)

}, 1000);
