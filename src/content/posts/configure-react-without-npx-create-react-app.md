---
title: "Configure React without npx create-react-app"
slug: "configure-react-without-npx-create-react-app"
publishedAt: "2020-12-08"
subtitle: "This post is about configure React with webpack and babel without npx create-react-app."
excerpt: "This post is about configure React with webpack and babel without npx create-react-app."
coverImage: "/images/posts/configure-react-without-npx-create-react-app/cover.webp"
tags: ["React", "Node.js", "Webpack", "Clean Code"]
---

This post is about configure React with webpack and babel without `npx create-react-app`.

# Comands used in this repository

## Install Dependencies

### Babel and webpack modules for transpile react `JSX` and `import` `export` like $ syntax

```plaintext
$ yarn add @babel/core @babel/preset-env @babel/preset-react webpack webpack-cli -D
```

### Install react and react dom

```plaintext
$ yarn add react react-dom
```

### Loader

```plaintext
$ yarn add babel-loader -D
```

## Configuration files:

### Babel

### Webpack

For webpack configuration we need to indicate dir locales for transpilation input and transpilation output:

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};
```

To configure loaders in webpack just add this:

```js
// ...
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  }
// ...
```

Each rule need some object scope `rule: [{a},{b}...]`. At exemple above we transpile all `js` modules in repo.

```json
"scripts": {
  "build": "webpack --mode production", // minified output
  "start": "webpack --mode development",
}
```

### Create `html` in `bundle.js` folder

In this repo I didn't use `npx create-react-app` in this case I will create html for transpiled script:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tech Lists</title>
</head>
<body>
  <script src="./bundle.js"></script>
</body>
</html>
```

### Automatic save-build script

For automate bundle use this:

```plaintext
$ yarn add webpack-dev-server -D
```

Add in webpack.config file:

```js
// ...
devServer: {
  contentBase: resolve(__dirname, 'dist')
},
```

```json
"scripts": {
  "build": "webpack --mode production",
  "start": "webpack-dev-server --mode development"
}
```

## Add syle loader for css

```plaintext
$ yarn add style-loader css-loader -D
```

## Add loader for images

```plaintext
$ yarn add file-loader -D
```

## Add plugin for no use constructor in class

```plaintext
$ yarn add @babel/plugin-proposal-class-properties -D
```

## Lib for debug wrong inputs

```plaintext
$ yarn add prop-types
```
