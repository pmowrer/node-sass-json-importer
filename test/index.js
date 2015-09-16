import jsonImporter from '../src/index';
import sass         from 'node-sass';
import {expect}     from 'chai';

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
});
