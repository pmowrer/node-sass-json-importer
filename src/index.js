import _               from 'lodash';
import path, {resolve} from 'path';
import isThere         from 'is-there';

import 'json5/lib/require'; // Enable JSON5 support

export default function(url, prev) {
  if (!isJSONfile(url)) {
    return null;
  }

  let includePaths = this.options.includePaths ? this.options.includePaths.split(path.delimiter) : [];
  let paths = []
    .concat(prev.slice(0, prev.lastIndexOf('/')))
    .concat(includePaths);

  let fileName = paths
    .map(path => resolve(path, url))
    .filter(isThere)
    .pop();

  if (!fileName) {
    return new Error(`Unable to find "${url}" from the following path(s): ${paths.join(', ')}. Check includePaths.`);
  }

  // Prevent file from being cached by Node's `require` on continuous builds.
  // https://github.com/Updater/node-sass-json-importer/issues/21
  delete require.cache[require.resolve(fileName)];

  try {
    return {
      contents: transformJSONtoSass(require(fileName)),
    };
  } catch(error) {
    return new Error(`node-sass-json-importer: Error transforming JSON/JSON5 to SASS. Check if your JSON/JSON5 parses correctly. ${error}`);
  }
}

export function isJSONfile(url) {
  return /\.json5?$/.test(url);
}

export function transformJSONtoSass(json) {
  return Object.keys(json)
    .filter(key => isValidKey(key))
    .map(key => `$${key}: ${parseValue(json[key])};`)
    .join('\n');
}

export function isValidKey(key) {
  return /^[^$@:].*/.test(key)
}

export function parseValue(value) {
  if (_.isArray(value)) {
    return parseList(value);
  } else if (_.isPlainObject(value)) {
    return parseMap(value);
  } else if (value === '') {
    return '""'; // Return explicitly an empty string (Sass would otherwise throw an error as the variable is set to nothing)
  } else if (_.isString(value) && shouldWrapInStrings(value)) {
    return '"' + value + '"'; // Sass throws an error if a value contains a comma and is not treated as a string
  } else {
    return value;
  }
}

export function parseList(list) {
  return `(${list
    .map(value => parseValue(value))
    .join(',')})`;
}

export function parseMap(map) {
  return `(${Object.keys(map)
    .filter(key => isValidKey(key))
    .map(key => `${key}: ${parseValue(map[key])}`)
    .join(',')})`;
}

/**
 * There are multiple SASS functions (e.g. hsl() oder rgb()) which receive comma-separated values
 * (e.g. hsl(270, 60%, 70%)). These should not be wrapped in quotes. A string like "Tomorrow, I will
 * write SASS" should be wrapped in quotes. This function checks if commas are used outside of SASS
 * functions.
 *
 * @param input Input to check.
 *
 * @return {boolean} True = Should be wrapped in quotes.
 */
export function shouldWrapInStrings(input) {
  const inputWithoutFunctions = input.replace(/[a-zA-Z]+\([^)]*\)/, "") // Remove functions

  return inputWithoutFunctions.includes(',');
}

// Super-hacky: Override Babel's transpiled export to provide both
// a default CommonJS export and named exports.
// Fixes: https://github.com/Updater/node-sass-json-importer/issues/32
// TODO: Remove in 3.0.0. Upgrade to Babel6.
module.exports = exports.default;
Object.keys(exports).forEach(key => module.exports[key] = exports[key]);
