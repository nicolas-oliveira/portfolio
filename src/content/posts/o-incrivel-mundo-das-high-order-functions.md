---
title: "O incrível mundo das High Order Functions"
slug: "o-incrivel-mundo-das-high-order-functions"
publishedAt: "2021-07-08"
subtitle: "Estou estudando Redux nos últimos dias e me deparei com uma função tanto quanto intrigante dentro da biblioteca do Redux..."
excerpt: "Estou estudando Redux nos últimos dias e me deparei com uma função tanto quanto intrigante dentro da biblioteca do Redux"
coverImage: "/images/posts/o-incrivel-mundo-das-high-order-functions/cover.webp"
tags: ["Redux", "React", "Node.js", "JavaScript"]
---

Estou estudando Redux nos últimos dias e me deparei com uma função tanto quanto intrigante dentro da biblioteca do Redux

```jsx
export default connect({state: modules})(Component);
```

E fiquei curioso para entender essa função com dois parênteses ou função com dois parâmetros, ou que seja! Uma função com ()().

Sem entrar em muitos detalhes logo descobri que estas funções chamam High Order Functions e uma galera tenta explicar como  [aqui](https://developer.mozilla.org/pt-BR/docs/Glossary/First-class_Function)  e  [aqui](https://blog.rocketseat.com.br/higher-order-components-hocs-no-react-e-react-native/) como funções que são feitas para reaproveitar código, funções que tem como objetivo trazer mais abstração blá blá blá e tudo mais.

Porém tudo que eu entendi foi que se tratava de uma função que retorna uma outra função.

Quer ver?
Vamos acessar o velho node.js no terminal e vermos o que o javascript nos diz a respeito disso..

Vou criar uma função que retorna outra função e tentar somar os parâmetros, assim:

```js
function add(a) {
    return (b) => a + b;
}
```

![image.png](/images/posts/o-incrivel-mundo-das-high-order-functions/image-1.webp)

Engraçado essa forma né?

e se for dessa forma?

```js
const minus = (a) => (b) => a - b;
```

![image.png](/images/posts/o-incrivel-mundo-das-high-order-functions/image-2.webp)

Pelo jeito isso funciona, mas porque?

Isso se trata de um comportamento não muito usado por nós programadores mas que é do Javascript e é padrão em diversas linguagens, pois trata cada retorno da função como um novo parênteses `()`. 

Mas daí você deve estar pensando... Quantos retornos? E eu vou te responder quantos você quiser!
Vamos fazer um exemplo que irá ter 3 parênteses:

```js
function sumThree(a) {
    return (b) => (c) => a + b + c;
}
```

![image.png](/images/posts/o-incrivel-mundo-das-high-order-functions/image-3.webp)

Mas isso só começa ficar interessante quando pensamos a utilidade disso, observe:

```js
function passParam(a) {
    return (b) => b(a);
}
```

Esta função tem como utilidade receber qualquer função e passar como parâmetro o outro parênteses. 

Mas porquê? 

Talvez você queira pegar de uma estutura global e colocar em seu componente local... Isso te lembra algo? Tipo o connect do redux?

![image.png](/images/posts/o-incrivel-mundo-das-high-order-functions/image-4.webp)

Troque o `squared` por um componente e o primeiro parênteses por um estado global da aplicação e *voilá* você entendeu o connect do redux, ou não. Vai saber...
