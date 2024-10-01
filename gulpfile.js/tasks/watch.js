const { src, dest, watch, series } = require('gulp');
const del = require('del');
const path = require('path');
const config = require('../config');
const destDir = config.base.distributeDir;

const monitoring = () => {

  const pug = watch(['src/pug/**/*.pug'].concat(config.html.source.ignore), series('html'));
  pug.on('all', function (event, filepath) {
    console.log(`File ${filepath} was changed`);
    if (event === 'unlink') {
      const commonPartFolders = ['_layouts', '_mixins', '_parts'];
      const filePathFromSrc = path.relative(path.resolve(config.html.source.dir), filepath);
      const parsedPath = path.parse(filePathFromSrc);
      const dirName = parsedPath.dir;
      const containsPartFolder = commonPartFolders.some(folder => dirName.includes(folder));
      if (!containsPartFolder) {
        const distFilePath = path.resolve(config.html.distribute.dir, filePathFromSrc).replace(/(?:\\|\/)?pug(?:\\|\/)?/, path.sep).replace(/\.pug$/, '.html');
        del([distFilePath]);
      }
    }
  });

  const sass = watch(['src/scss/**/*.scss'].concat(config.html.source.ignore), series('css'));
  sass.on('all', function (event, filepath) {
    console.log(`File ${filepath} was changed`);
    if (event === 'unlink') {
      const filePathFromSrc = path.relative(path.resolve(config.html.source.dir), filepath);
      const distFilePath = path.resolve(config.css.distribute.dir, filePathFromSrc).replace(/(?:\\|\/)?scss(?:\\|\/)?/, path.sep).replace(/\.scss$/, '.css');
      del([distFilePath]);
    }
  });

  const js = watch(['src/js/**/*.js'].concat(config.js.source.ignore), series('js'));
  js.on('all', function (event, filepath) {
    if (event === 'unlink') {
      const regExpSrc = new RegExp(config.js.source.dir);
      const distSrc = filepath.replace(regExpSrc, config.js.distribute.dir);
      del([distSrc]);
    }
    console.log(`File ${filepath} was changed`);
  });

  const images = watch(['src/img/**/*.{png,jpg,gif,svg}'].concat(config.base.ignore));
  images.on('all', (event, filepath) => {
    if (event === 'add' || event === 'change') {
      src(filepath, { base: config.image.source.dir })
        .pipe(dest(destDir + '/img'));
    } else if (event === 'unlink') {
      const filePathFromSrc = path.relative(path.resolve(config.base.sourceDir), filepath);
      let distFilePath = path.resolve(config.base.distributeDir, filePathFromSrc);
      del([distFilePath]);
    }
    console.log(`File ${filepath} was changed`);
  });

};

const watchTask = monitoring;

module.exports = {
  watch: watchTask
};
