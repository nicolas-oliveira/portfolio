---
title: "Como juntar vários commits em um só"
slug: "como-juntar-varios-commits-em-um-so"
publishedAt: "2021-01-12"
subtitle: "Sabe aquele momento que você escreveu várias mensagens inutéis e percebeu que tudo pode ser resumido?..."
excerpt: "Sabe aquele momento que você escreveu várias mensagens inutéis e percebeu que tudo pode ser resumido?"
coverImage: "/images/posts/como-juntar-varios-commits-em-um-so/cover.webp"
tags: ["Git"]
---

Sabe aquele momento que você escreveu várias mensagens inutéis e percebeu que tudo pode ser resumido?

No Git você pode juntar vários commits em um só com a poderosa "`rebase -i`". É uma ferramenta útil e que uso com bastante frequência; normalmente arrumo meu espaço de trabalho agrupando vários pequenos compromissos intermediários em um único nódulo para mandar para a branch principal.

## 1) Escolha os commits

Primeiro você precisa ter conhecimento de quantos commits você quer "juntar".
Vamos supor que ao visualizar os commits você tenha a seguinte situação:

```
git log --oneline

971d468 (HEAD -> unstable) Correção na ordem de data da query
88af65f ,
7212160 ,
2f53b89 ,
8f66c52 ,
b9ddf0a ,
865a59f .
```

Se eu contar quantos commits eu tenho após o último terei 7, totalizando 8 commits
Dessa forma:

```
git rebase -i HEAD~8
```

Onde o 8 é o número de commits.

## 2) pick e stash

Após executar o `rebase` ele abrirá algo assim:

```
pick 865a59f .                                                       --- COMMIT ANTIGO
pick b9ddf0a ,
pick 8f66c52 ,
pick 2f53b89 ,
pick 7212160 ,
pick 88af65f ,                              
pick 971d468 (HEAD -> unstable) Correção na ordem de data da query   --- COMMIT NOVO
```

O pick siginifica que ele irá "pegar" ou manter o commit                 
O stash siginifica que ele irá agrupar. Você pode editar colocando como `p` ou `s`. Lembrando que de cima para baixo o primeiro deve ser pick.
Podendo ficar desta forma:

```
p 865a59f .                                                       --- COMMIT ANTIGO
s b9ddf0a ,
s 8f66c52 ,
s 2f53b89 ,
s 7212160 ,
s 88af65f ,                              
s 971d468 (HEAD -> unstable) Correção na ordem de data da query   --- COMMIT NOVO
```

Após isso ele irá abrir novamente o editor de texto pedindo para que você comente com '#' as mensagens indesejadas e que escreva um novo commit.

Pronto! Agora seu histórico está mais limpo
