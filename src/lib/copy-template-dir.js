import fs from './fs';
import path from 'path';

export default function copyTemplateDir (__tpl, __out, answers) {
	return fs.readdir(__tpl).then(
		pathnames => Promise.all(pathnames.map(
			pathname => fs.lstat(
				path.resolve(__tpl, pathname)
			).then(
				stat => stat.isFile()
					? fs.readFile(path.join(__tpl, pathname), 'utf8').then(
						content => content.replace(
							keys,
							(match, key) => key in answers ? answers[key] : match
						).replace(patchPkg, '')
					).then(
						content => fs.writeFile(path.join(__out, patchNpmIgnore(pathname)), content)
					)
				: fs.mkdir(path.resolve(__out, pathname)).then(
					() => copyTemplateDir(
						path.resolve(__tpl, pathname),
						path.resolve(__out, pathname),
						answers
					)
				)
			)
		))
	);
}

function patchNpmIgnore (pathname) {
	return pathname === '.npmignore' ? '.gitignore' : pathname;
}

const keys = /\$\{([^}]+)\}/g;
const patchPkg = ',\n    ".*",\n    "*"';
