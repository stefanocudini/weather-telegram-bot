const fetch = require('node-fetch');
//const fileType = require('file-type');
const url = process.argv[2];

console.log('fetch url', url);

(async () => {
	const response = await fetch(url);
	//const buf = await response.buffer();
	//const type = fileType.fromBuffer(buf);

	response.body.pipe(process.stdout);

console.log(response.ok);
console.log(response.status);
console.log(response.statusText);
console.log(response.headers.raw());
console.log(response.headers.get('content-type'));

})();

