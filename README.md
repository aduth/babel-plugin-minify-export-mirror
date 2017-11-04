babel-plugin-minify-export-mirror
=================================

Babel plugin for minifying initial string values for module exports of the same name.

## Example

_Input:_

```js
export const PERFORM_FOO = 'PERFORM_FOO';
export const PERFORM_BAR = 'PERFORM_BAR';
export const PERFORM_BAZ = 'PERFORM_BAZ';
```

_Output:_

```js
export const PERFORM_FOO = 'a';
export const PERFORM_BAR = 'b';
export const PERFORM_BAZ = 'c';
```

## Why?

When using a library like [Redux](http://redux.js.org/), it is encouraged to use unique strings for individual action types. You could imagine an application containing an `action-types.js` file exporting all action types defined for the application store. While the action types should be unique and identifiable, and in development environments it can be useful for them to be human-readable, in a production environment you may prefer instead to save bytes and minify to a shorter, still unique string value.

A standard JavaScript minifier like [UglifyJS](https://github.com/mishoo/UglifyJS2) will create shortened (["mangled"](https://github.com/mishoo/UglifyJS2#mangle-options)) variable names for the above exports, the string values themselves will be kept assigned to their original full form even after minification.

This serves a similar purpose to the [KeyMirror utility](https://github.com/STRML/keyMirror) originally included as a React internal library, which when used with [Closure Compiler's Advanced Mode](https://developers.google.com/closure/compiler/docs/api-tutorial3) could [crush keys](https://github.com/STRML/keyMirror), having the same effect of unique shortened object/value pairs. Unlike KeyMirror, this Babel plugin takes effect at compile-time, avoiding an additional runtime dependency and processing.

## Usage

First install to your project as a development dependency:

```
npm install --save-dev babel-plugin-minify-export-mirror
```

If you are not familiar with using Babel plugins, it is recommended you follow the "Getting Started" guide:

[http://babeljs.io/docs/setup/](http://babeljs.io/docs/setup/)

Assuming that you only want to run the plugin on a specific file or for production environments, you may consider:

- Using [Babel's "env" configuration](https://babeljs.io/docs/usage/babelrc/#env-option) to add the plugin when running under specific Node environments (`"env": "production"`)
- Running a separate Babel process with only this plugin enabled, applied only to the single file of your choosing

From the command line, this could look like:

```
babel --plugins minify-export-mirror src/state/action-types.js 
```

Or in a Webpack configuration, create a separate `module` rule prior to your standard Babel loader:

```js
module.exports = {
	module: {
		rules: [
			{
				include: __dirname + '/src/state',
				test: /\/action-types\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						plugins: [ 'minify-export-mirror' ]
					}
				}
			},
			{
				exclude: /node_modules/,
				test: /\.js$/,
				use: [ 'babel-loader' ]
			}
		]
	}
};
```

## License

Copyright (c) 2017 Andrew Duthie

[The MIT License (MIT)](https://opensource.org/licenses/MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
