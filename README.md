# node-sass-json-importer

JSON importer for [node-sass](https://github.com/sass/node-sass). Allows `@import`ing `.json` or `.json5` files in Sass files parsed by `node-sass`.

[![npm](https://img.shields.io/npm/v/node-sass-json-importer.svg)](https://www.npmjs.com/package/node-sass-json-importer)
[![build status](https://travis-ci.org/pmowrer/node-sass-json-importer.svg?branch=master)](https://travis-ci.org/Updater/node-sass-json-importer)

## Usage
### [node-sass](https://github.com/sass/node-sass)
This module hooks into [node-sass's importer api](https://github.com/sass/node-sass#importer--v200---experimental).

```javascript
var sass = require('node-sass');
var jsonImporter = require('node-sass-json-importer');

// Example 1
sass.render({
  file: scss_filename,
  importer: jsonImporter(),
  [, options..]
}, function(err, result) { /*...*/ });

// Example 2
var result = sass.renderSync({
  data: scss_content
  importer: [jsonImporter(), someOtherImporter]
  [, options..]
});
```

### [node-sass](https://github.com/sass/node-sass) command-line interface

To run this using node-sass CLI, point `--importer` to your installed json importer, for example: 

```sh
./node_modules/.bin/node-sass --importer node_modules/node-sass-json-importer/dist/cli.js --recursive ./src --output ./dist
```

### Webpack / [sass-loader](https://github.com/jtangelder/sass-loader)

#### Webpack v1

```javascript
import jsonImporter from 'node-sass-json-importer';

// Webpack config
export default {
  module: {
    loaders: [{
      test: /\.scss$/,
      loaders: ["style", "css", "sass"]
    }],
  },
  // Apply the JSON importer via sass-loader's options.
  sassLoader: {
    importer: jsonImporter()
  }
};
```

#### Webpack v2

```javascript
import jsonImporter from 'node-sass-json-importer';

// Webpack config
export default {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            },
          },
          {
            loader: 'sass-loader',
            // Apply the JSON importer via sass-loader's options.
            options: {
              importer: jsonImporter(),
            },
          },
        },
      ],
    ],
  },
};
```

## Importing

### Importing strings
Since JSON doesn't map directly to SASS's data types, a common source of confusion is how to handle strings. While [SASS allows strings to be both quoted and unquoted](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#sass-script-strings), strings containing spaces, commas and/or other special characters have to be wrapped in quotes. In terms of JSON, this means the string has to be double quoted:

##### Incorrect
```json
{
  "description": "A sentence with spaces."
}
```

##### Correct
```json
{
  "description": "'A sentence with spaces.'"
}
```

See discussion here for more:

https://github.com/Updater/node-sass-json-importer/pull/5

### Importing *.js Files

You can also import *.js Files. This way you can use javascript to compose and export json structure for node-sass-json-importer.
```
const xl = require('./variables.json')
const md = require('./variables-md.json')
const xs = require('./variables-xs.json')

module.exports = {
    xl,
    md,
    xs,
}
```

## Custom resolver

Should you care to resolve paths, say, starting with `~/` relative to project root or some other arbitrary directory, you can do it as follows:

`1.sass`:

```sass
@import '~/1.json'
body
    margin: $body-margin
```

`json/1.json`:

```json
{"body-margin": 0}
```

```js
var path = require('path');
var sass = require('node-sass');
var jsonImporter = require('../dist/node-sass-json-importer');

sass.render({
  file: './1.sass',
  importer: jsonImporter({
    resolver: function(dir, url) {
      return url.startsWith('~/')
        ? path.resolve(dir, 'json', url.substr(2))
        : path.resolve(dir, url);
    },
  }),
}, function(err, result) { console.log(err || result.css.toString()) });
```

## camelCase to kebab-case

If you want to convert standard JavaScript caseCase keys into CSS/SCSS compliant kebab-case keys, for example:

`variables.json`:

```JS
{
  "bgBackgroundColor": 'red'
}
```

For usage like this:

`style.scss`:

```SCSS
@import "variables.json";

div {
  background: $bg-background-color;
}
```

You can pass set the `convertCase` option to true as an argument to `jsonImporter` like so:

```js
sass.render({
  file: './1.sass',
  importer: jsonImporter({
    convertCase: true,
  }),
}, function(err, result) { console.log(err || result.css.toString()) });
```

## Thanks to
This module is based on the [sass-json-vars](https://github.com/vigetlabs/sass-json-vars) gem, which unfortunately isn't compatible with `node-sass`.
