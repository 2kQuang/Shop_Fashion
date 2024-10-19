const { series, parallel } = require('gulp');
const { css, copyFonts, lintStyles, lintStylesFix } = require('./tasks/css.js');
const { watch } = require('./tasks/watch.js');

const lint = lintStyles;
const lintFix = lintStylesFix;
const build = parallel(css, copyFonts, lint);
const develop = series(build, watch);

module.exports = {
  default: process.env.NODE_ENV === 'production' ? build : develop,
  lint,
  lintFix,
  css
};
