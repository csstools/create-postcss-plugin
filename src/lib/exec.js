import { exec as callbackExec, execSync } from 'child_process';

export function exec (cmd, opts) {
	return new Promise((resolve, reject) => {
		callbackExec(cmd, Object(opts), (error, stdout, stderr) => {
			if (error) {
				reject(stderr)
			} else {
				resolve(stdout)
			}
		})
	});
}

export function pipeExec (cmd, opts) {
	return new Promise((resolve, reject) => {
		try {
			const execSyncOpts = Object.assign({ stdio: ['pipe', 'pipe', process.stderr] }, opts);

			const result = execSync(cmd, execSyncOpts);

			resolve(result);
		} catch (error) {
			reject(error);
		}
	});
}
