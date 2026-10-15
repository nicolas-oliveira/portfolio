---
title: "Ainda não entendeu Redux? Parte 3"
slug: "ainda-nao-entendeu-redux-parte-3"
publishedAt: "2021-07-09"
subtitle: "Se você leu a parte 2https://bruxo.hashnode.dev/ainda-nao-aprendeu-redux-parte-2, eu estava mostrando como a nossa aplicação funciona sem Redux e agora vamos ir..."
excerpt: "Se você leu a parte 2https://bruxo.hashnode.dev/ainda-nao-aprendeu-redux-parte-2, eu estava mostrando como a nossa aplicação funciona sem Redux e agora vamos ir"
coverImage: "/images/posts/ainda-nao-entendeu-redux-parte-3/cover.webp"
tags: ["Redux", "React", "Git", "Node.js"]
---

Se você leu a [parte 2](https://bruxo.hashnode.dev/ainda-nao-aprendeu-redux-parte-2), eu estava mostrando como a nossa aplicação funciona sem **Redux** e agora vamos ir para a parte mais importante, que é a transformação da aplicação em `useState` para `Redux`.

# Transformando em Redux aos poucos com **objetos**

Não vou explicar os conceitos ainda, mas vamos pensar que o `useState` que criamos deve estar de fora de todos os componentes que criamos.

Pra isso precisamos de uma pasta chamada `store` e dentro dela um `index.js`

\*\*E o que vamos colocar dentro dele? \*\*

Oras, o nosso estado.

**Mas como fazer isso?**

Comece com uma função que retorna um objeto:

```jsx
function () {
    return { }
}
```

Lembra do DADO 1? Ele vai aqui e no nosso caso os dados são o **nome** e a **linguagem** escolhida:

```jsx
function () {
    return {
       name: "",
       language: "",
    }
}
```

Agora, não podemos deixar essa função sem nome, por isso o **Redux** já sabe qual nome dar para ela: **Reducer**.

Sem muita enrolação, pense que o **reducer** é o responsável por reunir todos os estados em um só lugar.

```jsx
function reducer() {
    return {
       name: "",
       language: "",
    }
}
```

Agora iremos usar funções que são próprias do Redux feitas para trazer todo o suporte em nossos estados. São elas o `createStore` e o `Provider`.

A `createStore` irá criar a estrutura que irá "transportar" nossos estados para fora da pasta.

```jsx
import { createStore } from "redux";

function reducer() {
    return {
       name: "",
       language: "",
    }
}
const store = createStore(reducer);

export default store;
```

Para isso iremos importar na raiz do projeto react dentro junto ao `#root`. O `Provider` que é aquele que irá "prover" o nosso estado global para toda a aplicação:

```jsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { Provider } from "react-redux";
import store from "./store";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

Dentro do `App.js` podemos retirar o `useState` e as propriedades:

```jsx
import React from "react";

import Form from "./components/Form";
import Output from "./components/Output";

export default function App() {
  return (
    <div className="App">
      <Form />
      <Output />
    </div>
  );
}
```

Até este momento toda a nossa aplicação estava sem receber o Redux, precisamos de alguma função que irá conectar e prover funções úteis para nossos componentes e este é o `connect`.

Sua estrutura é um pouco diferente e iremos colocá-la no `export default` dessa forma:

```jsx
import { connect } from "react-redux";

function Form() {
  return (
    <>
      // tudo que estava antes
    </>
  );
}

export default connect( )(Form);
```

> Se você quer entender o porquê desses dois parênteses ai [Clica aqui!](https://bruxo.hashnode.dev/o-incrivel-mundo-das-high-order-functions) , já criei um artigo muito daora sobre isso.

O `connect` por padrão tem dois parâmetros: O primeiro tem o estado global e as funções complementares como o `dispatch` e o segundo é o seu próprio componente. A grosso modo, o primeiro parênteses irá passar propriedades novas como parâmetro para o segundo parênteses (nosso componente).

Dessa forma, nós podemos "importar" o estado global, fazendo uma desestruturação:

```jsx
export default connect((state) => {
  name: state.name,
  language: state.language,
})(Form);
```

E dessa forma o `name` e `language` estará disponível como parâmetro para o nosso componente.

```jsx
import React, { useState } from "react";
import { connect } from "react-redux";

function Form({ name, language }) {
  return (
    <>
      <label htmlFor="fname">First name:</label>
      <br />
      <input
        type="text"
        id="fname"
        name="fname"
        onChange={(e) => setName(e.target.value)}
      />
      <br /> {" "}
      <input
        type="radio"
        id="html"
        name="fav_language"
        value="HTML"
        onChange={(e) => setLanguage(e.target.value)}
      />
        <label htmlFor="html">HTML</label>
      <br /> {" "}
      <input
        type="radio"
        id="css"
        name="fav_language"
        value="CSS"
        onChange={(e) => setLanguage(e.target.value)}
      />
        <label htmlFor="css">CSS</label>
      <br /> {" "}
      <input
        type="radio"
        id="javascript"
        name="fav_language"
        value="JavaScript"
        onChange={(e) => setLanguage(e.target.value)}
      />
        <label htmlFor="javascript">JavaScript</label>
    </>
  );
}

export default connect((state) => {
  name: state.name,
  language: state.language,
})(Form);
```

Por outro lado, o `dispatch` é uma função que tem como responsabilidade escutar aquele evento em específico que o usuário irá ativar, seja ele um clique, digitar do teclado ou efeito colateral qualquer.

A ideia aqui é que ele é um recebedor de uma ação. E essa ação somos nós que temos que explicar para o **Redux**.

De todas as formas, posso aproveitar o `setName` e `setLanguage` e incluir eles dentro de `dispatch` em cada linha.

Por exemplo:

```jsx
import React, { useState } from "react";
import { connect } from "react-redux";

function Form() {
  return (
    <>
      <label htmlFor="fname">First name:</label>
      <br />
      <input
        type="text"
        id="fname"
        name="fname"
        onChange={(e) => dispatch(setName(e.target.value))}
      />
      <br /> {" "}
      <input
        type="radio"
        id="html"
        name="fav_language"
        value="HTML"
        onChange={(e) => dispatch(setLanguage(e.target.value))}
      />
        <label htmlFor="html">HTML</label>
      <br /> {" "}
      <input
        type="radio"
        id="css"
        name="fav_language"
        value="CSS"
        onChange={(e) => dispatch(setLanguage(e.target.value))}
      />
        <label htmlFor="css">CSS</label>
      <br /> {" "}
      <input
        type="radio"
        id="javascript"
        name="fav_language"
        value="JavaScript"
        onChange={(e) => dispatch(setLanguage(e.target.value))}
      />
        <label htmlFor="javascript">JavaScript</label>
    </>
  );
}

export default connect((state) => {
  name: state.name,
  language: state.language,
})(Form);
```

Porém, `setName` e `setLanguage` não existe.

Por isso devemos criá-los.

Por outro lado, isso que vamos criar agora, o **Redux** chama de **actions**, pois a partir dele que o usuário dispara suas ações e os estados podem ser mudados globalmente através do `dispatch`.

Da mesma forma que o `reducer` o `action` é uma função que retorna um **objeto**:

```jsx
function setName() {
  return {
     // alguma coisa
  };
}
```

Ele deve ter um ID próprio que chamamos de `type` e em seu parâmetro está o `e.target.value` ou seja o próprio nome que o usuário digitou:

```jsx
function setName(name) {
  return {
    type: "SET_NAME",
    name,
  };
}
```

A mesma coisa poderá ser feita com `setLanguage`

```jsx
function setLanguage(language) {
  return {
    type: "SET_LANGUAGE",
    language,
  };
}
```

<iframe src="https://codesandbox.io/embed/lucid-violet-r6gxp?fontsize=14&hidenavigation=1&theme=dark" style="width:100%;height:500px;border:0;border-radius:4px;overflow:hidden" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>
