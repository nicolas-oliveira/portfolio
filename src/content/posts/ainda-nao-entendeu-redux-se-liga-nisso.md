---
title: "Ainda não entendeu Redux? Se liga nisso"
slug: "ainda-nao-entendeu-redux-se-liga-nisso"
publishedAt: "2021-07-09"
subtitle: "Imagine que você tem uma aplicação e esta aplicação tem milhões de componentes, sim milhões. Tem um carrinho que adiciona vários elementos dentro dele, esse ele..."
excerpt: "Imagine que você tem uma aplicação e esta aplicação tem milhões de componentes, sim milhões. Tem um carrinho que adiciona vários elementos dentro dele, esse ele"
coverImage: "/images/posts/ainda-nao-entendeu-redux-se-liga-nisso/cover.webp"
tags: ["Redux", "React", "Node.js"]
---

## O problema

Imagine que você tem uma aplicação e esta aplicação tem milhões de componentes, sim milhões. Tem um carrinho que adiciona vários elementos dentro dele, esse elemento tem vários dados que pode ser atualizados e quando você clicar nesse elemento ele abre ainda um modal! 

Ufa... É um exemplo, não importa o que, mas importa que existem muitos componentes.

Pense que há uma hierarquia entre eles, o maior ou o "**pai**" pode ser a página, ou o `routes.js` que define todas as rotas que usamos na aplicação.

Agora temos um desafio, você tem essa porrada de componentes, todos tem sua hierarquia e você precisa organizar a ação do usuário e transferir o dado gerado para outra parte da aplicação.

O que você faz?

Se ainda não conseguiu imaginar, vou desenhar:

Considere todas as bolinhas como um componente React, Vue ou qualquer linguagem que imaginar. Se não sabe o que é componente que tal ver  [aqui](https://reactjs.org/docs/react-component.html) ?

![Group 51.png](/images/posts/ainda-nao-entendeu-redux-se-liga-nisso/image-1.webp)

Se você conhece hooks sabe a utilidade do `useState`, porém mesmo assim você terá um problema sem resolver, pois seus passos serão os seguintes:

![Group 53.png](/images/posts/ainda-nao-entendeu-redux-se-liga-nisso/image-2.webp)

Em uma classe você teria que mandar como prop um `this.setState.bind`, nos hooks você terá que mandar como propriedade o `setDado1` para o filho dessa forma:
![Group 54.png](/images/posts/ainda-nao-entendeu-redux-se-liga-nisso/image-3.webp)

Após isso, você terá que passar o estado do pai, para os seguintes filhos até que chegue no nível que você precisa, dessa forma:

![Group 59.png](/images/posts/ainda-nao-entendeu-redux-se-liga-nisso/image-4.webp)

Até aí tudo bem mas você deve estar se perguntando:
*Ok... Ok.. Entendi que há um problema quando tentamos passar dados para algum lugar numa estrutura de árvore bem abaixo dos componentes. Mas e ai? QUAL A SOLUÇÃO?*

Redux! Ou melhor dizendo, tirar os estados do componente e colocar eles globalmente, sendo independente de um estado local dos componentes.

Dessa forma ficaria algo assim:

![Group 61.png](/images/posts/ainda-nao-entendeu-redux-se-liga-nisso/image-5.webp)

Ok... Parece tudo muito bonito, muito certinho para ser verdade.. E como seria isso em um código?

Obviamente o que chamei de estado global deve ser configurado da forma correta seguindo as configurações que o Redux exige. Porém, para facilitar isso vou separar em 3 partes:

- Uma aplicação simples com `useState`.
- Transformando em Redux aos poucos com `objetos`
- Entendendo o que aconteceu até aqui

### E não acabou fiote!  [Clica nesse link](https://bruxo.hashnode.dev/ainda-nao-aprendeu-redux-parte-2)  que a continuação vem ai com a mão na massa!

Valeu!
