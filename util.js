
module.exports = {
	azimut: function(ang) {
		var texts = "n,nne,ne,ene,e,ese,se,sse,s,ssw,sw,wsw,w,wnw,nw,nnw,n";
		return texts.split(',')[Math.round(parseFloat(ang)/22.5)];
	}
};