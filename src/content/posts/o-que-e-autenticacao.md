---
title: "O que é Autenticação?"
slug: "o-que-e-autenticacao"
publishedAt: "2024-07-29"
subtitle: "Nesses últimos dias, um colega desenvolvedor veio reclamar que o aplicativo dele estava deslogando os usuários toda hora..."
excerpt: "Nesses últimos dias, um colega desenvolvedor veio reclamar que o aplicativo dele estava deslogando os usuários toda hora, no qual usava para gerenciar clientes..."
coverImage: "/images/posts/o-que-e-autenticacao/cover.webp"
tags: ["Segurança", "Auth", "Node.js", "JWT"]
---

Nesses últimos dias, um colega desenvolvedor veio reclamar que o aplicativo dele estava deslogando os usuários toda hora, no qual usava para gerenciar clientes, e agora apenas queria que a sessão continuasse funcionando em um clima de paz sem dores de cabeça...

E olha, não foi a primeira vez que tentei resgatar dos mortos uma aplicação assim, o código estava abandonado em uma situação de deplorável confusão, estava com tokens expirando do nada e ao testar começava a estourar erros na tela igual uma cigarra! Sim, é uma relíquia das más práticas!

Ele estava salvando os segredos do JWT direto no front-end no qual testei uma abordagem "**Low spec**" para ver se ele conseguia rodar sem dar crash. Porém não resolveu muito. Nesse final de semana mesmo, comecei a reescrever o código dele no qual parecia salvar o dia...

Apesar de ser um assunto muito comentado, a maioria dos cursos não ensina o ***SCRATCH***, a autenticação do ZERO. O pessoal usa bibliotecas mágicas e provedores prontos e infelizmente comigo não rolou.... Por isso, a estrutura que irei ensinar logo em seguida será uma implementação mais "ROOT"...

Para ficar mais fácil eu dividi em duas partes:

- 1. Token Público, Segredo e Token que não atualiza
- 2. OAuth, Bearer e JWT

Sabendo isso, podemos começar.

# Parte 1: Fundamentos da Autenticação do extremo ZERO

> **AVISO:** Não me responsabilizo por eventuais vazamentos de dados e nem por nenhum erro cometido dentro deste artigo, esse artigo tem o intuito de ser educacional e informativo APENAS.

Mas por que usar Tokens e não Sessões clássicas?

Ele é leve, escalável e extremamente compatível com muitas APIs, muitos servidores modernos usam e adotam o JWT.

Para começar, entenda as chaves de acesso no qual você precise usar. Não precisa ser uma arquitetura complexa, apesar que isso seja o recomendado em sistemas robustos, caso não tenha muitas pessoas usando, um fluxo básico até mais simples que o meu pode ser útil.

Tenha o seu editor de código em mãos para a implementação do sistema e vamos botar a mão na massa!

### Token Público e Segredo no Cliente

Sempre que integramos um sistema de login ou usamos provedores externos, recebemos credenciais básicas: o Token Público (ou Client ID) e o Segredo do Cliente (Client Secret). O Token Público é sua identidade. Ele identifica seu app e tudo bem ele ir parar no código do front-end.

Agora, o Segredo do Cliente (Client Secret)... Neste momento devemos ter muito cuidado, pois caso um atacante tenha acesso, a segurança de toda a aplicação vai por água abaixo. Dessa forma, pesquise e veja o que será necessário realizar ali para injetar o segredo através de variáveis de ambiente no servidor, ***COM MUITO CUIDADO***. Ele **nunca** deve ir para o lado do cliente!

### O Token que não atualiza

A partir daqui eu resolvi o problema do meu colega. Sabe quando o token expira rápido (ex: em 15 minutos) e derruba o usuário? Isso é ótimo para a segurança, mas se você não tratar, a experiência de usuário desmorona.

Para resolver o problema do token que não atualiza, nós utilizamos o `Refresh Token`. Ele é um token de vida longa salvo de forma segura. Quando o `Access Token` principal expira, o front-end envia silenciosamente o `Refresh Token` para uma rota específica no servidor. Se tudo ocorreu como esperado, basta que o servidor devolva um novo `Access Token` e a sessão do usuário continue funcional sem ele precisar digitar a senha novamente!

# Parte 2: OAUTH, Bearer e JWT

Enfim a parte mais interessante do artigo!

### OAUTH

O OAuth é um padrão de protocolo para criar e usar delegação de acesso seguro. Ele é um padrão da indústria e de código aberto o que torna muito interessante para nós que estamos lidando com autenticação apenas para aprender! :)

Ele permite que você faça o clássico "Entrar com o Google". Em vez de pedir a senha do usuário e gerenciar tudo do zero, o OAuth pede uma autorização para o provedor externo e recebe os tokens necessários. Lembra que eu disse que você não precisa reinventar a roda na segurança? Então é isso...

### Bearer Token

Se você executar uma verificação no painel de rede do navegador, o cabeçalho deverá estar assim:

```http
GET /api/user/profile HTTP/1.1
Host: api.exemplo.com
Authorization: Bearer seu_token_jwt_aqui

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

A palavra Bearer significa "Portador". Ou seja, quem portar o token tem acesso liberado!

### JWT (JSON Web Token)

O JWT é a estrutura desse token que enviamos. E nele será necessário configurar alguns detalhes. Aqui será necessário um cuidado maior pois caso o segredo vaze será necessário reverter a operação invalidando todas as assinaturas ativas. Contudo basta seguir as boas práticas a seguir que irá funcionar.
Ele é composto por 3 partes separadas por um ponto `.`:

1. **Header:** O tipo de token e o algoritmo matemático de criptografia (ex: HS256).
2. **Payload:** O corpo da mensagem contendo os dados não sensíveis do usuário.
3. **Signature:** A assinatura matemática que garante que ninguém alterou o Payload.
   Se você executar um console do token gerado verá que a versão é composta por um bloco longo assim:

```
eyJhbGciOiJIUzI1NiIsIn.eyJzdWIiOiIxMjMiLCJuYW.SflKxwRJSMeKKF2QT4fwpM
```

Com tudo isso funcionando perfeitamente você verá a proteção inicial da sua aplicação validando apenas o token em vez de bater na base de dados toda hora, no qual você terá que ter menos dor de cabeça com gargalos de requisição.
E sabe qual é o melhor de tudo? Com o JWT bem estruturado, você não precisa de processamento excessivo para verificar os usuários em cada rota da sua API. O código vai ficar tão leve que o servidor não só dará conta como sobrará HARDWARE pra tudo isso:
O que achou? Boa sacada né?
