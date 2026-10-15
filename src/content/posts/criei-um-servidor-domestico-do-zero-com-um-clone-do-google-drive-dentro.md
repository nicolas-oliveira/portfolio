---
title: "Criei um servidor doméstico do ZERO com um clone do Google Drive dentro"
slug: "criei-um-servidor-domestico-do-zero-com-um-clone-do-google-drive-dentro"
publishedAt: "2020-12-14"
subtitle: "Nesse último final de semana, meu pai estava cansado da lentidão do Pentium 4 dele, no qual usava para salvar as fotos da família digitalizadas e agora apenas q..."
excerpt: "Nesse último final de semana, meu pai estava cansado da lentidão do Pentium 4 dele, no qual usava para salvar as fotos da família digitalizadas e agora apenas q"
coverImage: "/images/posts/criei-um-servidor-domestico-do-zero-com-um-clone-do-google-drive-dentro/cover.webp"
tags: ["Git", "Node.js", "Linux"]
---

Nesse último final de semana, meu pai estava cansado da lentidão do Pentium 4 dele, no qual usava para salvar as fotos da família digitalizadas e agora apenas queria visualizar suas fotos antigas em um clima de nostalgia natalino...

E olha, não foi a primeira vez que tentei resgatar dos mortos essa máquina, ela estava abandonada em uma situação de deplorável sujeira, estava com a pilha do CMOS acabando e ao ligar começava apitar igual uma cigarra! Sim, é uma relíquia! 

Ele estava com Windows XP e  [ZorinOS](https://zorinos.com)  no qual testei uma interface "**Low spec**" para ver se ele conseguia rodar sem dar crash. Porém não resolveu muito. Nesse final de semana mesmo, o Google parece que leu minha mente e um vídeo do Diolinux apareceu na minha timeline no qual parecia salvar meu dia:

Apesar de ser um vídeo simples, ele não ensinou o ***SCRATCH***, a instalação do ZERO. O DioLinux no seu vídeo usou o SNAP e infelizmente comigo não rolou.... Por isso, a aplicação Nextcloud que irei ensinar logo em seguida será uma instalação mais "ROOT"...

Para ficar mais fácil eu dividi em duas partes:

- 1) Formatação, instalação e configuração do Debian e Servidor
- 2) Instalação e Configuração do NextCloud

Sabendo isso, podemos começar.

# Parte 1: Instalação do Debian 10 Buster Server do extremo ZERO

> **AVISO:** Não me responsabilizo por eventuais perdas e nem por nenhum erro cometido dentro deste artigo, esse artigo tem o intuito de ser educacional e informativo APENAS.

Mas por que o Debian? 

Ele é leve, estável e extremamente compatível com muitos hardwares, muitos servidores usam Debian e RedHat. 

Para começar, pegue um computador no qual você não precise usar e possa ser útil como servidor. Não precisa ser um hardware moderno, nem HD novos, apesar que isso seja o recomendado, caso não tenha muitas pessoas usando, um hardware até pior que o meu pode ser útil.

Tenha um pendrive em mãos para a instalação do sistema operacional e vamos botar a mão na massa!

### Encontrar a imagem de sistema

 [Neste link](http://cdimage.debian.org/cdimage/release/current/multi-arch/iso-cd/) você poderá baixar uma ISO multi-arquitetura, o que é bom caso você não tenha certeza se o seu é 32bits ou 64bits. Você pode escolher aqueles que não contenham XFCE no nome pois utilizaremos uma ISO limpa sem nenhum programa.

Agora se você tem o interesse de baixar especificamente para a sua arquitetura, seja porque, você escolheu um Rasperberry Pi ou algum outro processador como o ARM64 você pode encontrar a ISO da sua arquitetura nestes links:

- [32 bits](http://cdimage.debian.org/cdimage/release/current/i386/iso-cd/) 
- [64 bits](http://cdimage.debian.org/cdimage/release/current/amd64/iso-cd/) 
- [ARM64](http://cdimage.debian.org/cdimage/release/current/arm64/iso-cd/) 
- [Todas as outras](http://cdimage.debian.org/cdimage/release/current/)

Eu por ter um computador 32 bits, escolhi por baixar o i386 que irá funcionar melhor no Pentium 4.

### Queimar a imagem de sistema dentro do pendrive

Após isso você poderá baixar um gravador de ISO, ele que irá colocar o instalador dentro do pendrive no qual mais tarde iremos espetar no hardware alvo. Para isso, você poderá usar o Balena Etcher no qual recomendo bastante e você pode encontrar [neste link](https://www.balena.io/etcher/) e terá uma interface assim:

![Balena Etcher](/images/posts/criei-um-servidor-domestico-do-zero-com-um-clone-do-google-drive-dentro/image-1.webp)

Se você tiver baixado a imagem de sistema, basta clicar em ***Flash from file*** e navegar até o arquivo, espete no computador que você não irá formatar e clique em ***Flash***.

Depois dele terminar, basta desplugar e plugar no hardware alvo que iremos formatar.

### Configuração de BIOS

Neste momento devemos ter muito cuidado, pois caso tenha algum SO já instalado na máquina você precise mudar a ordem de boot e em casos muito raros hardwares bloqueam do usuário a instalação de outros sistemas operacionais. Dessa forma, pesquise e veja o que será necessário realizar ali, ***COM MUITO CUIDADO***.

No meu caso eu apenas precisei encontrar o SANDISK dentro da ordem de boot e colocar como 1st

![Configuração da bios](/images/posts/criei-um-servidor-domestico-do-zero-com-um-clone-do-google-drive-dentro/image-2.webp)

## Instalação do Debian

A partir daqui eu segui [esse guia do próprio Debian](https://servidordebian.org/pt/buster/install/guide), para que esse artigo não fique grande de mais, peço que leia com a maior atenção possível, tome os cuidados com a rede no qual ele irá ensinar e após isso volte aqui para continuarmos. Pois tem mais!

Se tudo ocorreu como esperado, basta que você ligue seu computador para que o servidor esteja funcional, porém em muitos casos será necessário instalar o SSH no servidor e na sua máquina (Cliente) para isso basta seguir os seguintes passos:

### Servidor

Para o servidor, você terá que entrar na tela inicial do server:

![Tela inicial do debian](/images/posts/criei-um-servidor-domestico-do-zero-com-um-clone-do-google-drive-dentro/image-3.webp)

E instalar o SSH com esse comando:

```
apt-get install openssh-server
```

Talvez seja necessário utilizar os privilégios de root, caso ele não reconheça o `sudo` é porque é necessário entrar em `su` e digitar a senha para efetuar a manutenção, tudo isso você definiu anteriormente na instalação do Debian.

Após ele terminar a instalação reinicie o servidor.

### Outro computador

Para que outra máquina acesse o servidor remotamente, temos que instalar o SSH na máquina que irá acessá-lo, porém não é necessário em todas que forem usar o NextCloud. O NextCloud funciona independente do SSH estar na máquina, isso é apenas ao configurar o nosso sistema. Agora, se você tiver paciência, pode escrever tudo no terminal do servidor mesmo.

Mas se você como eu prefere acessar por outro computador vamos lá:

- Windows 10:

Para instalar no Windows o SSH você terá que ativar o OpenSSH que se econtra atualmente como recurso nativo através da Fall Creators Update, [como dito aqui](https://tecnoblog.net/229971/windows-10-ativar-openssh-cliente/)

- Windows XP,7, Vista, 8 e 8.1:

Instale uma interface ou o [PuTTY aqui](https://www.putty.org)

- Manjaro e Arch Linux:
  
  ```
  sudo pacman -S openssh
  ```

- Debian, Ubuntu e derivados:
  
  ```
  sudo apt install openssh-client
  ```

## Conectando remotamente com o servidor

Para que você consiga acessar seu servidor você precisará saber o número de IP e o nome do usuário padrão (Foi definido durante a instalação do Debian). Isso você pode verificar no bash do seu servidor, que no meu caso foi `servidor@servidor$~`.

Abra seu terminal e rode um comando neste formato `<NomeDoServidor>@<IPdoServidor>`:

```
ssh servidor@192.168.1.119
```

Ele irá pedir a senha que você definiu para o seu servidor e após isso retornará uma mensagem assim:

```
Linux servidor 4.19.0-13-686-pae #1 SMP Debian 4.19.160-2 (2020-11-28) i686

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Sun Dec 13 16:07:05 2020
servidor@servidor:~$ 
```

Parabéns! Servidor 100% Configurado!

# Parte 2: Instalando o NextCloud

<img src="https://cdn.hashnode.com/res/hashnode/image/upload/v1607887081120/_64a_KU_v.png" style="display: flex; align-items: center; justify-content: center" />

Enfim a parte mais interessante do artigo! 

O Nextcloud é um pacote de software cliente-servidor para criar e usar serviços de hospedagem de arquivos. Ele é gratuito e de código aberto o que torna muito interessante para nós que estamos lidando com um servidor doméstico apenas para aprender! :)

Ele será executado no navegador e todos os dispositivos conectados na sua rede local (inclusive celulares) podem acessar o servidor! Lembra que eu disse que não é necessário nenhuma instalação para usar o NextCloud? Então é isso...

Recomendo testar e instalar o snap primeiro, caso não consiga desinstale e tente o que vou ensinar em seguida pois assim temos um maior controle do que está acontecendo no nosso servidor.

### Servidor Apache

Por ser uma página web, o primeiro passo será a instalação do servidor web Apache. Para conseguir, basta executar o seguinte comando:

```
sudo apt install apache2 libapache2-mod-php
```

Se você executar `systemctl status apache2` o programa deverá estar em execução:

```
servidor@servidor:~$ systemctl status apache2
● apache2.service - The Apache HTTP Server
   Loaded: loaded (/lib/systemd/system/apache2.service; enabled; vendor preset: enabled)
   Active: active (running) since Sun 2020-12-13 16:06:28 -03; 25min ago
     Docs: https://httpd.apache.org/docs/2.4/
  Process: 388 ExecStart=/usr/sbin/apachectl start (code=exited, status=0/SUCCESS)
 Main PID: 516 (apache2)
    Tasks: 6 (limit: 3532)
   Memory: 21.1M
   CGroup: /system.slice/apache2.service
           ├─516 /usr/sbin/apache2 -k start
           ├─543 /usr/sbin/apache2 -k start
           ├─544 /usr/sbin/apache2 -k start
           ├─545 /usr/sbin/apache2 -k start
           ├─546 /usr/sbin/apache2 -k start
           └─547 /usr/sbin/apache2 -k start
```

Se for no seu computador cliente e entrar no navegador e colocar o IP na barra de pesquisa ele pode retornar uma página assim:

![Imagem do apache funcionando](/images/posts/criei-um-servidor-domestico-do-zero-com-um-clone-do-google-drive-dentro/image-4.webp)

### PHP

O próximo programa que o NextCloud depende é o php, iremos instalar a partir desse comando:

```
sudo apt-get install -y php php-gd php-curl php-zip php-dom php-xml php-simplexml php-mbstring
```

Se você executar o comando abaixo verá que a versão é a 7.3:

```
servidor@servidor:~$ php -v
PHP 7.3.19-1~deb10u1 (cli) (built: Jul  5 2020 06:46:45) ( NTS )
Copyright (c) 1997-2018 The PHP Group
Zend Engine v3.3.19, Copyright (c) 1998-2018 Zend Technologies
    with Zend OPcache v7.3.19-1~deb10u1, Copyright (c) 1999-2018, by Zend Technologies
```

### Mysql

O próximo será o banco de dados mysql, e nele será necessário configurar alguns detalhes. Aqui será necessário um cuidado maior pois caso um comando esteja errado será necessário reverter a operação. Contudo basta seguir os comandos a seguir que irá funcionar.

Instalação:

```
apt install mysql-server php-mysql
```

Entre no modo root para criação de tabelas:

```
mysql -u root -p
```

Insira a seguinte Query:

```
CREATE DATABASE nextclouddb;
```

Ele irá retornar uma resposta de sucesso, e após isso faça trocando `strong password` por uma senha que seja do seu interesse

```
GRANT ALL ON nextclouddb.* TO 'nextcloud_user'@'localhost' IDENTIFIED BY 'strong password';
```

Após isso:

```
FLUSH PRIVILEGES;
```

Para sair basta:

```
EXIT;
```

### Baixando o NextCloud

Com a base de dados configurada, agora é a hora de baixar o Nexcloud e pra isso primeiro, navegue para uma pasta temporária:

```
cd /tmp
```

Baixe o zip do Nextcloud usando o comando a seguir (Instale se não existir):

```
wget https://download.nextcloud.com/server/releases/nextcloud-16.0.1.zip
```

Agora, descompacte o arquivo comprimido utilizando o comando a seguir (Instale se necessário):

```
unzip nextcloud-16.0.1.zip
```

Iremos mover a pasta descompactada para o diretório web root como mostrado a seguir:

```
mv nextcloud /var/www/html
```

Vá até a pasta que descompactamos:

```
cd /var/www/html
```

Mude a permissão de arquivo do nextcloud para o provedor de arquivos `www`:

```
sudo chown -R www-data:www-data nextcloud
```

Coloque a permissão de arquivo da pasta como 755 que indica leitura para todos os usuários e alteração para todos com restrição de grupo e usuário.

```
sudo chmod -R 755 nextcloud
```

Após todos esse comandos você poderá acessar seu novo nextcloud no seguinte endereço:
`http://iP_address/nextcloud/index.php`, onde IP_adress é o seu IP da máquina.

Com tudo isso funcionando perfeitamente você verá a página inicial do seu NextCloud, no qual você terá que criar um usuário administrador do sistema, banco de dados e configurações de rede:

![Pagina inicial do nextcloud](/images/posts/criei-um-servidor-domestico-do-zero-com-um-clone-do-google-drive-dentro/image-5.webp)

Após finalizar você poderá usar o sistema livremente! Podendo até customizar! Olhe como ficou o meu:
![NexCloud página inicial modificada](/images/posts/criei-um-servidor-domestico-do-zero-com-um-clone-do-google-drive-dentro/image-6.webp)

![Interface no final de toda instalação](/images/posts/criei-um-servidor-domestico-do-zero-com-um-clone-do-google-drive-dentro/image-7.webp)

E sabe qual é o melhor de tudo? Não precisei nem de 200MB de RAM, o Pentium 4 não só deu conta como sobrou HARDWARE pra tudo isso:

![Memória RAM no final de tudo](/images/posts/criei-um-servidor-domestico-do-zero-com-um-clone-do-google-drive-dentro/image-8.webp)

Bacana né?
