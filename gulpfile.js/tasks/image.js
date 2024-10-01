const { src, dest } = require('gulp');
const changed = require('gulp-changed');
const imageMinify = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const webp = require('gulp-webp');
const config = require('../config').image;

const destDir = config.distribute.dir;

const imageMin = () => {
  return src(config.source.glob.concat(config.source.ignore))
    .pipe(changed(destDir + '/img'))
    .pipe(imageMinify([
      pngquant({
        quality: [0.7, 0.8],
        speed: 1,
      }),
      mozjpeg({ progressive: true, quality: 70 }),
      imageMinify.svgo({
        plugins: [{ removeViewBox: false }],
      }),
      imageMinify.optipng(),
      imageMinify.gifsicle({ optimizationLevel: 3 }),
    ]))
    .pipe(dest(destDir + '/img'));
};

const convertToWebp = () => {
  return src(config.source.glob.concat(config.source.ignore))
    .pipe(imageMinify([
      pngquant({
        quality: [0.7, 0.8],
        speed: 1,
      }),
      mozjpeg({ progressive: true, quality: 70 }),
      imageMinify.svgo({
        plugins: [{ removeViewBox: false }],
      }),
      imageMinify.optipng(),
      imageMinify.gifsicle({ optimizationLevel: 3 }),
    ]))
    .pipe(webp({
      quality: 80,
      method: 6
    }))
    .pipe(dest(destDir + '/img'));
};

module.exports = {
  imageMin,
  convertToWebp
};
