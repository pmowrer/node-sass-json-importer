/* eslint-env mocha */
import jsonImporter, {isJSONfile, parseValue} from '../src';
import sass                                   from 'node-sass';
import {expect}                               from 'chai';
import {resolve}                              from 'path';

const requiredImporter = require('../src/index');
const EXPECTATION = 'body {\n  color: #c33; }\n';

describe('node-sass-json-importer', function() {
  // TODO: Added to verify named exports + CommonJS default export hack (see index.js).
  it('provides the default export when using node require to import', function() {
    let result = sass.renderSync({
      file: './test/fixtures/strings/style.scss',
      importer: requiredImporter,
    });

    expect(result.css.toString()).to.eql(EXPECTATION);
  });

  // TODO: Added to verify named exports + CommonJS default export hack (see index.js).
  it('provides named exports of internal methods', function() {
    expect(isJSONfile('import.json')).to.be.true;
  });
});

describe('Import type test (JSON)', function() {
  it('imports strings', function() {
    let result = sass.renderSync({
      file: './test/fixtures/strings/style.scss',
      importer: jsonImporter,
    });

    expect(result.css.toString()).to.eql(EXPECTATION);
  });

  it('imports lists', function() {
    let result = sass.renderSync({
      file: './test/fixtures/lists/style.scss',
      importer: jsonImporter,
    });

    expect(result.css.toString()).to.eql(EXPECTATION);
  });

  it('imports maps', function() {
    let result = sass.renderSync({
      file: './test/fixtures/maps/style.scss',
      importer: jsonImporter,
    });

    expect(result.css.toString()).to.eql(EXPECTATION);
  });

  it('finds imports via includePaths', function() {
    let result = sass.renderSync({
      file: './test/fixtures/include-paths/style.scss',
      includePaths: ['./test/fixtures/include-paths/variables'],
      importer: jsonImporter,
    });

    expect(result.css.toString()).to.eql(EXPECTATION);
  });

  it('finds imports via multiple includePaths', function() {
    let result = sass.renderSync({
      file: './test/fixtures/include-paths/style.scss',
      includePaths: ['./test/fixtures/include-paths/variables', './some/other/path/'],
      importer: jsonImporter,
    });

    expect(result.css.toString()).to.eql(EXPECTATION);
  });

  it(`throws when an import doesn't exist`, function() {
    function render() {
      sass.renderSync({
        file: './test/fixtures/include-paths/style.scss',
        includePaths: ['./test/fixtures/include-paths/foo'],
        importer: jsonImporter,
      });
    }

    expect(render).to.throw(
      'Unable to find "variables.json" from the following path(s): ' +
      `${resolve(process.cwd(), 'test/fixtures/include-paths')}, ${process.cwd()}, ./test/fixtures/include-paths/foo. ` +
      'Check includePaths.'
    );
  });

  it('ignores non-json imports', function() {
    let result = sass.renderSync({
      file: './test/fixtures/non-json/style.scss',
      importer: jsonImporter,
    });

    expect(result.css.toString()).to.eql(EXPECTATION);
  });

  it('imports empty strings correctly', function() {
    let result = sass.renderSync({
      file: './test/fixtures/empty-string/style.scss',
      importer: jsonImporter,
    });

    expect(result.css.toString()).to.eql('body {\n  color: ""; }\n');
  });
});

describe('Import type test (JSON5)', function() {
  it('imports strings', function() {
    let result = sass.renderSync({
      file: './test/fixtures-json5/strings/style.scss',
      importer: jsonImporter,
    });

    expect(result.css.toString()).to.eql(EXPECTATION);
  });

  it('imports lists', function() {
    let result = sass.renderSync({
      file: './test/fixtures-json5/lists/style.scss',
      importer: jsonImporter,
    });

    expect(result.css.toString()).to.eql(EXPECTATION);
  });

  it('imports maps', function() {
    let result = sass.renderSync({
      file: './test/fixtures-json5/maps/style.scss',
      importer: jsonImporter,
    });

    expect(result.css.toString()).to.eql(EXPECTATION);
  });

  it('finds imports via includePaths', function() {
    let result = sass.renderSync({
      file: './test/fixtures-json5/include-paths/style.scss',
      includePaths: ['./test/fixtures-json5/include-paths/variables'],
      importer: jsonImporter,
    });

    expect(result.css.toString()).to.eql(EXPECTATION);
  });

  it('finds imports via multiple includePaths', function() {
    let result = sass.renderSync({
      file: './test/fixtures-json5/include-paths/style.scss',
      includePaths: ['./test/fixtures-json5/include-paths/variables', './some/other/path/'],
      importer: jsonImporter,
    });

    expect(result.css.toString()).to.eql(EXPECTATION);
  });

  it(`throws when an import doesn't exist`, function() {
    function render() {
      sass.renderSync({
        file: './test/fixtures-json5/include-paths/style.scss',
        includePaths: ['./test/fixtures-json5/include-paths/foo'],
        importer: jsonImporter,
      });
    }

    expect(render).to.throw(
      'Unable to find "variables.json5" from the following path(s): ' +
      `${resolve(process.cwd(), 'test/fixtures-json5/include-paths')}, ${process.cwd()}, ./test/fixtures-json5/include-paths/foo. ` +
      'Check includePaths.'
    );
  });

  it('ignores non-json imports', function() {
    let result = sass.renderSync({
      file: './test/fixtures-json5/non-json/style.scss',
      importer: jsonImporter,
    });

    expect(result.css.toString()).to.eql(EXPECTATION);
  });

  it('imports empty strings correctly', function() {
    let result = sass.renderSync({
      file: './test/fixtures-json5/empty-string/style.scss',
      importer: jsonImporter,
    });

    expect(result.css.toString()).to.eql('body {\n  color: ""; }\n');
  });
});

describe('parseValue', function() {
  it('returns comma-separated items wrapped in parentheses for an array', function() {
    expect(parseValue(['some', 'entries'])).to.eql('(some,entries)');
  });

  it('calls comma-separated key value pairs wrapped in parentheses for an object', function() {
    expect(parseValue({'key1': 'value1', 'key2': 'value2'})).to.eql('(key1: value1,key2: value2)');
  });

  it('returns an empty string in an empty for empty strings', function() {
    expect(parseValue("")).to.eql('""');
  });

  it('returns the raw value if not an array, object or empty string', function() {
    expect(123).to.eql(123);
  });
});

describe('isJSONfile', function() {
  it('returns true if the given URL is a JSON file', function() {
    expect(isJSONfile('/test/variables.json')).to.be.true;
  });

  it('returns true if the given URL is a JSON5 file', function() {
    expect(isJSONfile('/test/variables.json5')).to.be.true;
  });

  it('returns false if the given URL is not a JSON or JSON5 file', function() {
    expect(isJSONfile('/test/variables.not-json-or-json5')).to.be.false;
  });
});
