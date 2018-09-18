// tooling
const https = require('https');

// return first matching user login from github api
module.exports = email => new Promise(
	(resolve, reject) => {
		// search for users with the specified email address
		https.get({
			hostname: 'api.github.com',
			path: `/search/users?q=${email}+in:email`,
			headers: {
				'Accept': 'application/vnd.github.v3+json',
				'user-agent': 'https://github.com/sindresorhus/gh-got'
			}
		}, response => {
			// initialized response
			let body = '';

			if (response.statusCode !== 200) {
				reject(response.statusCode);
			}

			// during response
			response.on('data', chunk => body += chunk);

			// after response
			response.on('end', () => {
				// parse response
				const results = JSON.parse(body);

				if (results.items && results.items.length) {
					// resolve login if available
					resolve(results.items[0].login);
				} else {
					// reject with notice
					reject('No User Found');
				}
			});
		});
	}
);
