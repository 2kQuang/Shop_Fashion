# Getting started

This template is made by Gulp and Gulp's plugins that are installed and managed via npm, the Node.js package manager. It requires stable Node.js version 18 or 20.

# Install the Gulp CLI for the first time of using

You’ll need to install Gulp’s command line interface (CLI) globally. You may need to use `sudo` (for OSX, \*nix, BSD etc) or run your command shell as `Administrator` (for Windows) to do this.

```sh
npm install -g gulp-cli
```

# Install npm dependencies

Just simply to use this command

```sh
npm install
```

# Build files and start development mode

Build files and make them ready for your production environment. You will get the files in the `docs` folder.
Beside, it will automatically launch your default web browser to display the current coding, and watch for changes in the "src" folder
Minify images and Lint check will run also.

```sh
npm run dev
```

# Build files

Build files and make them ready for your production environment. You will get the files in the `docs` folder
Minify images and Lint check will run also.

```sh
npm run build
```

# Minify images

Use this command after done developing or whenever you want to compress all image files again:

```sh
npm run imagemin
```

Note: We use kraken.io service to minify images, you can update setting to your kraken.io account by updating the `CONFIG.image.options.kraken` property in the `gulpfile.js/config/index.js` file

# Lint check

Use this command after done developing or whenever you want to check for lint problems again:

```sh
npm run lint
```

To automatically fix linting issues, if possible, use this command:

```sh
npm run lint:fix
```

# Minify HTML files

To minify HTML files, go to `gulpfile.js/config/index.js` file in your template. Update `minify: false` option from `false` to `true` in `html: {...}` block of code like below:

```sh
html: {
  ...
  options: {
    minify: true
  }
},
```

# Minify CSS files

To minify CSS files, go to `gulpfile.js/config/index.js` file in your template. Update `minify: false` option from `false` to `true` in `css: {...}` block of code like below:

```sh
css: {
  ...
  options: {
    minify: true
  }
},
```

# Minify JS files

To minify JS files, go to `gulpfile.js/config/index.js` file in your template. Update `minify: false` option from `false` to `true` in `js: {...}` block of code like below:

```sh
js: {
  ...
  options: {
    minify: true
  }
},
```

