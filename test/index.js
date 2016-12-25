/* eslint-env mocha */
import jsonImporter, {
  isJSONfile
}                   from '../src/index';
import sass         from 'node-sass';
import {expect}     from 'chai';
import {resolve}    from 'path';

const requiredImporter = require('../src/index');
const EXPECTATION = 'body {\n  color: #c33; }\n';

describe('Import type test', function() {
  it('imports strings', function() {
    let result = sass.renderSync({
      file: './test/fixtures/strings/style.scss',
      importer: jsonImporter
    });

    expect(result.css.toString()).to.eql(EXPECTATION);
  });

  it('imports lists', function() {
    let result = sass.renderSync({
      file: './test/fixtures/lists/style.scss',
      importer: jsonImporter
    });

    expect(result.css.toString()).to.eql(EXPECTATION);
  });

  it('imports maps', function() {
    let result = sass.renderSync({
      file: './test/fixtures/maps/style.scss',
      importer: jsonImporter
    });

    expect(result.css.toString()).to.eql(EXPECTATION);
  });

  it('escapes strings when escapeStrings option is set', function() {
    const escapeStringsExpectation = `#results > li:before {
  color: red;
  content: "sony"; }

#results2 > li:before {
  color: red;
  content: "sony"; }
`
    let result = sass.renderSync({
      file: './test/fixtures/escape-strings/style.scss',
      escapeStrings: true,
      importer: jsonImporter
    });

    expect(result.css.toString()).to.eql(escapeStringsExpectation);
  });

  it(`throws on complex JSON when escapeStrings option is not set`, function() {
    function render() {
      sass.renderSync({
        file: './test/fixtures/escape-strings/style.scss',
        importer: jsonImporter
      });
    }

    expect(render).to.throw(
      'Invalid CSS after "...gle,patterns: (": expected expression (e.g. 1px, bold), was "*//*.google.*/*),se"'
    );
  });

  it('finds imports via includePaths', function() {
    let result = sass.renderSync({
      file: './test/fixtures/include-paths/style.scss',
      includePaths: ['./test/fixtures/include-paths/variables'],
      importer: jsonImporter
    });

    expect(result.css.toString()).to.eql(EXPECTATION);
  });

  it('finds imports via multiple includePaths', function() {
    let result = sass.renderSync({
      file: './test/fixtures/include-paths/style.scss',
      includePaths: ['./test/fixtures/include-paths/variables', './some/other/path/'],
      importer: jsonImporter
    });

    expect(result.css.toString()).to.eql(EXPECTATION);
  });

  it(`throws when an import doesn't exist`, function() {
    function render() {
      sass.renderSync({
        file: './test/fixtures/include-paths/style.scss',
        includePaths: ['./test/fixtures/include-paths/foo'],
        importer: jsonImporter
      });
    }

    expect(render).to.throw(
      'Unable to find "variables.json" from the following path(s): ' +
      `${resolve(process.cwd(), 'test/fixtures/include-paths')}, ./test/fixtures/include-paths/foo. ` +
      'Check includePaths.'
    );
  });

  it('ignores non-json imports', function() {
    let result = sass.renderSync({
      file: './test/fixtures/non-json/style.scss',
      importer: jsonImporter
    });

    expect(result.css.toString()).to.eql(EXPECTATION);
  });

  // TODO: Added to verify named exports + CommonJS default export hack (see index.js).
  it('provides the default export when using node require to import', function() {
    let result = sass.renderSync({
      file: './test/fixtures/strings/style.scss',
      importer: requiredImporter
    });

    expect(result.css.toString()).to.eql(EXPECTATION);
  });

  // TODO: Added to verify named exports + CommonJS default export hack (see index.js).
  it('provides named exports of internal methods', function() {
    expect(isJSONfile('import.json')).to.be.true;
  });
});
