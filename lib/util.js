
const config = require('../config');

module.exports = {
	azimuth: function(a,long) {
		var ang = parseFloat(a);
		var i = Math.round(ang/22.5);
		var texts = "n,nne,ne,ene,e,ese,se,sse,s,ssw,sw,wsw,w,wnw,nw,nnw,n";
		if(long===true)
			texts = config.i18n.azimuth;
		return texts.split(',')[i];
	}
};
