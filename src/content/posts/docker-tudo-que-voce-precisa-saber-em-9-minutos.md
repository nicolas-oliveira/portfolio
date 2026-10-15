---
title: "Docker, tudo que você precisa saber em 9 minutos"
slug: "docker-tudo-que-voce-precisa-saber-em-9-minutos"
publishedAt: "2021-03-30"
subtitle: "Um Docker é uma tecnologia que cria um ambiente isolado para executar tarefas e tasks de forma automatizada garantindo que o container irá reproduzir a aplicaçã..."
excerpt: "Um Docker é uma tecnologia que cria um ambiente isolado para executar tarefas e tasks de forma automatizada garantindo que o container irá reproduzir a aplicaçã"
coverImage: "/images/posts/docker-tudo-que-voce-precisa-saber-em-9-minutos/cover.webp"
tags: ["React", "Docker", "Node.js"]
---

## O que é docker?

Um Docker é uma tecnologia que cria um ambiente isolado para executar tarefas e tasks de forma automatizada garantindo que o container irá reproduzir a aplicação da mesma forma em qualquer sistema ou dispositivo.

O docker irá criar uma imagem que poderá instanciar um container a partir dele. Isso significa que a imagem é o molde para a execução do container e o container é o ambiente isolado em si.

Há diversas vantagens do container em relação ao uso da Máquina Virtual, apesar de terem conceitos parecidos e objetivos de isolar o sistema e reduzir conflitos, o docker tem a capacidade de apenas rodar as tarefas necessárias sem depender de um sistema operacional.

Dessa forma, sua prática e velocidade é totalmente perceptível.

# Comandos básicos:

Para os seguintes comandos me dei a liberdade de criar as seguintes tags `<tags>` para facilitar o entendimento da composição dos comandos.

`<container>` = O container em si Ex: mysql, postgres script.sh etc...

`<containerName>` = O nome do container, ou seja, o nome que damos a ele. Por padrão o nome é aleatório.

`<id>` = O id dado pelo docker

Mostrar os contêineres que estão ativos no sistema:

```jsx
$ docker ps 
```

Coloque um pipeline para que não quebre a linha caso necessário:

```jsx
$ docker ps | less -S 
```

Para mostrar todos os contêineres já criados no sistema:

```jsx
$ docker ps -a | less -S
```

Busca o container, caso esteja ativo ele irá reproduzir os logs em tempo real:

```jsx
$ docker attach <id> 
```

Para iniciar um container já criado:

```jsx
$ docker start <containerName> 
```

Se você iniciar com um parâmetro `-a` ele irá fazer o mesmo do `attach`

```jsx
$ docker start -a <containerName> 
```

Para interromper a execução do container:

```jsx
$ docker stop <containerName> 
```

Mostra os logs recentes do container:

```jsx
$ docker logs <containerName> 
```

Mostra todas as imagens já criadas:

```jsx
$ docker images 
```

Remove um container:

```jsx
$ docker rm <containerName> 
```

Remove uma imagem:

```jsx
$ docker rmi <id> 
```

Instancia sem baixar, ou seja, cria um novo contêiner baseado na imagem baixada anteriormente.

```jsx
$ docker pull 
```

Gera um json detalhando todas as informações do container:

```jsx
$ docker inspect <containerName> 
```

# Comando `docker run` e seus parâmetros mais importantes:

Roda um ambiente e instala a imagem caso não exista:

```jsx
$ docker run <container> 
```

OBS: É necessário que os parâmetros sejam passados primeiro que a chamada do container por exemplo:

```jsx
$ docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres:11
```

Roda e instala uma versão especifica:

```jsx
$ docker run <container>:versão 
```

Roda o ambiente em background sem mostrar os logs no terminal:

```jsx
$ docker run -d <container>
```

Roda um ambiente no qual exige a entrada do prompt no terminal:

```jsx
$ docker run -i <container> 
```

Roda um ambiente com entradas e saidas do terminal:

```jsx
$ docker run -it <container> 
```

Mapeia a porta para ser acessada fora do docker:

```jsx
$ docker run -p 80:5000 <container> 
```

Cria um volume para manter os dados criados durante a instância do docker:

```jsx
$ docker volume create <nomeDoVolume>
```

Caso seja necessário guardar os dados pode-se mapear um diretório para que os dados persistam Ex:

```jsx
$ docker run -v <nomeDoVolume>:<diretório> <container>

$ docker run -v data_volume:/var/lib/mysql mysql
```

obs: Caso queira fazer um método bind de armazenamento em host use o seguinte comando:

```jsx
$ docker --mount type=bind,target=<dirA>,source=<dirB> <container>
type=bind ou type=
```

```jsx
$ docker run -e <NomeDaVariavelDeAmbiente>=<variavelDeAmbiente> <container>
// Cria o valor correspondente a variável de ambiente que pertence ao container
```

```jsx
$ docker run --name <nomeDoContainer>
// Define o nome para o container
```

 Define a conexão do docker:

```jsx
$ docker run <container> --network=host ou --network=none 
```

Caso não seja especificado o padrão será a `bridge` que é a conexão usada internamente com o host da rede interna `(Ex: 172.2.0.0)`. Por outro lado com a tag `--network=host` ele irá especificar que o usuário deseja usar uma rede externa, portanto não será possivel usar múltiplos containers sem especificar portas diferentes para cada um dos mesmos. Por fim, setado `--network=none` o mesmo não estará disponível para acesso externo.

# Backup de banco de dados

Caso você queira fazer algo como uma exportação dos dados (mysqldump) você pode:

```
docker exec <NomeDoDocker> /usr/bin/mysqldump -u <Usuário> --password=<SenhaDoBanco> <TabelaDoBanco> ><NomeDoArquivo>
```

# Integrando vários containers

Um dos pontos interessantes aos se usar containers é que podemos criar imagens e containers de praticamente qualquer coisa. Dessa forma, a primeira ideia que nos vem a mente se é possivel instanciar vários containers e rodá-los com a finalidade de reproduzir um sistema ou uma aplicação complexa. 

E sim! é possível, podemos criar um container de uma aplicação em `react` que integra com um `worker` e passa sua informação para um `banco de dados` e assim retorna para o `node.js` trazendo uma informação útil para o usuário. Neste caso a imaginação é o limite.

Quando for executar as imagens necessárias para a aplicação basta linkar todos usando o seguinte parâmetro, exemplo:

```jsx
docker run -d --name=app -p 5000:80 --link redis:redis myaplication.js
```

Dessa forma, ao instanciar o container a partir de uma imagem caso haja uma variável ambiente para o `host` basta especificar o 'próximo passo' do sistema linkando a aplicação que estamos instanciando:

```jsx
$ docker run -d --name=<name> -p <host>:<externalPort> --link <nextContainer>:<nextContainer> <container>
```

Após contruir a estrutura basta executar o comando:

```jsx
$ docker-composed up
```

Outra forma mais eficar é o uso do `yml` files para definir todos esses parâmetros passados para o docker-compose, por exemplo:

```docker
$ docker run -d --name=redis redis
$ docker run -d --name=db postgres:11
$ docker run -d --name=vote -p 5000:80 --link redis:redis myaplication
$ docker run -d --name=result -p 5001:80 --link db:db result-app
$ docker run -d --name=worker --link db:db --link redis:redis worker
$ docker-compose up
```

Dessa forma sendo traduzido em:

```docker
redis:
    image: redis
db:
    image:postgres:11
vote:
    image:myaplication
    ports:
    - 5000:80
  links:
  - redis
result:
    image:result-app
  ports:
  - 5001:80
  links:
  - db
worker:
  image:worker
  link:
  - redis
  - db
```

Não necessariamente teremos as imagens de `'myaplication'` por isso o recomendado é usar um arquivo que instrua o docker a criar uma imagem da aplicação. Por isso nesse caso é recomendado o `build: ./aquivodebuild` no lugar de `image:`.

# Erros comuns

```
Error response from daemon: driver failed programming external connectivity on endpoint nginx-proxy
```

```bash
docker stop $(docker ps -a -q); docker rm $(docker ps -a -q); docker volume rm $(docker volume ls -qf dangling=true)

docker network rm $(docker network ls -q)

sudo lsof -nP | grep LISTEN


```
