/*
	testing cache using throttle
*/
const _ = require('lodash');
const moment = require('moment');

var f = _.throttle((param, cb)=> {
		
		var out = moment().format('HH:mm:ss');

		console.log('execute remote request', 'param:'+param)
		
		cb(out);

	},5000, {
		//trailing:true,
		leading: true
	});

setInterval(()=>{
	
	f('test', (resp)=>{

		console.log('cache value',resp)	
	});

	

}, 1000);
