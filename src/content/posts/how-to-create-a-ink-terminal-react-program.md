---
title: "How to create a Ink Terminal React program"
slug: "how-to-create-a-ink-terminal-react-program"
publishedAt: "2020-12-14"
subtitle: "Explaining in a few words Ink is a library for building and testing command line applications using React components."
excerpt: "Explaining in a few words Ink is a library for building and testing command line applications using React components."
coverImage: "/images/posts/how-to-create-a-ink-terminal-react-program/cover.webp"
tags: ["React", "Node.js"]
---

## What it is Ink?!

Explaining in a few words Ink is a library for building and testing command line applications using React components.  

When I heard about a library that uses the same components of a web application to make a terminal program I was curious and intrigued to test it. That would be no more interesting than waiting for a machine to create a website for you.  

I've already created some scripts in Fish/Bash and had already found that sensational, but I am bound to say that Ink is much more incredible

## Installation

### Init repository

```bash
$# yarn init -y
```

### Install all components

```bash
$# yarn add ink@next react import-jsx
```

**This will install all three basics components for CLI React program:**

```json
{
  "dependencies": {
    "import-jsx": "^4.0.0",
    "ink": "^3.0.0-6",
    "react": "^16.13.1"
  }
}
```

### Files

**Create** `Hello.js` **and** `index.js` **file that way:**

```bash
├── Hello.js
├── index.js
├── /node_modules
├── package.json
└── yarn.lock
```

## The code

**In** `Hello.js` **import the required modules**

```js
const React = require('react');
const { render, Text } = require('ink');
```

**Create the class for React**

```js
class Hello extends React.Component {}
```

**Create** `contructor()` **and init** `super()` **that way:**

```js
class Hello extends React.Component {
  constructor() {
    super();
  }
}
```

**Create** `render()` **function:**  

This will create the information needed to render the text with the tag `<Text/>` and convert the text into the terminal.

```js
class Hello extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <Text>Hello World</Text>
    );
  }
}
```

**Call** `render(<Hello/>)` **at end:**

```js
class Hello extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <Text>Hello World</Text>
    );
  }
}
render(<Hello/>);
```

**Create import for the file** In `index.js` create some importJSX for render the `JSX`

```js
const importJsx = require('import-jsx');
importJsx('./Hello');
```

## Run!

```bash
$# node index.js
Hello World
```
