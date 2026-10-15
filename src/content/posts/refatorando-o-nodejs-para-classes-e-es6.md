---
title: "Refatorando o NodeJS para classes e ES6"
slug: "refatorando-o-nodejs-para-classes-e-es6"
publishedAt: "2020-12-01"
subtitle: "Você sabe usar classes no Node.js? Vamos fazer um exercício rápido:..."
excerpt: "Você sabe usar classes no Node.js? Vamos fazer um exercício rápido:"
coverImage: "/images/posts/refatorando-o-nodejs-para-classes-e-es6/cover.webp"
tags: ["React", "Node.js", "MongoDB", "JavaScript"]
---

Você sabe usar classes no Node.js? Vamos fazer um exercício rápido:

```jsx
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var swig = require('swig');
var port = 8000;
var app = express();

mongoose.connect('mongodb://localhost/meetings');

app.engine('html', swig.renderFile);

app.set('views', path.join(__dirname, 'views'));
app.set('view_engine', 'html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(request, response){
    response.render('index.html');
});

app.listen(port);
```

Quais são os primeiros e mais notáveis problemas desse código?

Se você disse a dificuldade de ser escalável você acertou. Os outros pontos são detalhes, como o  uso do `var` e do `function` como parâmetros das funções. Aqui queremos que o código seja escalável e as classes tem este objetivo.

Se você quer ter certeza se um código é escalável, pense da seguinte forma: Se surgir novas aplicações / funções / bibliotecas e elas tenderem ao infinito, conseguirei achar facilmente e identificar o que faz o que no código? Se a resposta for não, você precisa refatorar seu código, agora se a resposta for sim você provavelmente está mentindo, pois não há código que não possa melhorar e ser refatorado.

Os códigos são escritos para os outros e para você, e no caso o seu eu do futuro deve conseguir ler e entender sem a ajuda de comentários. Esse é o mínimo que ao criar um código de alto nível deve oferecer. Escrever para os outros é outra forma melhor ainda, principalmente se você trabalha em projetos Open Sources, Softwares Livres ou em uma equipe fechada. Em todas essas possibilidades é necessário buscar padrões escaláveis, dessa forma, as classes em Javascript vem como uma mão na roda.

# O uso de `var`

O problema de declarar uma variável com `var` não é relacionado a ele próprio, não é porque há um código que usa `var` invés de `const` que a conclusão imediata deve ser que está errado. Muito pelo contrário, o `var` depende do contexto. 

Basicamente uma variável usada com `var` define que independente do escopo ela poderá ser usada. É como se ela fosse um tipo promiscuo de tipagem, portanto se não quisermos que ela possa ser acessada ou redeclarada por outra parte do código não poderemos usar.

Use primeiro `const` de imediato em todos os códigos, depois avalie se cada variável declarada ali necessita de mudar o valor dentro de um escopo, nesse caso use `let` , se ela precisar ser acessada e re-declarada independente do escopo, use `var`. 

Tome muito cuidado ao avaliar cada uma dessas propostas que citei acima, redeclarar a variável não é o mesmo de mudar uma variável. A redeclaração da variável acontece durante o fluxo do código e não quando você altera a variável no escopo do código. Dessa forma, muito cuidado!

Vamos retomar nosso código e aplicar a regra para as variáveis:

```jsx
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const swig = require('swig');
const port = 8000;
const app = express();
```

Intuitivamente podemos perceber 3 tipos de declarações aqui. A primeira variável `const express` é uma importação de uma biblioteca. Já o `port` é uma constante que será usada abaixo no `listen();`, portanto nunca será mudada por nosso código. O `app`, é uma constante que recebe a execução da constante `express`que citei acima.

A vantagem de usar uma linguagem que é direcionada aos objetos é que podemos impedir que as variáveis sejam mudadas futuramente. Isso nos dá uma segurança maior com o código, e temos a certeza que nada será mudado "por acaso" dentro do código. Com isso, mudamos os valores de suas propriedades e métodos sem provocar conflito invés de mudar as variáveis em si no escopo global ou até mesmo local. No nosso caso, nenhuma variável será necessária mudar para `let` ou `var` .

# Arrow functions

Outra novidade é as `arrow functions`. Arrow functions são nada mais e nada menos que funções anônimas que são passadas como parâmetros de uma função.

Dessa forma podemos refatorar o código da seguinte forma:

```jsx
app.get('/', (request, response) => {
    response.render('index.html');
});
```

# Classes

A vantagem em usar classes é que com elas podemos abstrair boa parte do nosso código tornando sua leitura mais facil e menos confusa.  Se tomarmos como base que temos que iniciar o banco de dados, renderizar as views e indicar cofigurações para o express podemos definir algumas funções aqui:

```jsx
class Server {
    constructor() {
        this.initDB();
        this.initViewEngine();
        this.initExpressMiddleware();
        this.initRoutes();
        this.start();
    }
    initDB(){
        mongoose.connect('mongodb://localhost/meetings');
    }
    initViewEngine() {
        app.engine('html', swig.renderFile);
        app.set('views', path.join(__dirname, 'views'));
        app.set('view_engine', 'html');
    }
    initExpressMiddleware() {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
  }
    initRoutes() {
        app.get('/', (request, response) => {
            response.render('index.html');
        });
  }
    start(){
        app.listen(port);
    }

}

new App();
```

Porém o código ainda não está satisfatório, podemos melhorar ele ainda mais criando uma estrutura e separando ele em várias camadas. A ideia de camada vem quando vemos a necessidade de tornar partes de códigos responsáveis por uma determinada ação. Por isso chamamos de design patterns. Pois são padrões que se repetem e para melhores serem executados exigem certas 'regrinhas'.

Vou dar um exemplo de estrutura básica de pastas que podem nos ajudar aqui:

```jsx
Raiz
└── src
    ├── server.js
    ├── app.js
    └── routes.js
```

`server.js` será o responsável por definir a conexão com a host externa com o nodemon, `app.js` será o intermediário e será responsável por guardar a classe principal. `routes.js` por outro lado irá direcionar todas as rotas para os novos controllers, cada um com sua responsabilidade.

```jsx
// server.js
const server = require('./app');
server.listen(8000);
```

```jsx
// app.js
const express = require('express');

// const port = 8000;
// const app = express();

class App {
    constructor() {
        this.initExpressMiddleware();
        this.initRoutes();
        this.server = express();
    }
    initExpressMiddleware() {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
  }
    initRoutes() {
          this.use(routes);
  }    
}

new Server();
```

```jsx
// routes.js
const bodyParser = require('body-parser');
const path = require('path');
const swig = require('swig');
const mongoose = require('mongoose');

const routes = new Router();

routes.engine('html', swig.renderFile);
toutes.set('views', path.join(__dirname, 'views'));
routes.set('view_engine', 'html');

mongoose.connect('mongodb://localhost/meetings');
```

Soa bem melhor né? Esta pequena estrutura mostra que arquivos separados apesar que mais trabalhosos tornam o código muito mais robusto. Nesse exemplo mostrado o código provavelmente não irá funcionar, pois ainda precisamos definir os controllers, views etc.. Dessa forma packages como sucrase vem para melhorar a sintaxe do nosso código, permitindo o uso de `import` e `export` semelhante ao React.
