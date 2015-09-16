import _          from 'lodash';
import {resolve}  from 'path';

export default function(url, prev) {
  if (/\.json$/.test(url)) {
    let file = resolve(prev.slice(0, prev.lastIndexOf('/')), url);

    return {
      contents: parseJSON(require(file))
    };
  } else {
    return {
      file: url
    };
  }
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
