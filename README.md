# node-sass-json-importer

JSON importer for [node-sass](https://github.com/sass/node-sass). Allows `@import`ing `.json` or `.json5` files in Sass files parsed by `node-sass`.

[![npm](https://img.shields.io/npm/v/node-sass-json-importer.svg)](https://www.npmjs.com/package/node-sass-json-importer)
[![build status](https://travis-ci.org/Updater/node-sass-json-importer.svg?branch=master)](https://travis-ci.org/Updater/node-sass-json-importer)

## Usage
### [node-sass](https://github.com/sass/node-sass)
This module hooks into [node-sass's importer api](https://github.com/sass/node-sass#importer--v200---experimental).

```javascript
var sass = require('node-sass');
var jsonImporter = require('node-sass-json-importer');

// Example 1
sass.render({
  file: scss_filename,
  importer: jsonImporter,
  [, options..]
}, function(err, result) { /*...*/ });

// Example 2
var result = sass.renderSync({
  data: scss_content
  importer: [jsonImporter, someOtherImporter]
  [, options..]
});
```

### [node-sass](https://github.com/sass/node-sass) command-line interface

To run this using node-sass CLI, point `--importer` to your installed json importer, for example: 

```sh
./node_modules/.bin/node-sass --importer node_modules/node-sass-json-importer/dist/node-sass-json-importer.js --recursive ./src --output ./dist
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
    importer: jsonImporter
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
            importer: jsonImporter,
          },
        },
      ],
    ],
  },
};
```

## Importing strings
Since JSON doesn't map directly to SASS's data types, a common source of confusion is how to handle strings. While [SASS allows strings to be both quoted and unqouted](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#sass-script-strings), strings containing spaces, commas and/or other special characters have to be wrapped in quotes. In terms of JSON, this means the string has to be double quoted:

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

## Thanks to
This module is based on the [sass-json-vars](https://github.com/vigetlabs/sass-json-vars) gem, which unfortunately isn't compatible with `node-sass`.
