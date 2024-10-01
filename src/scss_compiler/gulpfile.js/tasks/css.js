const { src, dest, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const scssSyntax = require('postcss-scss');
const sourcemaps = require('gulp-sourcemaps');
const replace = require('gulp-replace');
const config = require('../config').css;
const fs = require('fs');
const argv = require('yargs').argv;

const destDir = config.distribute.dir;
const cssGlob = config.source.glob.concat(config.source.ignore);

const customLint = (root, result) => {
  root.walk((node) => {
    if (node.type === 'atrule') {
      if ((node.name === 'media' || node.name === 'include') && node.parent.type === 'root') {
        if (node.params !== 'print') {
          result.warn(`Do not use @media or @include in root-level. Found: @${node.name}`, {
            node: node,
          });
        }
      }
    } else if (node.type === 'decl') {
      if (node.value.indexOf('\'') !== -1) {
        result.warn(`Use double quotes instead of single quotes in SCSS files. Property: ${node.prop}`, {
          node: node,
        });
      }
      if (/-\d+(\.\d+)?/g.test(node.value)) {
        result.warn(`Avoid using negative values. Property: ${node.prop}`, {
          node: node,
        });
      }
    } else if (node.type === 'rule') {
      const selectors = node.selector.split(',');
      selectors.forEach((selector) => {
        if (selector.includes(':not')) {
          result.warn(`Avoid using :not() selector in SCSS. Selector: ${selector}`, {
            node: node,
          });
        }
      });
    }
  });
};

const lintStyles = (fix = false) => {
  const stopOnError = argv.stopOnError || false;
  const isFix = (typeof fix === 'boolean' && fix === true) ? true : false;
  let filesToCheck = config.source.glob;
  if (argv.file) {
    const targetFiles = argv.file.replace(/"/g, '').replace(/, /g, ',');
    filesToCheck = targetFiles.split(',');
  }
  return src(filesToCheck)
    .pipe(postcss([
      require('stylelint')({
        configFile: '.stylelintrc.json',
        formatter: 'string',
        ignoreDisables: false,
        failOnError: true,
        outputFile: '',
        reportNeedlessDisables: false,
        quietDeprecationWarnings: true,
        fix: isFix,
        syntax: 'scss'
      }),
      customLint,
      require('postcss-reporter')({
        noIcon: true,
        noPlugin: true,
        throwError: stopOnError
      })
    ], { syntax: scssSyntax })
    );
};

const lintStylesFix = () => {
  return lintStyles(true).pipe(dest(config.source.dir + '/scss'));
};

const buildStyles = () => {
  if (!fs.existsSync(config.source.dir + '/scss')) {
    return Promise.resolve();
  }

  const transpileOptions = [
    require('autoprefixer')({
      map: false,
      cascade: false
    })
  ];

  if (config.options.minify) {
    transpileOptions.push(require('cssnano')({
      preset: 'default'
    }));
  }

  return src(cssGlob)
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.identityMap())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(postcss(transpileOptions, { syntax: scssSyntax }))
    .pipe(sourcemaps.write('.'))
    .pipe(replace(/\n$/, ''))
    .pipe(dest(destDir + '/css'));
};

const copyFonts = () => {
  if (!fs.existsSync(config.source.dir + '/scss/fonts')) {
    return Promise.resolve();
  }
  return src(config.source.dir + '/scss/fonts/**/*')
    .pipe(dest(config.source.dir + '/css/fonts'));
}

const css = series(lintStyles, buildStyles);

module.exports = {
  lintStyles,
  lintStylesFix,
  buildStyles,
  copyFonts,
  css
};
