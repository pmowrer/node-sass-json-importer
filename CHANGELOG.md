# Changelog

## 3.1.6
* Filter out `#` as value for a variable

## 3.1.5
* Reverts `3.1.4`. We aren't able to find a way to support automatic handling of values containing `,` that isn't full of edge cases. The recommendation remains to wrap such values in single quotes if they're meant to be interpreted as strings.

## 3.1.4
* Convert values containing commas inside of an object into strings

## 3.1.3
* Extend key filtering to nested maps

## 3.1.2
* Filter out invalid variable names to prevent Sass compiler from crashing

## 3.1.1
* Return empty strings correctly to prevent Sass compiler from crashing

## 3.1.0
* Add support for `.json5` files

## 3.0.2
##### Fixes
* Fix `includePaths` option for Windows users by using the environment's delimiter instead of harcoding unix's.

## 3.0.1
##### Fixes
* Update `node-sass` dependency versions from `^3.5.3` to `>=3.5.3` to allow using 4.x and above without triggering npm warnings.
* Add `yarn.lock`.

## 3.0.0
##### (Possibly) Breaking
* If parsing errors out, catch and return a well formed `Error` as per [`node-sass` best-practices for importers](https://github.com/sass/node-sass/blob/dc92c18e1dffd4acbab69e76c4bcda238f52da27/README.md#importer--v200---experimental) (see "Starting from v3.0.0:" section).

## 2.1.1
##### Fixes
* Fix 2.1.0 breaking the default export for CommonJS.

## 2.1.0
##### Features
* Export internal methods that compose the importer. E.g. `transformJSONtoSass` can now be used independently of `node-sass` to transform parsed JSON into Sass.

## 2.0.0
##### Breaking
* Add `node-sass` `^3.5.3` as a `peerDependency`.

##### Fixes
* Return plain `null` instead of `sass.NULL` when not handling an import per [updated guidelines](https://github.com/sass/node-sass/blob/master/README.md#importer--v200---experimental). https://github.com/sass/node-sass/issues/1291

## 1.0.6
##### Fixes
* Invalidate `require` cache on each importer run.

## 1.0.5
##### Fixes
* Return `sass.NULL` when not handling an import per [`node-sass` guidelines](https://github.com/sass/node-sass/blob/fe8dbae1ddbbb602bf508d63b558a003f496f9b6/README.md#importer--v200---experimental).

## 1.0.4
##### Fixes
* Revert attempting to wrap strings with spaces/commas (wrap strings in extra quotes instead).

## 1.0.3
##### Fixes
* Fix importing strings with spaces/commas breaking. **Reverted in 1.0.4**

## 1.0.2
##### Fixes
* Fix `includePaths` not working with multiple entries.
