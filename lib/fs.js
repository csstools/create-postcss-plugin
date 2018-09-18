const fs   = require('fs');
const path = require('path');

Object.assign(
	exports,
	...Object.keys(fs).filter(key => key !== 'promises').map(key => ({
		[key]: fs[key]
	})),
	...[
		'access',
		'appendFile',
		'chmod',
		'chown',
		'close',
		'exists',
		'fchmod',
		'fchown',
		'fdatasync',
		'fstat',
		'fsync',
		'ftruncate',
		'futimes',
		'lchmod',
		'lchown',
		'link',
		'lstat',
		'mkdtemp',
		'open',
		'read',
		'readdir',
		'readFile',
		'readlink',
		'realpath',
		'rename',
		'rmdir',
		'stat',
		'symlink',
		'truncate',
		'unlink',
		'utimes',
		'write',
		'write'
	].map(
		name => ({
			[name]: (pathname, ...args) => new Promise(
				(resolve, reject) => fs[name](pathname, ...args,
					(err, ...res) => {
						if (err) {
							reject(err);
						} else {
							resolve(...res);
						}
					}
				)
			)
		})
	),

	// mkdir + writeFile
	...['mkdir', 'writeFile'].map(
		key => ({
			[key]: (pathname, ...args) => new Promise(
				(resolve, reject) => {
					// execute the native method
					fs[key](
						pathname,
						...args,
						err => {
							// if there is no parent directory
							if (err && err.code === 'ENOENT') {
								// promise to make the parent directory
								exports.mkdir(path.dirname(pathname)).then(
									// and then try again
									() => exports[key](pathname, ...args)
								).then(resolve);
							} else if (err && err.code !== 'EEXIST') {
								// otherwise, reject any error not about an existing directory
								reject(err);
							} else {
								// otherwise, resolve
								resolve();
							}
						}
					);
				}
			)
		})
	),

	// mkdirSync, writeFileSync
	...['mkdirSync', 'writeFileSync'].map(
		key => ({
			[key]: (pathname, ...args) => {
				try {
					// try to execute the native method
					fs[key](pathname, ...args);
				} catch (err) {
					// if there is no parent directory
					if (err && err.code === 'ENOENT') {
						// make the parent directory
						exports.mkdirSync(path.dirname(pathname));

						// and then try again
						exports[key](pathname, ...args)
					} else if (err && err.code !== 'EEXIST') {
						// otherwise, throw any error not about an existing directory
						throw err;
					}
				}
			}
		})
	),

	// copydir
	{
		copydir: (source, target) => exports.mkdir(target).then(
			// make the target directory, then promise to read the source directory
			() => exports.readdir(source)
		).then(
			// promise to copy the contents of the source directory
			children => Promise.all(
				children.map(
					child => {
						const sourceChild = path.resolve(source, child);
						const targetChild = path.resolve(target, child);

						// promise the appropriate copy of the child
						return exports.lstat(sourceChild).then(
							lstat => lstat.isDirectory()
								? exports.copydir(sourceChild, targetChild)
							: exports.copyFile(sourceChild, targetChild)
						);
					}
				)
			).then(
				() => Promise.resolve()
			)
		)
	},

	// copydirSync
	{
		copydirSync: (source, target) => {
			// make the target directory
			exports.mkdirSync(target);

			// read the source directory
			const children = exports.readdirSync(source)

			// copy the contents of the source directory
			children.forEach(
				child => {
					const sourceChild = path.resolve(source, child);
					const targetChild = path.resolve(target, child);

					const lstat = exports.lstatSync(sourceChild);

					// execute the appropriate copy of the child
					if (lstat.isDirectory()) {
						exports.copydirSync(sourceChild, targetChild);
					} else {
						exports.copyFileSync(sourceChild, targetChild);
					}
				}
			);
		}
	},

	// copyFile
	{
		copyFile: (source, target) => exports.touchFile(target).then(
			// make the target directory, then promise to copy the file
			() => new Promise(
				(resolve, reject) => {
					// create streams
					const readStream  = exports.createReadStream(path.resolve(source));
					const writeStream = exports.createWriteStream(path.resolve(target));

					// reject on read error
					readStream.on('error', prereject);

					// reject on write error
					writeStream.on('error', prereject);

					// resolve on finish
					writeStream.on('finish', resolve);

					// copy stream
					readStream.pipe(writeStream);

					function prereject(err) {
						// destroy streams
						readStream.destroy();
						writeStream.end();

						// reject with error
						reject(err);
					}
				}
			)
		)
	},

	// copyFileSync
	{
		copyFileSync: (source, target) => {
			// make the target directory
			exports.mkdirSync(path.dirname(target));

			// buffer
			const bufferLength = 64 * 1024;
			const buffer = new Buffer(bufferLength);

			// position
			let bytesRead = 1;
			let position = 0;

			// open the reader and writer
			const reader = fs.openSync(source, 'r');
			const writer = fs.openSync(target, 'w');

			// copy the file
			while (bytesRead > 0) {
				bytesRead = fs.readSync(reader, buffer, 0, bufferLength, position);

				fs.writeSync(writer, buffer, 0, bytesRead);

				position += bytesRead;
			}

			// close the reader and writer
			fs.closeSync(reader);
			fs.closeSync(writer);
		}
	},

	// readJson
	{
		readJson: filename => exports.readFile(filename, 'utf8').then(JSON.parse)
	},

	// readJsonSync
	{
		readJsonSync: filename => JSON.parse(exports.readFileSync(filename, 'utf8'))
	},

	// rmdir
	{
		rmdir: dirname => new Promise(
			(resolve, reject) => {
				// remove the directory
				fs.rmdir(dirname,
					err => {
						// if there is an error about the directory not being empty
						if (err && err.code === 'ENOTEMPTY') {
							// resolve to read the directory
							resolve(exports.readdir(dirname).then(
								// promise to remove each child of the directory
								children => Promise.all(
									children.map(
										child => {
											const resolvedChild = path.resolve(dirname, child);

											// promise to remove of the child
											return exports.lstat(resolvedChild).then(
												lstat => lstat.isDirectory()
													? exports.rmdir(resolvedChild)
												: exports.unlink(resolvedChild)
											);
										}
									)
								)
							).then(
								// and then try again
								() => exports.rmdir(dirname)
							));
						} else if (err) {
							// otherwise, reject any error
							reject(err);
						} else {
							// otherwise, resolve
							resolve();
						}
					}
				);
			}
		)
	},

	// rmdirSync
	{
		rmdirSync: dirname => {
			try {
				// try to remove the directory
				fs.rmdirSync(dirname);
			} catch (err) {
				// if there is an error about the directory not being empty
				if (err && err.code === 'ENOTEMPTY') {
					const children = exports.readdirSync(dirname);

					// remove each child of the directory
					children.forEach(
						child => {
							const resolvedChild = path.resolve(dirname, child);

							const lstat = exports.lstatSync(resolvedChild);

							// remove the child
							if (lstat.isDirectory()) {
								exports.rmdirSync(resolvedChild);
							} else {
								exports.unlinkSync(resolvedChild);
							}
						}
					);

					// and then try again
					exports.rmdirSync(dirname);
				} else {
					// otherwise, throw any error
					throw err;
				}
			}
		}
	},

	// touchFile
	{
		touchFile: filename => new Promise(
			(resolve, reject) => {
				// touch the file
				fs.open(filename, 'wx',
					err => {
						// if there is no parent directory
						if (err && err.code === 'ENOENT') {
							// promise to make the parent directory
							exports.mkdir(path.dirname(filename)).then(
								// and then try again
								() => exports.touchFile(filename)
							).then(resolve);
						} else if (err && err.code !== 'EEXIST') {
							// otherwise, reject any error not about the directory already existing
							reject(err);
						} else {
							// otherwise, resolve
							resolve();
						}
					}
				);
			}
		)
	},

	// touchFileSync
	{
		touchFileSync: filename => {
			try {
				// try to touch the file
				fs.openSync(filename, 'wx');
			} catch (err) {
				// if there is no parent directory
				if (err && err.code === 'ENOENT') {
					// make the parent directory
					exports.mkdirSync(path.dirname(filename));

					// and then try again
					exports.touchFileSync(filename);
				} else if (err && err.code !== 'EEXIST') {
					// otherwise, throw any error not about the directory already existing
					throw err;
				}
			}
		}
	}
);