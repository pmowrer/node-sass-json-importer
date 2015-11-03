import _          from 'lodash';
import {resolve}  from 'path';
import isThere    from 'is-there';
import url        from 'url';

export default function(fileUrl, prev) {
  var pathRegex = /(.+\.js(on)?)(\?(.+))?$/
  if (pathRegex.test(fileUrl)) {
    let includePaths = this.options.includePaths ? this.options.includePaths.split(':') : [];
    let parsedUrl = url.parse(fileUrl,true)
    let propQuery = parsedUrl.query
    let filePath = parsedUrl.pathname

    let paths = []
      .concat(prev.slice(0, prev.lastIndexOf('/')))
      .concat(includePaths);


    let files = paths
      .map(path => resolve(path, filePath))
      .filter(isThere);

    if (files.length === 0) {
      return new Error(`Unable to find "${filePath}" from the following path(s): ${paths.join(', ')}. Check includePaths.`);
    }

    let exported = require(files[0]);

    if(propQuery.path){
      exported = exported[propQuery.path]
    }

    let functions = '';

    if(propQuery.getter != null){
      Object.keys(exported).map(function(key){
        functions += `
                    @function ${key}($keys...) {
                      @return ${propQuery.getter}((
                        keys:$keys,
                        data:$_${key},
                        name:'${key}'
                      ));
                    }`.replace(/^                    /gm, '');
        if(propQuery.withKeys != null){
          functions += `
                      @function ${key}-keys($keys...) {
                        $result: ${key}($keys...);
                        @return map-keys($result);
                      }`.replace(/^                      /gm, '');
        }
      })
    }

    if(propQuery.getter != null){
      exported = Object.keys(exported).reduce(function(acc, key){
        acc['_'+key] = exported[key];
        return acc;
      }, {})
    }

    let contents = parseJSON(exported) + functions


    return {
      contents: contents
    };
  } else {
    return {
      file: fileUrl
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
  } else if (_.isString(value) && value.match(/[\s,]/) && !value.match(/[()]/)) {
    return `"${value}"`;
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
