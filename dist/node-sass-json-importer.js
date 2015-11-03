'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _isThere = require('is-there');

var _isThere2 = _interopRequireDefault(_isThere);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

exports['default'] = function (fileUrl, prev) {
  var _this = this;

  var pathRegex = /(.+\.js(on)?)(\?(.+))?$/;
  if (pathRegex.test(fileUrl)) {
    var _ret = (function () {
      var includePaths = _this.options.includePaths ? _this.options.includePaths.split(':') : [];
      var parsedUrl = _url2['default'].parse(fileUrl, true);
      var propQuery = parsedUrl.query;
      var filePath = parsedUrl.pathname;

      var paths = [].concat(prev.slice(0, prev.lastIndexOf('/'))).concat(includePaths);

      var files = paths.map(function (path) {
        return (0, _path.resolve)(path, filePath);
      }).filter(_isThere2['default']);

      if (files.length === 0) {
        return {
          v: new Error('Unable to find "' + filePath + '" from the following path(s): ' + paths.join(', ') + '. Check includePaths.')
        };
      }

      var exported = require(files[0]);

      if (propQuery.path) {
        exported = exported[propQuery.path];
      }

      var functions = '';

      if (propQuery.getter != null) {
        Object.keys(exported).map(function (key) {
          functions += ('\n                    @function ' + key + '($keys...) {\n                      @return ' + propQuery.getter + '((\n                        keys:$keys,\n                        data:$_' + key + ',\n                        name:\'' + key + '\'\n                      ));\n                    }').replace(/^                    /gm, '');
          if (propQuery.withKeys != null) {
            functions += ('\n                      @function ' + key + '-keys($keys...) {\n                        $result: ' + key + '($keys...);\n                        @return map-keys($result);\n                      }').replace(/^                      /gm, '');
          }
        });
      }

      if (propQuery.getter != null) {
        exported = Object.keys(exported).reduce(function (acc, key) {
          acc['_' + key] = exported[key];
          return acc;
        }, {});
      }

      var contents = parseJSON(exported) + functions;

      return {
        v: {
          contents: contents
        }
      };
    })();

    if (typeof _ret === 'object') return _ret.v;
  } else {
    return {
      file: fileUrl
    };
  }
};

function parseJSON(json) {
  return Object.keys(json).map(function (key) {
    return '$' + key + ': ' + parseValue(json[key]) + ';';
  }).join('\n');
}

function parseValue(value) {
  if (_lodash2['default'].isArray(value)) {
    return parseList(value);
  } else if (_lodash2['default'].isPlainObject(value)) {
    return parseMap(value);
  } else if (_lodash2['default'].isString(value) && value.match(/[\s,]/) && !value.match(/[()]/)) {
    return '"' + value + '"';
  } else {
    return value;
  }
}

function parseList(list) {
  return '(' + list.map(function (value) {
    return parseValue(value);
  }).join(',') + ')';
}

function parseMap(map) {
  return '(' + Object.keys(map).map(function (key) {
    return key + ': ' + parseValue(map[key]);
  }).join(',') + ')';
}
module.exports = exports['default'];
