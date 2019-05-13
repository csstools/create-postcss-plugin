# create-postcss-plugin [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS" width="90" height="90" align="right">][PostCSS]

[Create PostCSS Plugin] lets you quickly create new [PostCSS] plugins with
documentation, tests, and built in compiling for supported Node environments.

```sh
npm init postcss-plugin YOUR_DESTINATION
```

```sh
npx create-postcss-plugin YOUR_DESTINATION
```

After completing the instructions, write your plugin to `src/index.js` and
update `README.md` with further details outlining your plugin functionality.

## Options

You can pass options into postcss-plugin to automate plugin creation.

### to

The `to` argument defines the destination of the new project. The first
undefined argument will also determine this value.

```sh
npm init postcss-plugin --to path/to/plugin
```

### title

The `title` argument defines the formal name of the project.

```sh
npm init postcss-plugin --title Super
```

```sh
npm init postcss-plugin --title "Awesome Blossom"
```

### id

The `id` argument defines the id used by the project package.json and
repository.

```sh
npm init postcss-plugin --id awes-blos
```

### desc

The `desc` or `description` argument defines the description used by the
project README.md and package.json.

```sh
# becomes "Use exciting new functions" and "Awesome Blossom lets you create new functions in CSS."
npm init postcss-plugin --desc "use exciting new functions"
```

```sh
# becomes "Use exciting new functions" and "Awesome Blossom lets you create new functions in CSS."
npm init postcss-plugin --description "use exciting new functions"
```

### author

The `author` argument defines the author used by the project package.json.

```sh
npm init postcss-plugin --author "Joe Bloggs"
```

### email

The `email` argument defines the email used by the project package.json.

```sh
npm init postcss-plugin --email "postcss@postcss.org"
```

### user

The `user` argument defines the repository user or group hosting the project.

```sh
npm init postcss-plugin --user "postcss"
```

### keywords

The `keywords` argument defines the keywords used by the project package.json.

```sh
npm init postcss-plugin --keywords "awesome,blossom"
```

### no-install

The `no-install` argument instructs the project to not automatically install
dependencies.

```sh
npm init postcss-plugin --no-install
```

[Create PostCSS Plugin]: https://github.com/csstools/create-postcss-plugin
[PostCSS]: https://github.com/postcss/postcss
