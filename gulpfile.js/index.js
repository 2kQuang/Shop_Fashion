const { series, parallel } = require('gulp');
const { cleanResources } = require('./tasks/clean.js');
const { html, buildHtml, lintHtml, spellCheck, classCheck } = require('./tasks/html.js');
const { css, buildStyles, lintStyles, lintStylesFix, copyFonts, analyze } = require('./tasks/css.js');
const { js, buildJs, lintJs } = require('./tasks/js.js');
const { imageMin, convertToWebp } = require('./tasks/image.js');
const { bs } = require('./tasks/browser_sync.js');
const { watch } = require('./tasks/watch.js');

const lint = series(lintHtml, lintStyles, lintJs, spellCheck, classCheck);
const lintFix = series(lintHtml, lintStylesFix, lintJs, spellCheck, classCheck);
const build = series(cleanResources, buildHtml, buildStyles, buildJs, imageMin, copyFonts, lint);
const develop = series(cleanResources, buildHtml, buildStyles, buildJs, imageMin, copyFonts, parallel(bs, watch));

module.exports = {
  default: process.env.NODE_ENV === 'production' ? build : develop,
  cleanResources,
  bs,
  html,
  css,
  js,
  lintHtml,
  lintJs,
  imageMin,
  convertToWebp,
  lint,
  lintFix,
  spellCheck,
  classCheck,
  buildStyles,
  lintStyles,
  lintStylesFix,
  analyze
};
