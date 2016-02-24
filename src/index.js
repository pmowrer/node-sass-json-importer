import _          from 'lodash';
import {resolve}  from 'path';
import isThere    from 'is-there';
import sass       from 'node-sass';

export default function(url, prev) {
  if (!/\.json$/.test(url)) {
    return sass.NULL;
  }

  let includePaths = this.options.includePaths ? this.options.includePaths.split(':') : [];
  let paths = []
    .concat(prev.slice(0, prev.lastIndexOf('/')))
    .concat(includePaths);

  let files = paths
    .map(path => resolve(path, url))
    .filter(isThere);

  if (files.length === 0) {
    return new Error(`Unable to find "${url}" from the following path(s): ${paths.join(', ')}. Check includePaths.`);
  }
  
  delete require.cache[require.resolve(files[0])];

  return {
    contents: parseJSON(require(files[0]))
  };
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
    return value;
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
