---
title: "How to install and use Handlebars with express"
slug: "how-to-install-and-use-handlebars-with-express"
publishedAt: "2020-12-02"
subtitle: "Guia prático de como instalar e configurar o template engine Handlebars no Express."
excerpt: "Guia prático de como instalar e configurar o template engine Handlebars no Express."
coverImage: "/images/posts/how-to-install-and-use-handlebars-with-express/cover.webp"
tags: ["Node.js", "JavaScript"]
---

## Requirements:

* `node`

* `express`

* `nodemon`

## Install

```plaintext
$ yarn add express-handlebars
```

### Files:

```plaintext
src
  ├── node_modules
  └── app.js
```

## In app.js create express server:

```javascript
const express = require('express');

const app = express();

const handlebars = require('express-handlebars');

app.listen(8080);
```

### Create handlebars in `views` folder:

```plaintext
/src
  ├── /node_modules
  ├── app.js
  └── /views
       └── layouts
           └── main.hbs
```

### `main.hbs`

```plaintext
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Handlebars exemple</title>
  </head>
  <body>{{{ body }}}</body>
</html>
```

### Configure in `app.js`

```javascript
[...]
app.engine('hbs', handlebars({ extName: 'hbs }));
app.set('view engine', 'hbs');
[...]
```

### Create exemple in `views` folder:

```plaintext
/src
  ├── /node_modules
  ├── app.js
  └── /views
       ├── layouts
       │    └── main.hbs
       └── exemple.hbs
```

### Create routes:

```javascript
app.get('/form', function(request, response) {
  response.render('exemple');
});
```

### Create `exemple.hbs`

```hbs
<h1>Form exemple</h1>
<table>
  <tr>
    <th>Name</th>
    <th>Email</th>
  </tr>
  {{#each someJson}}
    <tr>
      <td>{{ name }}</td>
      <td>{{ email }}</td>
    </tr>
  {{/each}}
</table>
```

### Change in `app.js`

```javascript
const someJson = require('./some_json.json');

app.get('/form', function(request, response){
  response.render('exemple', { someJson: someJson });
});
```
