// match double-dash arguments
const dash = /^--([^\s]+)$/;

// export object from double-dash arguments
export default process.argv.slice(2).reduce(
	(object, arg, i, args) => {
		if (dash.test(arg)) {
			object[arg.replace(dash, '$1')] = (i + 1) in args ? args[i + 1] : true;
		} else if (!dash.test(args[i - 1]) && !object.to) {
			object.to = arg;
		}

		return object;
	},
	{}
);
