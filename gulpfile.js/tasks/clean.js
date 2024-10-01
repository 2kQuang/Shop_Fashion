const del = require('del');
const config = require('../config').base;

const cleanResources = () => {
  return del([config.distributeDir + '/css', config.distributeDir + '/img']);
};

module.exports = {
  cleanResources
};
