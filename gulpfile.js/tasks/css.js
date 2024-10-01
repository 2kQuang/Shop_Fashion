const { src, dest, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const scssSyntax = require('postcss-scss');
const sourcemaps = require('gulp-sourcemaps');
const replace = require('gulp-replace');
const config = require('../config').css;
const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;
const prettier = require('prettier');
const gulpPrettier = require('gulp-prettier');

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
  return lintStyles(true)
    .pipe(gulpPrettier({
      "printWidth": 160,
      "tabWidth": 2,
      "useTabs": false,
      "semi": true,
      "singleQuote": false,
      "trailingComma": "none",
      "bracketSpacing": true,
      "jsxBracketSameLine": false,
      "arrowParens": "always",
      "insertPragma": false,
      "requirePragma": false,
      "proseWrap": "preserve",
      "endOfLine": "lf"
    }))
    .pipe(dest(config.source.dir + '/scss'));
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
  if (!fs.existsSync(config.source.dir + '/fonts')) {
    return Promise.resolve();
  }
  return src(config.source.dir + '/fonts/**/*')
    .pipe(dest(destDir + '/fonts'));
}

const definedVariables = [];
const definedMixins = [];

const analyzeVariables = (done) => {
  return src(config.source.glob)
    .pipe(postcss([
      (root) => {
        root.walk((node) => {
          if (node.type === 'decl' && node.parent.type === 'root') {
            // Get defined variables
            if (node.prop.startsWith('$')) {
              definedVariables.push({
                name: node.prop,
                value: node.value,
                count: 0
              });
            }
          } else if (node.type === 'atrule') {
            if (node.name === 'mixin') {
              const params = node.params.split('(')[0].trim();
              definedMixins.push({
                name: params,
                count: 0
              });
            }
          }
        });
      }
    ], { syntax: scssSyntax }
    ))
    .on('error', function (error) {
      console.log(error.toString());
      this.emit('end');
    })
    .on('end', function () {
      done();
    })
}

const analyzeStyles = (done) => {
  const mediaQueries = new Set;
  const importantUsages = [];
  const colorValues = [];
  const fontfamilyValues = [];
  const fontsizeValues = [];
  const fontweightValues = [];
  const lineheightValues = [];
  const letterspacingValues = [];
  const textshadowValues = [];
  const boxshadowValues = [];
  const widthValues = [];
  const heightValues = [];
  const marginValues = [];
  const paddingValues = [];
  const borderValues = [];
  const topValues = [];
  const rightValues = [];
  const bottomValues = [];
  const leftValues = [];

  const sortedVariables = JSON.parse(JSON.stringify(definedVariables));
  sortedVariables.sort((a, b) => b.name.length - a.name.length);

  const sortedMixins = JSON.parse(JSON.stringify(definedMixins));
  sortedMixins.sort((a, b) => b.name.length - a.name.length);

  const convertArrayToScss = async (arr) => {
    let cssCode = '';
    for (let i = 0; i < arr.length - 1; i++) {
      cssCode += arr[i] + ' {';
    }
    cssCode += arr[arr.length - 1] + ' {}';
    for (let i = arr.length - 2; i >= 0; i--) {
      cssCode += '}';
    }
    const formattedCode = await prettier.format(cssCode, { parser: 'scss' });
    return formattedCode;
  }

  return src(config.source.glob)
    .pipe(postcss([
      async (root) => {

        const filePath = root.source.input.file;
        const fileName = path.relative(process.cwd(), filePath).replace(/\\/g, '/');

        const colorVariableNames = definedVariables
          .filter(item => /#|rgba?|hsla?/i.test(item.value))
          .map(item => item.name);

        root.walk(async (node) => {

          const selectorPath = [];
          let selector = '';
          let currentNode = node.parent;
          let mediaQuery = null;
          while (currentNode) {
            if (currentNode.type === 'rule') {
              if (!selector) {
                selector = currentNode.selector.trim();
              }
              const ruleSelector = currentNode.selector.trim();
              if (ruleSelector) {
                selectorPath.unshift(ruleSelector);
              }
            } else if (currentNode.type === 'atrule') {
              if (currentNode.name === 'media') {
                if (currentNode.parent.type === 'atrule') {
                  return;
                }
                mediaQueries.add(`@media ${currentNode.params}`);
                if (!mediaQuery) {
                  mediaQuery = `@media ${currentNode.params}`;
                }
              } else if (currentNode.name === 'include') {
                mediaQueries.add(`@include ${currentNode.params}`);
                if (!mediaQuery) {
                  mediaQuery = `@include ${currentNode.params}`;
                }
              } else if (currentNode.name === 'font-face') {
                if (!selector) {
                  selector = '@font-face';
                }
                selectorPath.unshift('@font-face');
              }
            }
            currentNode = currentNode.parent;
          }
          const selectorClasses = await convertArrayToScss(selectorPath);

          if (node.type === 'decl' || node.type === 'atrule') {

            // Get variable's frequency
            let compareString = '';
            if (node.type === 'decl') {
              compareString = node.value;
            } else {
              compareString = node.params;
            }
            sortedVariables.forEach((variable) => {
              const variableName = variable.name;
              if (compareString.includes(variableName)) {
                variable.count++;
                compareString = compareString.replace(variableName, '$___');
              }
            });

            let mixinString = '';
            if (node.name === 'include') {
              mixinString = node.params;
              sortedMixins.forEach((mixin) => {
                const mixinName = mixin.name;
                if (mixinString.includes(mixinName)) {
                  mixin.count++;
                  mixinString = mixinString.replace(mixinName, 'm___');
                }
              });
            }

          }

          if (node.type === 'decl') {

            // Get the usage of !important
            if (node.important) {
              importantUsages.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector,
                selectorClasses,
                mediaQuery,
                property: node.prop,
                value: node.value + ' !important',
              });
            }

            // Get colors
            if (
              (node.prop !== 'src') &&
              (
                /#|rgba?|hsla?/i.test(node.value) ||
                colorVariableNames.some(variable => node.value.includes(variable))
              )
            ) {
              if (!node.prop.startsWith('$')) {
                colorValues.push({
                  fileName,
                  filePath,
                  line: node.source.start.line,
                  column: node.source.start.column,
                  selector,
                  selectorClasses,
                  mediaQuery,
                  property: node.prop,
                  value: node.value
                });
              }
            }

            // Get font-family
            if (node.prop === 'font-family') {
              if (!node.prop.startsWith('$')) {
                fontfamilyValues.push({
                  fileName,
                  filePath,
                  line: node.source.start.line,
                  column: node.source.start.column,
                  selector,
                  property: node.prop,
                  selectorClasses,
                  mediaQuery,
                  value: node.value,
                });
              }
            }

            // Get font-size
            if (node.prop === 'font-size') {
              if (!node.prop.startsWith('$')) {
                fontsizeValues.push({
                  fileName,
                  filePath,
                  line: node.source.start.line,
                  column: node.source.start.column,
                  selector,
                  property: node.prop,
                  selectorClasses,
                  mediaQuery,
                  value: node.value,
                });
              }
            }

            // Get line-height
            if (node.prop === 'line-height') {
              lineheightValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get letter-spacing
            if (node.prop === 'letter-spacing') {
              letterspacingValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get font-weight
            if (node.prop === 'font-weight') {
              fontweightValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get text-shadow
            if (node.prop === 'text-shadow') {
              textshadowValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get box-shadow
            if (node.prop === 'box-shadow') {
              boxshadowValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get width
            if (node.prop === 'width' || node.prop === 'max-width' || node.prop === 'min-width') {
              widthValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get height
            if (node.prop === 'height' || node.prop === 'max-height' || node.prop === 'min-height') {
              heightValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get margin
            if (/margin/i.test(node.prop)) {
              marginValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get padding
            if (/padding/i.test(node.prop)) {
              paddingValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            if (node.prop.startsWith('border')) {
              borderValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get top
            if (node.prop === 'top') {
              topValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get right
            if (node.prop === 'right') {
              rightValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get bottom
            if (node.prop === 'bottom') {
              bottomValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }

            // Get left
            if (node.prop === 'left') {
              leftValues.push({
                fileName,
                filePath,
                line: node.source.start.line,
                column: node.source.start.column,
                selector,
                property: node.prop,
                selectorClasses,
                mediaQuery,
                value: node.value,
              });
            }
          }
        })
      }
    ], { syntax: scssSyntax }
    ))
    .on('error', function (error) {
      console.log(error.toString());
      this.emit('end');
    })
    .on('end', function () {

      definedVariables.forEach((variable) => {
        variable.count = sortedVariables.find((v) => v.name === variable.name).count;
      });

      definedMixins.forEach((mixin) => {
        mixin.count = sortedMixins.find((v) => v.name === mixin.name).count;
      });

      const dataObject = {
        analyzedTime: new Date(),
        mediaQueries: Array.from(mediaQueries).sort(),
        definedVariables,
        definedMixins,
        importantUsages,
        colorValues,
        fontfamilyValues,
        fontsizeValues,
        fontweightValues,
        lineheightValues,
        letterspacingValues,
        widthValues,
        heightValues,
        marginValues,
        paddingValues,
        textshadowValues,
        boxshadowValues,
        topValues,
        rightValues,
        bottomValues,
        leftValues
      };
      const templatePath = 'scss-analyze-report.tpl';
      const templateContent = fs.readFileSync(templatePath, 'utf-8');
      const htmlContent = templateContent.replace('{/* DATA_PLACEHOLDER */}', JSON.stringify(dataObject, null, 2));
      const outputFilePath = 'scss-analyze-report.html';
      fs.writeFileSync(outputFilePath, htmlContent);
      fs.writeFileSync('scss-analyze-report.json', JSON.stringify(dataObject, null, 2));
      done();
    });
};

const css = series(buildStyles, lintStyles);
const analyze = series(analyzeVariables, analyzeStyles);

module.exports = {
  lintStyles,
  lintStylesFix,
  buildStyles,
  copyFonts,
  css,
  analyze
};
