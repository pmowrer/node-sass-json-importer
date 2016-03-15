import _          from 'lodash';
import {resolve}  from 'path';
import isThere    from 'is-there';
import sass       from 'node-sass';
import isColor    from 'is-color';

export default function(url, prev) {
  if (!/\.(json|js)$/.test(url)) {
    return sass.NULL;
  }

  let includePaths = this.options.includePaths ? this.options.includePaths.split(':') : [];
  let paths = []
    .concat(prev.slice(0, prev.lastIndexOf('/')))
    .concat(includePaths);

  let file = paths
    .map(path => resolve(path, url))
    .filter(isThere)
    .pop();

  if (!file) {
    return new Error(`Unable to find "${url}" from the following path(s): ${paths.join(', ')}. Check includePaths.`);
  }

  // Prevent file from being cached by Node's `require` on continuous builds.
  // https://github.com/Updater/node-sass-json-importer/issues/21
  delete require.cache[require.resolve(file)];

  var contents = require(file);
  try {
    if (/\.js$/.test(url)) {
      contents = JSON.parse(JSON.stringify(contents));
    }
  } catch(e) {
    return sass.NULL;
  }

  return {
    contents: parseJSON(contents)
  };
}

function isCSSUnit(value) {
  return /^\d*\.*\d+(em|ex|ch|rem|vh|vw|vmin|vmax|px|mm|cm|in|pt|pc|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)$/.test(value);
}

function parseJSON(json) {
  return Object.keys(json)
    .map(key => `$${key}: ${parseValue(json[key])};`)
    .join('\n');
}

function parseValue(value) {
  if (_.isArray(value)) {
    return parseList(value);
  } else if (_.isPlainObject(value)) {
    return parseMap(value);
  } else {
    return parseEndValue(value);
  }
}

function parseList(list) {
  return `(${list
    .map(value => parseValue(value))
    .join(',')})`;
}

function parseMap(map) {
  return `(${Object.keys(map)
    .map(key => `${key}: ${parseValue(map[key])}`)
    .join(',')})`;
}

function parseEndValue(value) {
  if (typeof value === 'string' && !isColor(value) && !isCSSUnit(value)) {
    return JSON.stringify(value);
  }

  return value;
}