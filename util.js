
module.exports = {
	azimut: function(a) {
		var ang = parseFloat(a);
		var i = Math.round(ang/22.5);
		var texts = "n,nne,ne,ene,e,ese,se,sse,s,ssw,sw,wsw,w,wnw,nw,nnw,n";
		return texts.split(',')[i];
	}
};
