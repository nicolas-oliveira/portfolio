---
title: "Padrão de código com Eslint, Prettier e Babel no React"
slug: "padrao-de-codigo-com-eslint-prettier-e-babel-no-react"
publishedAt: "2021-01-13"
subtitle: "Quando o assunto se trata de padronizar tudo e obter o melhor desempenho de um projeto. O segredo é usar o máximo possível de ferramentas que irão corrigir erro..."
excerpt: "Quando o assunto se trata de padronizar tudo e obter o melhor desempenho de um projeto. O segredo é usar o máximo possível de ferramentas que irão corrigir erro"
coverImage: "/images/posts/padrao-de-codigo-com-eslint-prettier-e-babel-no-react/cover.webp"
tags: ["React", "Git", "Webpack", "Clean Code"]
---

Quando o assunto se trata de padronizar tudo e obter o melhor desempenho de um projeto. O segredo é usar o máximo possível de ferramentas que irão corrigir erros comuns do programador e ajudar que a equipe não perca com código sujo e desnecessário.

Conforme o tempo passa e o código é escrito a possibilidade de surgir algum código que mais atrapalhe do que ajude é grande, por isso ferramentas são criadas para auxiliarem nesse trabalho.

Nas aplicações Web é possível obter isso através de 3 ferramentas:

- Eslint
- Prettier
- Babel

Mas quem são eles?

### Eslint

ESLint é uma ferramenta para identificar e relatar padrões encontrados no código ECMAScript/JavaScript, com o objetivo de tornar o código mais consistente e evitar bugs.

### Prettier

Prettier é uma ferramenta de formatação de código que padroniza a identação e torna o código com apenas uma personalidade, sem variações de estilos de escrita. Dessa forma ele impede, com exceção da sintaxe de código, que o código esteja sem padrões.

### Babel

Babel é um leque de ferramentas responsável por construir e garantir que o código Javascript rode em qualquer navegador existente. 

Eles parecem iguais? Pois não são, cada um tem um objetivo em específico com a mesma finalidade que é a padronização de código!

# Começando na prática

Para inicializar você precisa ter primeiro o webpack ou ter criado uma aplicação com React para que consiga realizar a configuração.

Se você utilizou `npx create react app` provavelmente terá que instalar o eslint:

```
yarn add eslint -D
```

E logo após:

```
yarn eslint --init
```

Caso a sua aplicação tenha sido criada com `npx create react app` você terá um arquivo chamado `.eslintrc.js` que contém as configurações do seu Eslint

```js
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
  },
};
```

Após isso temos que instalar novas dependências dentro da aplicação que irão tornar possível a configuração das 3 ferramentas ao mesmo tempo:

```
yarn add prettier eslint-config-prettier eslint-plugin-prettier babel-eslint -D
```

Adicione na chave `extends` os valores do `.eslintrc.js`:

```
extends: [
    'airbnb',
    'prettier',
    'prettier/react',
],
```

Adicione uma nova chave `parser` que irá representar o analisador sintático customizado a partir do qual nosso código será analisado.

```
parser: 'babel-eslint',
```

Adicione também o prettier na chave `plugins`:

```
plugins: [
    'react',
    'prettier',
],
```

Configurando as regras para que todos os erros do prettier sejam mostrados pelo Eslint:

```
rules: {
    'prettier/prettier':  'error',
},
```

As regras são um tópico que poderia tomar um artigo inteiro de como funcionam,  [pela documentação](https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules)  essa chave pode aceitar vários parâmetros, um exemplo seria aceitar o código `jsx` em arquivos `js` que ficaria dessa forma:

```
"react/jsx-filename-extension": ["warn", { extensions: [".js", ".jsx"] }],
```

Uma dica é aproveitar o VSCode e usar ao seu favor os erros que irão aparecer, dessa forma a cada necessidade basta modificar essa chave evitando os erros ou acrescentando novas regras.

Crie um arquivo chamado `.prettierrc` que será responsável pela configuração do prettier:

```
{
    "singleQuote": true,
    "trailingComma": "es5"
}
```

Pronto! Se você for verificar o código, automaticamente o ESLint e o Prettier estão corrigindo o código para você e as regras que definimos serão modificadas automaticamente.

Ficou alguma dúvida? Manda a ver ai nos comentários.
