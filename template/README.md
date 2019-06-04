# ${title} [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[${title}] lets you ${desc} in CSS.

```pcss
.example { ... }

/* becomes */

.example { ... }
```

## Usage

Add [${title}] to your project:

```bash
npm install ${id} --save-dev
```

Use **${title}** to process your CSS:

```js
const ${idCamelCase} = require('${id}');

${idCamelCase}.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const ${idCamelCase} = require('${id}');

postcss([
  ${idCamelCase}(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

**${title}** runs in all Node environments, with special instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

...

[cli-img]: https://img.shields.io/travis/${user}/${id}/master.svg
[cli-url]: https://travis-ci.org/${user}/${id}
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/${id}.svg
[npm-url]: https://www.npmjs.com/package/${id}

[PostCSS]: https://github.com/postcss/postcss
[${title}]: https://github.com/${user}/${id}
