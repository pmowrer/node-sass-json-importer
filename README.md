# node-sass-json-importer [![build status](https://travis-ci.org/Updater/node-sass-json-importer.svg?branch=master)](https://travis-ci.org/Updater/node-sass-json-importer)
JSON importer for [node-sass](https://github.com/sass/node-sass). Allows `@import`ing `.json` files in Sass files parsed by `node-sass`.

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

```javascript
import jsonImporter from 'node-sass-json-importer';

// Webpack config
export default {
  module: {
    // Example sass-loader usage. 
    // See: https://github.com/jtangelder/sass-loader#apply-via-webpack-config
    loaders: [{
      test: /\.scss$/,
      loaders: ["style", "css", "sass"]
    }],
  },
  sassLoader: {
    // Apply the JSON importer via sass-loader's options.
    importer: jsonImporter
  }
};
```

## Thanks to
This module is based on the [sass-json-vars](https://github.com/vigetlabs/sass-json-vars) gem, which unfortunately isn't compatible with `node-sass`.
