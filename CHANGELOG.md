# Changes to Create PostCSS Plugin

### 3.1.0 (July 29, 2019)

- Added: Separated `build` task, automatically run before `test:tape`
- Updated: All dependencies

### 3.0.0 (June 4, 2019)

- Updated: `postcss` to 7.0.16 (patch)
- Updated: Various development dependencies
- Changed: Using standard instead of `eslint-config-dev` development dependency
- Changed: Source moved into `src` directory more fully checked by eslint
- Updated: Node 8+ compatibility (major)
- Updated: Markdown templates to link back to the project less
- Updated: README template to reference the master branch within Travis
- Fixed: Issue with `.gitignore` being copied as `.npmignore`
- Fixed: Potential issue in internally promisified fs.

### 2.0.0 (Jan 31, 2019)

- Added: Support for package description (`pkgdesc`)
- Updated: `postcss` to 7.0.14 (patch)

### 1.0.0 (Dec 22, 2018)

- Initial version
