---
title: "Padronização dos Commits com CommitLint"
slug: "padronizacao-dos-commits-com-commitlint"
publishedAt: "2020-12-13"
subtitle: "A falta de padrão está te dando dor de cabeça? Vou mostrar um pacote que poderá ser a solução de uma vez por todas! O Commitlint é o responsável por criar a pad..."
excerpt: "A falta de padrão está te dando dor de cabeça? Vou mostrar um pacote que poderá ser a solução de uma vez por todas! O Commitlint é o responsável por criar a pad"
coverImage: "/images/posts/padronizacao-dos-commits-com-commitlint/cover.webp"
tags: ["Git", "Node.js"]
---

A falta de padrão está te dando dor de cabeça? Vou mostrar um pacote que poderá ser a solução de uma vez por todas! O Commitlint é o responsável por criar a padronização das mensagens dos commits para criar em seu repositório basta adicionar com `npm` ou `yarn`.

```jsx
$ yarn add @commitlint/config-conventional @commitlint/cli -D
```

Adicione a seguinte configuração no arquivo de configuração do commitlint

```jsx
$ echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

Instale o `husky`:

```jsx
$ yarn add husky -D
```

Adicione no `package.json`

```jsx
"husky": {
  "hooks": {
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
  }
}
```

OBS: É necessário que o repositório do git esteja inicializado antes de efetuar a instalação do `husky`, caso contrário inicie e reinstale o pacote.

```jsx
$ git commit -m "First commit"
husky > commit-msg (node v14.1.0)
⧗   input: First commit
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

✖   found 2 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint
```
