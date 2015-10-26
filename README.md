# node-sass-json-importer [![build status](https://travis-ci.org/Updater/node-sass-json-importer.svg?branch=master)](https://travis-ci.org/Updater/node-sass-json-importer)
JSON importer for [node-sass](https://github.com/sass/node-sass). Allows `@import`ing `.json` files in Sass files parsed by `node-sass`.

## Usage
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

### [sass-loader](https://github.com/jtangelder/sass-loader)

```javascript
import jsonImporter from 'node-sass-json-importer';

...
// Webpack config
{
  sassLoader: {
    importer: jsonImporter
  }
}
```

## Thanks to
This module is based on the [sass-json-vars](https://github.com/vigetlabs/sass-json-vars) gem, which unfortunately isn't compatible with `node-sass`.
