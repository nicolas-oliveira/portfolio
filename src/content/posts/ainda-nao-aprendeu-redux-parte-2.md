---
title: "Ainda não aprendeu Redux? Parte 2"
slug: "ainda-nao-aprendeu-redux-parte-2"
publishedAt: "2021-07-09"
subtitle: "Se você leu a parte 1, eu estava explicando o problema que o Redux resolve e agora vamos colocar a mão na massa configurando o projeto."
excerpt: "Se você leu a parte 1, eu estava explicando o problema que o Redux resolve e agora vamos colocar a mão na massa configurando o projeto."
coverImage: "/images/posts/ainda-nao-aprendeu-redux-parte-2/cover.webp"
tags: ["Redux", "React", "Node.js", "JavaScript"]
---

## Metendo a mão na massa!

Se você [leu a parte 1](/post/ainda-nao-entendeu-redux-se-liga-nisso) eu estava explicando o problema que o Redux resolve e aqui sobrou elaborar e resolver como o Redux é configurado.

Vamos colocar isso no papel então. Chama aí o `npx create-react-app` que vou te mostrar um belo exemplo.

> Ei, e se você tá com preguiça... Não precisa ler esse código todo. Pula um pouco pra baixo de cada parte que tem o resultado completo 😉

# Uma aplicação simples com `useState`

Vamos criar um formulário que você pode escrever seu nome e escolher dentre `HTML`, `CSS` e `JAVASCRIPT` sua linguagem de programação favorita, e é só isso mesmo não vamos complicar nada aqui.

O HTML ficaria mais ou menos assim:

```html
<form>
      <label for="fname">First name:</label>
      <br />
      <input
        type="text"
        id="fname"
        name="fname"
      />
      <br /> 
      <input
        type="radio"
        id="html"
        name="fav_language"
        value="HTML"
      />
        <label for="html">HTML</label>
      <br /> 
      <input
        type="radio"
        id="css"
        name="fav_language"
        value="CSS"
      />
        <label for="css">CSS</label>
      <br /> 
      <input
        type="radio"
        id="javascript"
        name="fav_language"
        value="JavaScript"
      />
        <label for="javascript">JavaScript</label>
</form>
```

Vou transformá-lo num componente e fazer alguns ajustes. Dentre eles, retirar o form pois não irei utilizá-lo e mudar o `for` por `htmlFor`:

```jsx
import React from "react";

function Form() {
  return (
    <div>
      <label htmlFor="fname">First name:</label>
      <br />
      <input
        type="text"
        id="fname"
        name="fname"
      />
      <br /> {" "}
      <input
        type="radio"
        id="html"
        name="fav_language"
        value="HTML"
      />
        <label htmlFor="html">HTML</label>
      <br /> {" "}
      <input
        type="radio"
        id="css"
        name="fav_language"
        value="CSS"
      />
        <label htmlFor="css">CSS</label>
      <br /> {" "}
      <input
        type="radio"
        id="javascript"
        name="fav_language"
        value="JavaScript"
      />
        <label htmlFor="javascript">JavaScript</label>
    </div>
  );
}

export default Form;
```

Obviamente, se você conhece o React, sabe que o estado deve estar aplicado aqui, e nada menos que utilizar o `onChange` dentro de cada um dos inputs.

Mas **segura ai**! Lembra de toda aquela história do *pai de todos* que contei no início do artigo? Pois é, vamos repetir aqui, então vou criar o componente pai, que é o `App.js` o `form` e um componente que irá mostrar para nós o que escrevemos e escolhemos como linguagem favorita. Vou chamar este de `Output`.

**Muito cuidado**, pois devemos colocar os estados no `App.js` e depois repassá-los aos filhos dessa forma:

```jsx
import "./styles.css";
import { useState } from "react";

import Form from "./components/Form";
import Output from "./components/Output";

export default function App() {
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("");

  return (
    <div className="App">
      <Form setName={setName} setLanguage={setLanguage} />
      <Output name={name} language={language} />
    </div>
  );
}
```

```jsx
import React from "react";

function Form({setName, setLanguage}) {
  return (
    <div>
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
    </div>
  );
}

export default Form;
```

Olha como ficou tudo isso:

> [Abrir exemplo interativo no CodeSandbox](https://codesandbox.io/s/tender-platform-5o6qd)

### Tudo certo até ai? Agora que o bixo pega, vamos mudar isso pra **Redux**!

### [Clica aqui](/post/ainda-nao-entendeu-redux-parte-3) pra continuar esse desafio insano de aprender uma das bibliotecas mais importantes do mundo front-end!
