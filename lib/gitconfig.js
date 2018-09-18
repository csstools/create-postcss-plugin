// tooling
const fs   = require('./fs');
const os   = require('os');
const path = require('path');

// parsing
const iniLine    = /\s*\n+\s*/;
const iniHeading = /^\[\s*(.*)\s*\]$/;
const iniValue   = /^\s*([^\s]*)\s*=\s*(.*)\s*$/;

// caching
const iniObject = {};

let iniCurrent = iniObject;

// read ~/.gitconfig
module.exports = fs.readFile(path.resolve(os.homedir(), '.gitconfig'), 'utf8').then(
	// parse gitconfig as object
	content => content.split(iniLine).map(
		item => {
			if (iniHeading.test(item)) {
				// create subgroup
				iniCurrent = iniObject[item.replace(iniHeading, '$1')] = {};
			} else {
				// assign to subgroup
				iniCurrent[item.replace(iniValue, '$1')] = item.replace(iniValue, '$2');
			}
		}
	)
).then(
	() => {
		if ('user' in iniObject) {
			// return user group
			return iniObject.user;
		} else {
			throw 'No user object in .gitconfig';
		}
	}
);
