// caching
let gitconfig;
let gituser;

// return parsed git info
module.exports = key => (gitconfig = gitconfig || require('./gitconfig')).then(
	// ~/.gitconfig user
	user => {
		if (key in user) {
			// user key
			return user[key];
		} else if (key === 'user') {
			// github api email
			gituser = gituser || require('./githubuser');

			return gituser(user.email);
		} else {
			throw `No ${key} in .gitconfig`
		}
	}
);
