---
title: "Faça seu push automaticamente com SSH no Github (Linux)"
slug: "faca-seu-push-automaticamente-com-ssh-no-github-linux"
publishedAt: "2021-01-12"
subtitle: "Se você já está usando há um bom tempo o Git e o Github no Linux você irá concordar comigo que tem uma coisa que é muito chata nisso tudo que é ter que colocar ..."
excerpt: "Se você já está usando há um bom tempo o Git e o Github no Linux você irá concordar comigo que tem uma coisa que é muito chata nisso tudo que é ter que colocar "
coverImage: "/images/posts/faca-seu-push-automaticamente-com-ssh-no-github-linux/cover.webp"
tags: ["Git", "Linux"]
---

## Fazer a mesma coisa é chato

Se você já está usando há um bom tempo o Git e o Github no Linux você irá concordar comigo que tem uma coisa que é muito chata nisso tudo que é ter que colocar seu **usuário e senha** à todo momento a cada commit e push que se dá no repositório. 

Mas você sabia que é possível fazer isso automaticamente se v a máquina que você está usando é a sua pessoal ou é sempre a mesma?

O Github tem um esquema de confirmação por chave SSH, que certifica que você é você mesmo ao mandar alguma coisa para o servidor deles. Curioso para saber como? Vamos lá..

### Verifique se já existe alguma coisa:

Primeiro precisamos ter certeza que alguma chama não foi gerada recentemente para isso basta acessar a pasta:

```
ls -al ~/.ssh
```

Caso ele retorne algum arquivo `.pub` significa que alguma vez neste computador alguém gerou uma senha. Nesse momento você tem uma escolha, que é partir para o ultimo passo de configuração no github, ou apagar a pasta `~/.ssh` e tentar novamente.

### Criar a ssh-key no sistema

Para gerar uma ssh-key com o seu email correspondente ao Gihub basta usar:

```
ssh-keygen -t ed25519 -C "seu_email@exemplo.com"
```

Você deve tomar muito cuidado pois o email utilizado deve ser igual o email usado no seu github. Se não for feito dessa forma ele não irá funcionar.

Ele irá pedir para criar um novo arquivo no seu diretório, dessa forma:

```
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/nicolas/.ssh/id_ed25519):
```

Normalmente, caso necessário, você pode configurar mais de um arquivo, e pra esse sentido basta escolher o nome. Porém não recomendo alterar se caso é sua primeira vez utilizando o SSH. Para não escolher basta dar **enter**.

Logo após ele irá pedir uma frase para reforço da chave, se você quiser pode escrever alguma frase ou ruído para que a criptografia fique mais forte. Caso contrário, basta dar **enter** para que a frase seja vazia.

```
Created directory '/home/nicolas/.ssh'.
Enter passphrase (empty for no passphrase):
```

Depois irá gerar o restante dessa forma:

```
Your public key has been saved in /home/nicolas/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:xxxxxxxxxxxxxxxxxxxxxxxxxxx nicolasm15@hotmail.com
The key's randomart image is:
+--[ED25519 256]--+
|                 |
|                 |
|       .         |
|    . + .   .    |
|     = O..+ o .  |
|    +.+ @.B . E  |
|   . oo+ &.=     |
|    .+ ./.oo.    |
|    . =X**=o.    |
+----[SHA256]-----+
```

Caso já exista ele irá retornar algo assim:

```
/home/nicolas/.ssh/id_ed25519 already exists.
Overwrite (y/n)?
```

Basta seguir o comando ou apagar a pasta e tentar novamente.

### Adicionar ao ssh-agent do Sistema Operacional

Nesse ponto o ssh-key já deve existir e portanto você pode ativar o agent através de:

```
 eval "$(ssh-agent -s)"
```

Importante frizar que o fish não executa comandos com `"$()"` e devido uma decisão deles não é possível executar comandos de substituição no terminal. Dessa forma, talvez seja necessário entrar no BASH.

O próximo comando é o responsável por adicionar no diretório:

```
ssh-add ~/.ssh/id_ed25519
```

### Adicionando a chave no github

Nesse ponto devemos adicionar a chave no nosso Github, para isso devemos copiar seu conteúdo e colar no site.

Existe um pacote que ajuda a copiar o conteúdo da chave sem precisar alterar ou corromper pela falta de algum caractere que é:
Ubuntu e Debian

```
sudo apt-get install xclip
```

Arch Linux e Manjaro

```
sudo pacman -S xclip
```

Para executar o comando basta:

```
xclip -selection clipboard < ~/.ssh/id_ed25519.pub
```

Depois de copiado você pode abrir seu Github e acessar suas configurações:

![image.png](/images/posts/faca-seu-push-automaticamente-com-ssh-no-github-linux/image-1.webp)

Ir em `SSH and GPD keys`:

![image.png](/images/posts/faca-seu-push-automaticamente-com-ssh-no-github-linux/image-2.webp)

Crie uma nova chave `New SSH Key`:
![image.png](/images/posts/faca-seu-push-automaticamente-com-ssh-no-github-linux/image-3.webp)

Cole o conteúdo do comando `xclip`:
![image.png](/images/posts/faca-seu-push-automaticamente-com-ssh-no-github-linux/image-4.webp)

Ficando dessa forma:
![image.png](/images/posts/faca-seu-push-automaticamente-com-ssh-no-github-linux/image-5.webp)

Mantenha essa aba aberta porque utilizaremos no próximo passo.

### Teste a conexão com Github

Nesse momento ainda não está 100% configurado, você precisa fazer sua primeira interação com o Github com a sua chave. Para isso basta:

```
ssh -T git@github.com
```

Você poderá receber um aviso como este:

```
The authenticity of host 'github.com (140.82.113.4)' can't be established.
RSA key fingerprint is SHA256:nThbg6kXUpJWGl7E1IGOCspRomTxdCARLviKw6E5SY8.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

Nesse momento ele errou a sua chave. Isso é normal, copie a chave `SHA256:xxx` no qual está em seu Github, cole no terminal e pressine **enter**. Ele irá dizer:

```
Please type 'yes', 'no' or the fingerprint:
```

Basta escrever `yes`.

Nesse momento se ele retornou a seguinte mensagem com o seu nome, você obteve sucesso.

```
Warning: Permanently added 'github.com,140.82.113.4' (RSA) to the list of known hosts.
Hi nicolas-oliveira! You've successfully authenticated, but GitHub does not provide shell access.
```

Caso ainda assim ele retornou um erro quem sabe vale a pena testar, consultando esses erros:

- ["Erro: agente com falha ao entrar".](https://docs.github.com/pt/free-pro-team@latest/github/authenticating-to-github/error-agent-admitted-failure-to-sign) 
- ["Erro: permissão negada (publickey)"](https://docs.github.com/pt/free-pro-team@latest/github/authenticating-to-github/error-permission-denied-publickey) 

### A parte que interessa

Se você utilizava HTTPS para enviar seus pushs nos seus repositórios talvez seja necessário remover e adicionar novamente sua origem remota do repo. Dessa forma:

Para remover a origem HTTPS

```
git remote rm origin
```

Para adicionar uma nova origem

```
git add remote origin <ssh-origin>
```

Para encontrar a origem SSH de cada repositório, basta entrar no repositório e clicar em Code.

![image.png](/images/posts/faca-seu-push-automaticamente-com-ssh-no-github-linux/image-6.webp)

Pronto! Nesse momento tudo está indo automaticamente para o servidor! 😀

Ficou com dúvidas? Manda ai nos comentários...
