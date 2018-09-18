import postcss from 'postcss';

export default postcss.plugin('${id}', opts => {
	console.log('opts', opts);

	return (root, result) => {
		console.log('root, result', root, result);
	};
});
