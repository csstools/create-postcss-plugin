import path from 'path';
import args from './lib/args';
import color from './lib/color';
import copyTemplateDir from './lib/copy-template-dir';
import { exec, pipeExec } from './lib/exec';
import gitInfo from './lib/git-info';
import question from './lib/question';

async function main() {
	await updateArgs();
	await createTemplate();
}

async function updateArgs() {
	if (!args.to) {
		args.to = './';
	}

	// --date, or formatted date
	if (!args.date) {
		args.date = new Date(Date.now()).toLocaleDateString('en-US', {
			weekday: 'narrow',
			year:    'numeric',
			month:   'long',
			day:     'numeric'
		}).slice(3);
	}

	// --title, prompt, or fallback
	if (!args.title) {
		try {
			args.title = await question(titlePrompt);
		} catch (error) {
			args.title = titleFallback
		}
	}

	args.title = formatTitle(args.title);

	// --id, prompt, or fallback
	args.id = formatId(args.id || args.title);
	args.idCamelCase = formatCamelCase(args['camel-case-id'] || args.id);

	// --desc or fallback
	if (!args.desc) {
		args.desc = formatDesc(args.description || descFallback);
	}

	args.pkgdesc = formatPkgDesc(args['package-description'] || args.desc);

	// --author, git name, prompt, or fallback
	if (!args.author) {
		try {
			args.author = await gitInfo('name');
		} catch (error) {
			try {
				args.author = await question(authorPrompt);
			} catch (error2) {
				args.author = authorFallback;
			}
		}
	}

	// --email, git email, prompt, or fallback
	if (!args.email) {
		try {
			args.email = await gitInfo('email');
		} catch (error) {
			try {
				args.email = await question(emailPrompt);
			} catch (error2) {
				args.email = emailFallback;
			}
		}
	}

	// --user, git user, prompt, or fallback
	if (!args.user) {
		try {
			args.user = await gitInfo('user');
		} catch (error) {
			try {
				args.user = await question(userPrompt);
			} catch (error2) {
				args.user = userFallback;
			}
		}
	}

	// --keywords, or prompt
	if (!args.keywords) {
		try {
			args.keywords = await question(keywordPrompt);
		} catch (error) {
			args.keywords = keywordFallback;
		}
	}

	args.keywords = formatKeywords(args.keywords);

	console.log('');
}

async function createTemplate() {
	const __tpl = path.join(__dirname, 'template');
	const __out = path.resolve(process.cwd(), args.to);
	const execOpts = { cwd: __out };

	try {
		await copyTemplateDir(__tpl, __out, args);

		try {
			await exec('git init', execOpts);
			await exec(`git remote add origin git@github.com:${args.user}/${args.id}.git`, execOpts);
		} catch (error2) {
			// do nothing and continue
		}

		if (!args['no-install']) {
			await pipeExec('npm install', execOpts);
		}

		console.log(getSuccessMessage(args));

		process.exit(0);
	} catch (error) {
		console.error(error);

		process.exit(1);
	}
}

function getSuccessMessage() {
	return `Success! Created ${color.bold(args.title)} at ${color.bold(args.to)}

We suggest that you begin by typing:
  cd ${path.relative(process.cwd(), args.to)}
  npm test

Happy PostCSS-ing!\n`;
}

const authorFallback = 'PostCSS Community';
const authorPrompt = 'Author Name';
const descFallback = '...';
const emailFallback = 'postcss@postcss.org';
const emailPrompt = 'GitHub Email';
const keywordFallback = '';
const keywordPrompt = 'Keywords';
const titleFallback = 'Example';
const titlePrompt = 'Plugin Name';
const userFallback = 'postcss';
const userPrompt = 'GitHub User';

const formatTitle = string => string
	.trim()
	.replace(/^(postcss\s+)?/i, 'PostCSS '); // force normalized "PostCSS" prefix
const formatDesc = string => string.trim();
const formatPkgDesc = string => string.replace(/^[a-z]/, match => match.toUpperCase());
const formatId = string => string
	.trim()
	.replace(/[^\w]+/g, '-') // replace non-words (special characters, spaces) with a dash
	.replace(/^-+|-+$/g, '') // remove trailing dashes
	.toLowerCase();
const formatCamelCase = string => string
	.replace(/-[a-z]/g, match => match.slice(1).toUpperCase()); // replace "-\w" with uppercase
const formatKeywords = string => ['postcss', 'css', 'postcss-plugin']
	.concat(
		string
		.trim()
		.split(/\s*,\s*/)
	)
	.join('",\n    "');

main();
