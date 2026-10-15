---
title: "O básico do sequelize em 2 minutos"
slug: "o-basico-do-sequelize-em-2-minutos"
publishedAt: "2021-07-30"
subtitle: "O Sequelize é o pacote responsável por fazer a abstração do Banco de dados ORM - Object-Relational Mapping."
excerpt: "O Sequelize é o pacote responsável por fazer a abstração do Banco de dados ORM - Object-Relational Mapping."
coverImage: "/images/posts/o-basico-do-sequelize-em-2-minutos/cover.webp"
tags: ["Sequelize"]
---

O Sequelize é o pacote responsável por fazer a abstração do Banco de dados (ORM - Object-Relational Mapping).

### Instalação do pacote:

```jsx
yarn add sequelize
```

### Comandos:

Executar migrações pendentes

```jsx
sequelize db:migrate 
```

Atualizar tabela de migração para ter timestamps

```plaintext
sequelize db:migrate:schema:timestamps:add 
```

Liste o status de todas as migrações

```plaintext
sequelize db:migrate:status 
```

Reverte uma migração

```plaintext
sequelize db:migrate:undo 
```

Reverte todas as migrações realizadas

```plaintext
sequelize db:migrate:undo:all 
```

Executar seeder especificado

```plaintext
sequelize db:seed 
```

Elimina dados do banco de dados

```plaintext
sequelize db:seed:undo 
```

Execute todas seeds

```plaintext
sequelize db:seed:all 
```

Elimina todos dados do banco de dados

```plaintext
sequelize db:seed:undo:all 
```

Criar banco de dados especificado por configuração

```plaintext
sequelize db:create 
```

Deleta o Banco de dados especificado pela configuração

```plaintext
sequelize db:drop 
```

Inicializa projeto

```plaintext
sequelize init 
```

Inicializa a configuração

```plaintext
sequelize init:config 
```

Inicializa as migrações

```plaintext
sequelize init:migrations 
```

Inicializa os models

```plaintext
sequelize init:models 
```

Inicializa os seeders

```plaintext
sequelize init:seeders 
```

Gera um novo arquivo de migração \[sinônimos: migration:create\]

```plaintext
sequelize migration:generate 
```

Gera um modelo e sua migração \[sinônimos: model:create\]

```plaintext
sequelize model:generate 
```

Gera um novo arquivo de sementes

```plaintext
sequelize seed:generate
```
