---
title: "Radicle um grande candidato como alternativa ao Github, Gitlab e Bitbucket!"
slug: "radicle-um-grande-candidato-como-alternativa-ao-github-gitlab-e-bitbucket"
publishedAt: "2021-03-30"
subtitle: "Recentemente eu estava navegando pelo Twitter e me deparei com um projeto sensacional que parecia querer mudar bastante coisa na forma que lidamos com serviços ..."
excerpt: "Recentemente eu estava navegando pelo Twitter e me deparei com um projeto sensacional que parecia querer mudar bastante coisa na forma que lidamos com serviços "
coverImage: "/images/posts/radicle-um-grande-candidato-como-alternativa-ao-github-gitlab-e-bitbucket/cover.webp"
tags: ["Git", "Linux", "Open Source"]
---

Recentemente eu estava navegando pelo Twitter e me deparei com um projeto sensacional que parecia querer mudar bastante coisa na forma que lidamos com serviços na Web. Essa aplicação chama Radicle e o seu site oficial é o [radicle.xyz](radicle.xyz), o código fonte está no seu Github em  [github/radicle-dev](https://github.com/radicle-dev/radicle-upstream) e inclusive já tem está bem documentado [aqui](https://docs.radicle.xyz/docs/what-is-radicle).

Levei alguns minutos para entender o que exatamente eles queriam propor e o mais interessante é que eles podem estar certos! E já explico o porque.

Primeiro vamos ver do que se trata o programa e como ele é!

## Sobre o programa

Indo no site na aba `Try It` você pode ter acesso à beta do Radicle.

Por enquanto apenas está disponível para Linux (Appimage) e Mac (dmg)

![image.png](/images/posts/radicle-um-grande-candidato-como-alternativa-ao-github-gitlab-e-bitbucket/image-1.webp)

No linux eu apenas precisei usar o terminal executando o arquivo correspondente

```
./radicle-upstream-0.1.13.AppImage 
```

Basicamente sua interface é dessa forma:
![1.png](/images/posts/radicle-um-grande-candidato-como-alternativa-ao-github-gitlab-e-bitbucket/image-2.webp)

Ele pede o seu nome
![2.png](/images/posts/radicle-um-grande-candidato-como-alternativa-ao-github-gitlab-e-bitbucket/image-3.webp)

Uma senha para seu usuário. Cuidado, por enquanto nessa versão beta não se pode mudar a senha.
![3.png](/images/posts/radicle-um-grande-candidato-como-alternativa-ao-github-gitlab-e-bitbucket/image-4.webp)

Depois ele dá um UniqueID que representa nosso dispositivo. Ele é necessário para compartilhar nossos repositórios.
![4.png](/images/posts/radicle-um-grande-candidato-como-alternativa-ao-github-gitlab-e-bitbucket/image-5.webp)

Sua "página inicial" começa vazia. E a sua interface é bem intuitiva. Com várias opções e configurações.
![5.png](/images/posts/radicle-um-grande-candidato-como-alternativa-ao-github-gitlab-e-bitbucket/image-6.webp)

Clicando em novo projeto, você pode criar um novo ou existente. O novo exige um projeto sem a pasta `.git`.
![6.png](/images/posts/radicle-um-grande-candidato-como-alternativa-ao-github-gitlab-e-bitbucket/image-7.webp)

E *voilá* temos nosso primeiro repositório pronto.
![7.png](/images/posts/radicle-um-grande-candidato-como-alternativa-ao-github-gitlab-e-bitbucket/image-8.webp)

![8.png](/images/posts/radicle-um-grande-candidato-como-alternativa-ao-github-gitlab-e-bitbucket/image-9.webp)

O seu repositório tem um ID único também, podendo compartilhar com seus amigos.
![9.png](/images/posts/radicle-um-grande-candidato-como-alternativa-ao-github-gitlab-e-bitbucket/image-10.webp)

Se estiver curioso, muitas pessoas já postaram seus repositórios e eles podem ser encontrados aqui (ainda em beta):

http://seedling.radicle.xyz

Inicialmente há apenas 1 peer, que é o seu próprio. Mas ele pode aumentar, podendo ser seus amigos, colegas de trabalho ou comunidade inteira. 

![image.png](/images/posts/radicle-um-grande-candidato-como-alternativa-ao-github-gitlab-e-bitbucket/image-11.webp)

## Mas porque eu vou querer usar isso?

### O motivo eu ter gostado da ideia:

Basicamente tudo se resume em Servidores Centrais x Servidores Distribuídos.

Atualmente vemos que há uma grande quantidade de serviços que rodam pela internet a fora e não são poucos aqueles que tentam encontrar algo que torne o mundo do desenvolvimento mais rápido e produtivo. 

As iniciativas são exponenciais e não param de surgir. E tão certo foi o boom de projetos open source a partir de 2008 que logo após houve a troca do CEO da Microsoft, empresa no qual passou de "Linux is cancer" para "Microsoft loves Linux" ocasionando na compra do Github pela Microsoft em 2018. É certo que até para as grandes empresas a inovação é disruptiva. 

Porém há um contra em todos esses serviços que as grandes empresas fornecem, apesar de muitos serem de código aberto, é que todos são serviços centralizados na empresa com um servidor central.

![Group 38.png](/images/posts/radicle-um-grande-candidato-como-alternativa-ao-github-gitlab-e-bitbucket/image-12.webp)

A vantagem de um servidor distribuído para uma rede Cliente-Servidor é nas questões de falhas, em uma rede Cliente Servidor é sempre esperado que o Servidor esteja "escutando" e servindo as informações necessárias. Caso ele caia, teoricamente, nenhum dos clientes consegue acessar seu conteúdo. O mesmo não ocorre em uma rede P2P.

![Group 39.png](/images/posts/radicle-um-grande-candidato-como-alternativa-ao-github-gitlab-e-bitbucket/image-13.webp)

### Web2 centralizada e Web3 distribuída

Antigamente, você tinha seu código, seus binários, eles estavam com você. Hoje em dia um serviço como o Google Docs, por exemplo, os arquivos nem são seus mais, eles são do Google, Microsoft, Amazon etc. Isso é a Web 2.0. Que basicamente concentra todos os serviços, arquivos e binários em um servidor externo ao seu. Seguindo por essa linha de raciocínio você não concorda que o mesmo se aplica no Github?

Foi esses problemas que novos devs estão surgindo com propostas open source em Computação distribuída, buscando usar como rede o P2P e contratos blockchain em seus serviços. É algo novo que pode ser uma aposta alta, porém bem promissora. E já tem nome, Web3 segundo a  [Ethereum Foundation](https://ethereum.org/en/developers/docs/web2-vs-web3/) .

Gostou da primeira impressão? 

Deixe seu comentário e seu like no artigo!

Até mais!
