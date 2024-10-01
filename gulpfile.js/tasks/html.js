const gulp = require('gulp');
const { src, dest, series, lastRun } = gulp;
const pug = require('gulp-pug');
const pugLinter = require('gulp-pug-linter');
const htmlnano = require('gulp-htmlnano');
const PluginError = require('plugin-error');
const config = require('../config').html;
const fs = require('fs');
const argv = require('yargs').argv;
const through = require('through2');
const spelling = require('spelling');
const spellDictionary = require('../../fcdic_spellings.js');
const classDictionary = require('../../fcdic_classes.js');
const spellChecker = new spelling(spellDictionary);
const classChecker = new spelling(classDictionary);

const destDir = config.distribute.dir;
const pugGlob = config.source.glob.concat(config.source.ignore);

const buildHtml = () => {
  if (!fs.existsSync(config.source.dir)) {
    return Promise.resolve();
  }

  const stream = src(pugGlob.concat(['!' + config.source.dir + '/_*/**']), { since: lastRun(buildHtml) })
    .pipe(
      pug({
        pretty: true
      })
    );

  if (config.options.minify === true) {
    stream.pipe(htmlnano({
      removeComments: false
    }));
  }

  return stream.pipe(dest(destDir));
};

const lintHtml = () => {
  const stopOnError = argv.stopOnError || false;
  let filesToCheck = [config.source.dir + '/**/*.pug'];
  if (argv.file) {
    const targetFiles = argv.file.replace(/"/g, '').replace(/, /g, ',');
    filesToCheck = targetFiles.split(',');
  }
  return src(filesToCheck)
    .pipe(pugLinter({
      reporter: 'default',
      failAfterError: stopOnError
    }));
};

const spellCheck = () => {
  const stopOnError = argv.stopOnError || false;
  let filesToCheck = 'docs/**/*.html';
  if (argv.file) {
    const targetFiles = argv.file.replace(/"/g, '').replace(/, /g, ',');
    filesToCheck = targetFiles.split(',');
  }
  return src(filesToCheck)
    .pipe(through.obj((file, enc, cb) => {
      const content = file.contents.toString();
      const matches = content.match(/class="([^"]*)"/g);
      const classNames = matches
        .map(match => match.slice(7, -1).split(' '))
        .reduce((acc, val) => acc.concat(val), []);
      const uniqueWords = Array.from(new Set(classNames.flatMap(className => className.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(/[_-\s]/))));
      const misspelled = uniqueWords.filter((word) => {
        const itemResult = spellChecker.lookup(word);
        return !itemResult.found;
      });
      console.log(`Check spellings for ${file.path}`);
      if (misspelled.length) {
        const sortedWords = misspelled.sort();
        const errorMessage = '>> Wrong spelling in classes: ' + sortedWords.join(', ');
        console.error(errorMessage);
        if (stopOnError) {
          cb(new PluginError('spellCheck', 'Task failed!', { showProperties: false }));
        } else {
          cb(null, file);
        }

      } else {
        console.log('>> OK');
        cb(null, file);
      }
    }));
};

const classCheck = () => {
  const stopOnError = argv.stopOnError || false;
  let filesToCheck = 'docs/**/*.html';
  if (argv.file) {
    const targetFiles = argv.file.replace(/"/g, '').replace(/, /g, ',');
    filesToCheck = targetFiles.split(',');
  }
  return src(filesToCheck)
    .pipe(through.obj((file, enc, cb) => {
      const content = file.contents.toString();
      const matches = content.match(/class="([^"]*)"/g);
      const classNames = matches
        .map(match => match.slice(7, -1).split(' '))
        .reduce((acc, val) => acc.concat(val), []);
      const uniqueWords = Array.from(new Set(classNames.flatMap(className => className.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(/[_-\s]/))));
      const misspelled = uniqueWords.filter((word) => {
        const itemResult = classChecker.lookup(word);
        return !itemResult.found;
      });
      console.log(`Check classnames for ${file.path}`);
      if (misspelled.length) {
        const sortedWords = misspelled.sort();
        const errorMessage = '>> Unexpected words in classes: ' + sortedWords.join(', ');
        console.error(errorMessage);
        if (stopOnError) {
          cb(new PluginError('classCheck', 'Task failed!', { showProperties: false }));
        } else {
          cb(null, file);
        }
      } else {
        console.log('>> OK');
        cb(null, file);
      }
    }));
};

const html = series(buildHtml, lintHtml, spellCheck, classCheck);

module.exports = {
  buildHtml,
  lintHtml,
  spellCheck,
  classCheck,
  html
};

