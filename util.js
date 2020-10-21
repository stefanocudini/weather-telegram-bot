
module.exports = {
	azimut: function(ang) {
		var texts = "n,nne,ne,ene,e,ese,se,sse,s,ssw,sw,wsw,w,wnw,nw,nnw,n";
		return ang ? texts.split(',')[Math.round(ang/22.5)] : '';
	}
};