const { watch, series } = require('gulp');
const del = require('del');
const path = require('path');
const config = require('../config');

const monitoring = () => {

  const sass = watch(['../scss/**/*.scss'].concat(config.base.ignore), series('css'));
  sass.on('all', function (event, filepath) {
    console.log(`File ${filepath} was changed`);
    if (event === 'unlink') {
      const filePathFromSrc = path.relative(path.resolve(config.base.dir), filepath);
      const distFilePath = path.resolve(config.css.distribute.dir, filePathFromSrc).replace(/(?:\\|\/)?scss(?:\\|\/)?/, path.sep).replace(/\.scss$/, '.css');
      del([distFilePath]);
    }
  });

};

const watchTask = monitoring;

module.exports = {
  watch: watchTask
};
