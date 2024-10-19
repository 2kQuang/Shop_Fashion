const baseConfig = {
  sourceDir: '..',
  distributeDir: '..',
  ignore: ['!**/.DS_Store', '!**/* copy.*']
};

module.exports = {
  base: baseConfig,
  css: {
    source: {
      dir: baseConfig.sourceDir,
      glob: [baseConfig.sourceDir + '/scss/**/*.scss'],
      ignore: [].concat(baseConfig.ignore)
    },
    distribute: {
      dir: baseConfig.distributeDir
    },
    options: {
      minify: false
    }
  }
};
