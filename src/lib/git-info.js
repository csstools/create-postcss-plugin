import githubUser from './github-user';
import gitConfig from './git-config';

// caching
let gituser;

// return parsed git info
export default key => gitConfig.then(
	// ~/.gitconfig user
	async user => {
		if (key in user) {
			// user key
			return user[key];
		} else if (key === 'user') {
			// github api email
			gituser = await (gituser || githubUser(user.email));

			return gituser;
		} else {
			throw `No ${key} in .gitconfig`
		}
	}
);
