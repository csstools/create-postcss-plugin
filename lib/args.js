const argRegExp = /^--([\w-]+)$/;
const primativeRegExp = /^(false|null|true|undefined|(\d+\.)?\d+|\{.*\}|\[.*\])$/;
const relaxedJsonPropRegExp = /(['"])?([a-z0-9A-Z_]+)\1:/g;
const relaxedJsonValueRegExp = /("[a-z0-9A-Z_]+":\s*)(?!true|false|null|\d+)'?([A-z0-9]+)'?([,}])/g;

const results = process.argv.slice(2).reduce(
	(args, arg, index, argv) => {
		const nextIndex = index + 1;
		const nextArg = argv[nextIndex];
		const argMatch = arg.match(argRegExp);

		if (argMatch) {
			const name = argMatch[1];

			if (!nextArg || argRegExp.test(nextArg)) {
				args[name] = true;
			} else {
				args[name] = primativeRegExp.test(nextArg)
					? JSON.parse(
						nextArg
						.replace(relaxedJsonPropRegExp, '"$2": ')
						.replace(relaxedJsonValueRegExp, '$1"$2"$3')
					)
				: nextArg;
			}
		}

		return args;
	},
	{}
);

// then-ified dashed arguments
module.exports = key => key in results ? Promise.resolve(results[key]) : Promise.reject();
