const { series } = require('gulp');
const browserSync = require('browser-sync');
const config = require('../config').browserSync;

const webServer = () => {
  browserSync.create().init(config);
};

module.exports = {
  bs: series(webServer)
};
