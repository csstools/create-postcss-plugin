// tooling
import color from './color';
import readline from 'readline';

// then-ified readline prompt
export default prompt => new Promise(
	(resolve, reject) => {
		const readlineInterface = readline.createInterface({
			input:  process.stdin,
			output: process.stdout
		});

		readlineInterface.question(
			color.dim(`${prompt}: `),
			answer => {
				readlineInterface.close();

				if (answer) {
					resolve(answer);
				} else {
					reject();
				}
			}
		);
	}
);
