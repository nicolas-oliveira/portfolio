---
title: "Como configurar o MongoDB localmente no backend usando Docker e Mongoose"
slug: "como-configurar-o-mongodb-localmente-no-backend-usando-docker-e-mongoose"
publishedAt: "2021-01-26"
subtitle: "Muitas pessoas pela comunidade javascript usam o sistemas em nuvens para criar bancos NoSQL direcionado à documentos como o Atlas com o MongoDB ou Compass, poré..."
excerpt: "Muitas pessoas pela comunidade javascript usam o sistemas em nuvens para criar bancos NoSQL direcionado à documentos como o Atlas com o MongoDB ou Compass, poré"
coverImage: "/images/posts/como-configurar-o-mongodb-localmente-no-backend-usando-docker-e-mongoose/cover.webp"
tags: ["Docker", "Node.js", "MongoDB", "JavaScript"]
---

Muitas pessoas pela comunidade javascript usam o sistemas em nuvens para criar bancos NoSQL direcionado à documentos (como o Atlas com o MongoDB ou Compass), porém ele tem uma grande desvantagem... É em nuvem! E ainda por cima, completamente dependente do sistema da Atlas.

Você sabia que é possível criar um banco NoSQL localmente? Esqueça toda aquela dor de cabeça de configurar na mão um banco de dados inteiro e nem de ficar sem banco de dados porque sua internet está ruim.

Eu encontrei um bom caminho para que você tenha o controle total do banco de dados e tudo na sua máquina! Bastando poucas linhas de comando que o Docker te possibilita sendo o quebra galho perfeito que você está precisando..

# Criação com o Docker

O primeiro comando de criação necessita de especificar a porta, escolhendo o nome da sua preferência, ficaria mais ou menos dessa forma:

```
docker container run --name meumongodb --publish 27017:27017 -d mongo
```

Agora será necessário entrar dentro do `bash` do docker:

```
docker container exec -it meumongodb bash
```

Ele irá solicitar o acesso, basta preencher corretamente.

O próximo passo é acessar o mongo através deste comando:

```
use mydbone
```

Agora use o seguinte comando com o usuário e senha desejados:

```
db.createUser({ user: "user", pwd: "senha", roles: [] })
```

Para sair do console basta dar `exit`.

Ainda dentro do bash do mongo execute o comando responsável por fazer o login

```
mongo --port 27017 -u user -p senha --authenticationDatabase mydbone
```

Se ele te retornar algo como:

```
Implicit session: session { "id" : UUID("11a61b38-dcd3-4add-9177-c570b8385xxx") }
```

Significa que está tudo correto e o banco está ativo.

# Conectando com o back-end

Nesse ponto você precisará de um projeto NodeJS e o `mongoose` instalado. Caso não tenha esse pacote basta executar: `npm install mongoose` ou `yarn add mongoose`.

A configuração necessária para fazer a conexão com o BD é:

```
module.exports = {
    url: 'mongodb://localhost:27017/nome_do_seu_bd',
    user: 'usuário',
    pwd: 'senha'
}
```

O acesso do arquivo acima pode ser feito dessa forma:

```
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    user: dbConfig.user,
    pass: dbConfig.pwd
}).then(() => {
    console.log('Conectado ao mongoDB');
}).catch(err => {
    console.log('error ao conectar ao MongoDB');
    process.exit();
});
```

Ou caso você use `.env` poderá escrever algo assim:

```js
import mongoose from 'mongoose';

class Database {
  constructor() {
    this.mongo();
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS,
    });
  }
}
```

Feito!

Sugestões ou críticas? Manda aí, ficarei feliz em responder :)
