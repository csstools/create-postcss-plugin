// tooling
const child_process = require('child_process');

// child_process then-ified
module.exports = (command, options) => new Promise(
	(resolve, reject) => child_process.exec(
		command,
		options,
		(error, stdout, stderr) => error ? reject(stderr) : resolve(stdout)
	)
);
