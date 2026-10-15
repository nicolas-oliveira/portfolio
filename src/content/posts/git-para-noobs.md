---
title: "Git para NOOBS"
slug: "git-para-noobs"
publishedAt: "2020-12-15"
subtitle: "Não me leve a mal, todos são noobs no começo, a diferença está na curiosidade e em querer evoluir. Acredito que por estar lendo este artigo você queira melhorar..."
excerpt: "Não me leve a mal, todos são noobs no começo, a diferença está na curiosidade e em querer evoluir. Acredito que por estar lendo este artigo você queira melhorar"
coverImage: "/images/posts/git-para-noobs/cover.webp"
tags: ["Git", "Linux"]
---

Não me leve a mal, todos são noobs no começo, a diferença está na curiosidade e em querer evoluir. Acredito que por estar lendo este artigo você queira melhorar e entender melhor o `git` e `github`.

Isso é bom!

Na verdade para qualquer pessoa que queira seguir uma carreira no ramo da tecnologia que se preze deve ter o mínimo de curiosidade sobre esta tecnologia...

Conhecer ela em todos os detalhes é importantíssimo!

Espero que com esse artigo você pare de ficar com medo do git e comece de uma vez por todas entender essa ferramenta importantíssima!

No começo tudo é dificil, aprender um instrumento musical, andar de bicicleta, aprender a dirigir até mesmo quando criança aprender a andar foi dificil!

Basta você lembrar, todos estes conhecimentos práticos no início eram chatos e difíceis de executar, porém você venceu isso e hoje faz tudo com maior maestria sem nem sequer perceber!

Por isso este guia tem a intenção de mostrar que sim! `Git` e `Github` são fáceis de entender e muito mais ainda fazer!

Portanto para não ficar chato irei abordar com uma didática simples no início e irei aprofundando a cada passo que der.

Isso será é necessário pois quero ir além do bom e velho `git add .` que não recomendo.

Se tem uma utilidade que git serve é organização e isso é a primeira coisa que você tem que ter em mente aqui. Não vou exigir nunhuma maestria em programação nem em tecnologia. A única coisa necessária aqui é bom senso e a organização pois é disso que o `git` se trata e para isso que ele serve.

Peço também que crie uma pasta e tente fazer cada um dos comandos abaixo. Este guia foi baseado na documentação oficial do git, que você poderá encontrar neste link:

[Comandos Git](http://comandosgit.github.io)

Para esse artigo vou dividir os títulos dessa forma para facilitar seu entendimento:

1. Verificando se está instalado

2. Abrindo o terminal: Configurando a sua identidade

3. Configurando sua identidade

4. Inicializando um Repositório em um Diretório Existente

5. Clonando um Repositório Existente

6. Gravando Alterações

7. Verificando o Status

8. Criando commits

### 1) Verificando se está instalado

Antes de começar este guia você precisará verificar se o `git` está instalado em sua máquina. Para fazer isso basta buscar um comando que mostra a versão que está instalada na sua máquina. Abrindo o terminal digite este comando:

```plaintext
git --version
```

Se ele te retornar algo como isso: `git version 2.26.0` significa que já está instalado, muitas distribuições linux já vem com o `git` instalado, porém caso contrário será necessário instalar na sua máquina. Este link que encaminhei acima tem uma aba de instalação, você poderá realizar qualquer uma dela dependendo do seu sistema operacional tanto Linux, Windows ou Mac.

### 2) Abrindo o terminal:

> **Aviso:** Recomendo fortemente que use um terminal! Você pode até ter um programa que tenha todos os atalhos visuais, porém você está aprendendo e o melhor é ver como ele é inicialmente! Aprender andar de carro com marcha automática não te fará um bom piloto!

Caso ainda tenha dificuldades para abrir o terminal vou ser bonzinho e mostrar as possibilidades que você pode fazer neste momento dependendo do seu sistema operacional. *(Caso já tenha feito pule para o passo 1):*

### a) Windows

Abra o prompt de comando pesquisando `prompt de comando` ou `linha de comando`, outra forma é executar no teclado o botão `Windows + R` e escrever na caixa do `executar` a palavra chave `cmd`. Estas duas formas abrem o terminal.

### b) Mac

No seu Mac, você pode encontrar o terminal na aba utilidades. Vá até a janela `Ir > Aplicativos > Utilidades` e clique duas vezes em Terminal.

### c) Linux

Abra o terminal com o atalho `Ctrl+Shift+t` ou pesquise `Terminal` na aba de pesquisa da sua distro, basicamente todas as usam a mesma sintaxe até então, os comando serão estes:

### 3) Configurando sua identidade

A primeira coisa que podemos fazer no início é dizer quem você é, isso é importante pois como disse, o git se trata de organização, porém nada irá adiantar se não soubermos quem é o autor de todo esse projeto. Para isso há duas informações necessárias aqui, que são o seu nome e e-mail:

```plaintext
git config --global user.name "Nicolas Oliveira"
git config --global user.email nicolas@example.com
```

Pode ser qualquer e-mail que você use, aqui não se trata de um cadastro e sim uma forma de identificação.

### 4) Inicializando um Repositório em um Diretório Existente

Vamos lá, vamos supor no primeiro momento que há uma pasta disponível e você queira criar um `git` para ela. O comando é simples:

```plaintext
git init
```

Isto em qualquer sistema que você executar irá fazer a mesma coisa: Iniciar um repositório `git` na pasta correspondente. Inciando um novo histórico de alterações que podemos escrever ali. Caso ainda não tenha visto diferença vou explicar o que aconteceu para cada um dos sistemas operacionais *(Pule para o seu sistema operacional)*:

## a) Windows

Com o cmd aberto digite dentro dele

```plaintext
C:\Users\exemplo\> mkdir testes
C:\Users\exemplo\> cd testes
```

Após isto basta rodar o seguinte comando:

```plaintext
C:\Users\exemplo\> git init
```

Este comando irá criar uma pasta `.git` dentro da pasta que você criou e dentro dele você irá encontrar os arquivos que o `git` usa para manipular os arquivos. Não será necessário mexer nesta pasta. Próximo passo!

## b) Mac

Com o terminal aberto digite dentro dele:

```plaintext
exemplo-Mac: ~exemplo$ mkdir testes
exemplo-Mac: ~exemplo$ cd testes
```

Após isso basta rodar o comando de inicialização do `git`:

```plaintext
exemplo-Mac: ~exemplo$ git init
```

Ele irá criar uma pasta `.git` que normalmente está oculta, porém ressalvo aqui não será necessário manipular esta pasta, porém caso ainda queira deletar para criar novamente ou só por curiosidade verificar os arquivos dele, basta usar o atalho de teclado `Command (⌘) + Shift + .` (sim, o ponto final) dentro do Finder da pasta que estamos manipulando. Não funcionou? No terminal mesmo coloque este comando e aperte `ENTER`:

```plaintext
defaults write com.apple.finder AppleShowAllFiles YES; killall Finder
```

Caso queira desfazer basta rodar o comando:

```plaintext
defaults write com.apple.finder AppleShowAllFiles NO; killall Finder
```

## c) Linux

Com o terminal aberto rode os seguintes comandos:

```plaintext
mkdir testes
cd testes
```

Isto irá criar uma pasta chamada `testes`, na sua pasta `home`, após isso basta rodar o comando de inicialização:

```plaintext
git init
```

Caso não esteja vendo o arquivo `.git` que foi criado você pode executar `Alt+.`*(Dolphin)* no seu gerenciador de arquivos. Ou pode executar o seguinte comando:

```plaintext
ls -d .*
```

Ele irá te retornar a pasta criada. Próximo passo!

### 5) Clonando um Repositório Existente

Clonar um repositório é o mesmo que você entendeu, vamos criar uma cópia em nossa máquina local a partir de outra encontrada na internet, posso dar o exemplo dessa forma:

```plaintext
git clone git://github.com/repo/repo.git
```

É interessante ressaltar que o git realiza o clone de sites que fornecem esse serviço como Github, Gitlab e Bitbucket.

### 6) Adicionando novos arquivos ao seu git

Para gravar alterações no seu repositório você precisa primeiro dizer ao git quais arquivos você quer que ele "olhe". Isso chamamos de adicionar um arquivo untracked to tracked.

```plaintext
git add README
```

Tá mas o que isso significa? Significa que o github terá uma lista de arquivos em uma estrutura de árvore no qual o arquivo daquela pasta específica irá receber um monitoramento de cada alteração comparando a anterior com a atual através do diff.

De forma interativa:

```plaintext
git add -i
```

### 7) Verificando o Status

```plaintext
git status
```

O comando lhe mostra em qual branch você se encontra. Não se preocupe se neste momento a palavra "branch" ainda é confusa para você. Neste momento o mais importante a se saber é que esse comando mostra alterações e onde você se encontra nessas tais alterações

### 8) Criando commits

Pense comigo, você gravou suas alterações, checou onde elas se encontram, agora o que mais falta? Neste momento a palavra chave é o "commit" que é nada menos que "confirmar" que tais alterações estão certas, no inglês essa palavra tem mais o significado de pacotes, é como se tudo que você escreveu no seu código estivesse pronto e empacotado para algum destino. A sintaxe normalmente é esta:

```plaintext
git commit -m "Mensagem"
```

Porém podemos ter outros parâmetros que podemos fazer com elas, como este que comita até para as não pertencentes ao stage:

```plaintext
git commit -a -m "Mensagem"
```

Para desfazer basta dar o parâmetro `--amend` no final do commit:

```plaintext
git commit -m "Mensagem" --amend
```
