#!/usr/bin/env node

// tooling
const args     = require('./lib/args');
const child    = require('./lib/child_process');
const fs       = require('./lib/fs');
const gitinfo  = require('./lib/gitinfo');
const path     = require('path');
const question = require('./lib/question');
const copydir  = require('./lib/copy-dir');
const exec     = require('./lib/exec');

// caching
const answers = {};

// capturing
const keys = /\$\{([^\}]+)\}/g;

// directory names
const tpl = 'template';

// directory paths
const __tpl = path.join(__dirname, tpl);
const __out = process.cwd();

// capture answers
(questions => Object.keys(questions).reduce(
	(resolver, key) => resolver.then(
		() => questions[key]()
	).then(
		answer => answers[key] = answer
	),
	Promise.resolve()
).then(
	() => answers
))({
	// --date, or formatted date
	date: () => args('date').catch(
		() => new Date(Date.now()).toLocaleDateString('en-US', {
			weekday: 'narrow',
			year:    'numeric',
			month:   'long',
			day:     'numeric'
		}).slice(3)
	),

	// --title, prompt, or Example
	title: () => args('title').catch(
		() => question('Plugin Name')
	).catch(
		() => 'Example'
	).then(
		title => title
		.trim()
		.replace(/^(postcss\s+)?/i, 'PostCSS ')
	),

	// --id, or formatted title
	id: () => args('id').catch(
		() => answers.title
	).then(
		answer => answer
		.trim()
		.replace(/[^\w]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.toLowerCase()
	),

	// --id-camel, or formatted title
	idCamelCase: () => args('id-camel').catch(
		() => answers.title
	).then(
		answer => `postcss${
			answer
			.trim()
			.replace(/^postcss\s+/i, '')
			.replace(/[^\w\s]+/g, '-')
			.replace(/(^|\s+)-+/g, '$1')
			.replace(/-+(\s+|$)/g, '$1')
			.replace(/\s+./g, match => match.trim().toUpperCase())
			.replace(/^[A-z]/, match => match.toUpperCase())
		}`
	),

	// --author, gitinfo name, prompt, or PostCSS Community
	author: () => args('author').catch(
		() => gitinfo('name')
	).catch(
		() => question('GitHub author')
	).catch(
		() => 'PostCSS Community'
	),

	// --email, gitinfo email, prompt, or postcss@postcss.org
	email: () => args('email').catch(
		() => gitinfo('email')
	).catch(
		() => question('GitHub email')
	).catch(
		() => 'postcss@postcss.org'
	),

	// --email, gitinfo user, prompt, or postcss
	user: () => args('user').catch(
		() => gitinfo('user')
	).catch(
		() => question('GitHub user')
	).catch(
		() => 'postcss'
	),

	// --keywords, or prompt, and then formatted
	keywords: () => args('keywords').catch(
		() => question('Keywords')
	).catch(
		() => ''
	).then(
		keywords => ['postcss', 'css', 'postcss-plugin'].concat(
			keywords
			.trim()
			.split(/\s*,\s*/)
		).join('",\n    "')
	)
}).then(
	// read template files, update their contents with answers, and write them to the destination
	answers => Promise.all([
		copydir(__tpl, __out, answers)
	]).then(
		() => Promise.all([
			fs.rmdir(path.resolve(__out, '.git')).catch(() => {}).then(
				() => child(
					'git init',
					{
						cwd: __out
					}
				)
			).then(
				() => child(
					`git remote add origin git@github.com:${answers.user}/${answers.id}.git`,
					{
						cwd: __out
					}
				)
			).then(
				() => exec(
					'npm install',
					{
						cwd: __out
					}
				)
			),
			fs.rmdir(path.resolve(__out, 'lib')).catch(() => {}),
			fs.rmdir(path.resolve(__tpl)).catch(() => {}),
			fs.touchFile(path.resolve(__out, 'test/basic.css')),
			fs.touchFile(path.resolve(__out, 'test/basic.expect.css'))
		])
	)
).then(
	() => process.exit(0),
	error => console.warn(error) && process.exit(1)
);
