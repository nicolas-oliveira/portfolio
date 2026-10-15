const MOCK_ARTICLES = [
  {
    id: 'como-funciona-o-v8',
    title: 'Como funciona o motor V8 do Node.js e Chrome',
    subtitle: 'Uma análise profunda dos compiladores Ignition e TurboFan para alta performance.',
    excerpt: 'Descubra como o JavaScript é interpretado, otimizado e compilado em código de máquina pelo motor V8.',
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    publishedAt: '12 de Outubro, 2026',
    readTime: '6 min',
    tags: ['Node.js', 'V8', 'Compiladores'],
    content: `# Como funciona o motor V8 do Node.js e Chrome

O **V8** é o motor de execução de JavaScript de código aberto do Google, escrito em C++. Ele é o coração do Google Chrome e também do ambiente de execução Node.js.

## O Pipeline de Execução

Ao contrário dos motores tradicionais de linguagens interpretadas, o V8 não utiliza um interpretador puro sem compilação. Em vez disso, ele combina um interpretador rápido com um compilador otimizador JIT (*Just-In-Time*).

1. **Parser**: Transforma o código-fonte em uma Árvore de Sintaxe Abstrata (AST).
2. **Ignition**: O interpretador que converte a AST em *bytecode*.
3. **TurboFan**: O compilador otimizador que compila *hot bytecodes* diretamente em código de máquina de altíssimo desempenho.

\`\`\`javascript
// Exemplo de função otimizada pelo TurboFan
function computeHash(input, iterations = 1000) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < iterations; i++) {
    hash ^= input.charCodeAt(i % input.length);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

console.log('Hash calculado:', computeHash('cyberpunk-2026'));
\`\`\`

> "A grande mágica do V8 é compilar funções frequentes em código nativo enquanto o programa roda, coletando informações de tipo dinamicamente."

## Dicas para manter seu código otimizado

- **Monofórmico vs Polifórmico**: Mantenha sempre a mesma forma (*hidden classes*) nos seus objetos.
- **Evite deletar propriedades com \`delete\`**: Prefira atribuir \`null\` ou criar novos objetos para não desotimizar a classe interna.
`,
  },
  {
    id: 'arquitetura-hexagonal-no-front-end',
    title: 'Arquitetura Hexagonal no Front-end React',
    subtitle: 'Isolando regras de negócio e desacoplando seu app de APIs e CMSs externos.',
    excerpt: 'Aprenda a aplicar Ports and Adapters para nunca mais reescrever telas ao trocar de backend.',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    publishedAt: '08 de Outubro, 2026',
    readTime: '7 min',
    tags: ['Arquitetura', 'React', 'Clean Code'],
    content: `# Arquitetura Hexagonal no Front-end React

A **Arquitetura Hexagonal** (também conhecida como *Ports and Adapters*) foi criada por Alistair Cockburn com o objetivo de desacoplar o núcleo de uma aplicação de suas dependências externas.

## A analogia dos Portos e Adaptadores

No front-end, frequentemente misturamos a chamada de rede (\`fetch\` ou Apollo) diretamente dentro dos componentes React (\`useEffect\`). Quando o backend muda ou precisamos trocar de CMS, temos que refatorar dezenas de arquivos de tela.

\`\`\`typescript
// Contrato do Porto (Interface)
export interface ArticleRepositoryPort {
  getArticles(page: number): Promise<Article[]>;
  getArticleById(id: string): Promise<ArticleDetail>;
}

// Adaptador concreto para CMS Headless
export class HeadlessCmsAdapter implements ArticleRepositoryPort {
  async getArticles(page: number) {
    const res = await fetch(\`/api/cms/posts?page=\${page}\`);
    return res.json();
  }
}
\`\`\`

Com essa estrutura, a interface do usuário consome apenas o porto, e a troca de provedor se torna uma simples troca de adaptador!
`,
  },
  {
    id: 'deep-dive-react-18-concurrency',
    title: 'Deep Dive no React 18 e Concurrency',
    subtitle: 'Entendendo o Concurrent Renderer, Transitions e Server Components na prática.',
    excerpt: 'Como o React moderno suspende renders caros sem bloquear a interface do usuário.',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    publishedAt: '28 de Setembro, 2026',
    readTime: '5 min',
    tags: ['React', 'Performance', 'Concurrency'],
    content: `# Deep Dive no React 18 e Concurrency

O modelo concorrente do React representa a maior mudança arquitetural na história da biblioteca.

## O que é Concurrency?

Concorrência não significa threads separadas em JavaScript; significa que o React pode interromper, pausar, retomar ou descartar uma renderização em andamento se uma interação mais urgente (como digitação de usuário) acontecer.

\`\`\`jsx
import { useState, useTransition } from 'react';

export function SearchFilter() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    // Atualização urgente (input imediato)
    setQuery(e.target.value);

    // Atualização não-urgente (pode ser suspensa se o usuário continuar digitando)
    startTransition(() => {
      filterHugeList(e.target.value);
    });
  }

  return <input value={query} onChange={handleChange} />;
}
\`\`\`
`,
  },
  {
    id: 'cyberpunk-design-system-css',
    title: 'Criando um Design System Cyberpunk com CSS Moderno',
    subtitle: 'Clip-paths dinâmicos, paletas neon hsl() e efeitos de glitch com puro CSS.',
    excerpt: 'Explore as técnicas avançadas de estilização para criar interfaces sci-fi que parecem saídas de 2077.',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80',
    publishedAt: '15 de Setembro, 2026',
    readTime: '4 min',
    tags: ['CSS', 'Design System', 'Cyberpunk'],
    content: `# Criando um Design System Cyberpunk com CSS Moderno

A estética Cyberpunk mistura alta tecnologia com baixa qualidade de vida (*high tech, low life*). No design de interfaces, isso se traduz em:

- Cores altamente saturadas em contraste com fundos escuros e cinzentos.
- Bordas anguladas e chanfradas criadas com \`clip-path\`.
- Tipografia geométrica condensada.
- Efeitos visuais de falha analógica (*glitch*) e fósforo catódico (*scanlines*).

\`\`\`css
/* Chanfro Cyberpunk via clip-path */
.cyber-card {
  --clip: polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%);
  clip-path: var(--clip);
  background: #1d1d1d;
  border-left: 3px solid #0df2f2;
  box-shadow: inset 0 0 15px rgba(13, 242, 242, 0.2);
}
\`\`\`
`,
  },
  {
    id: 'linux-para-desenvolvedores-avancados',
    title: 'Linux para Desenvolvedores: Do Bash ao Kernel',
    subtitle: 'Gerenciamento de memória, processos e manipulação avançada de streams no terminal.',
    excerpt: 'Dicas práticas para dominar seu ambiente Linux e otimizar fluxos de trabalho no dia a dia.',
    coverImage: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80',
    publishedAt: '02 de Setembro, 2026',
    readTime: '8 min',
    tags: ['Linux', 'DevOps', 'Terminal'],
    content: `# Linux para Desenvolvedores: Do Bash ao Kernel

O Linux é o sistema operacional que alimenta a internet, os servidores em nuvem e a maioria dos ambientes modernos de desenvolvimento.

\`\`\`bash
# Monitorando I/O e uso de descritores de arquivo em tempo real
lsof -i :3000
strace -c -p $(pgrep node)
\`\`\`
`,
  },
  {
    id: 'state-machines-com-xstate',
    title: 'Modelando Interfaces com Máquinas de Estado Finitas',
    subtitle: 'Eliminando bugs de estado impossível com XState e lógica determinística.',
    excerpt: 'Como substituir dezenas de booleanos confusos por máquinas de estado robustas e previsíveis.',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    publishedAt: '20 de Agosto, 2026',
    readTime: '5 min',
    tags: ['State Machines', 'XState', 'TypeScript'],
    content: `# Modelando Interfaces com Máquinas de Estado Finitas

Quantas vezes você já viu um componente com estados conflitantes como \`isLoading && isError && hasData\`?

As Máquinas de Estado Finitas (*FSM*) garantem matematicamente que o sistema só pode estar em **exatamente um estado por vez**.
`,
  },
  {
    id: 'seguranca-em-aplicacoes-web-modernas',
    title: 'Segurança em Aplicações Web: Além do OWASP Top 10',
    subtitle: 'Protegendo tokens, prevenindo XSS contextual e configurando CSP rígidas.',
    excerpt: 'Boas práticas essenciais para construir aplicações imunes a vazamento de credenciais e invasões.',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    publishedAt: '10 de Agosto, 2026',
    readTime: '6 min',
    tags: ['Segurança', 'OWASP', 'Web'],
    content: `# Segurança em Aplicações Web

A segurança deve ser um cidadão de primeira classe em qualquer arquitetura de software desde o primeiro dia.
`,
  },
  {
    id: 'graphql-vs-rest-em-2026',
    title: 'GraphQL vs REST em 2026: O Veredito Prático',
    subtitle: 'Quando a flexibilidade do GraphQL compensa o custo de complexidade e cache.',
    excerpt: 'Uma comparação pragmática para arquitetos e desenvolvedores decidirem entre REST e GraphQL.',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    publishedAt: '25 de Julho, 2026',
    readTime: '6 min',
    tags: ['API', 'GraphQL', 'REST'],
    content: `# GraphQL vs REST em 2026: O Veredito Prático

A batalha entre REST e GraphQL amadureceu. Hoje não se trata mais de 'qual é melhor', mas de entender o custo de caching na borda (Edge) versus over-fetching no cliente.
`,
  },
  {
    id: 'microfrontends-na-pratica',
    title: 'Microfrontends na Prática com Module Federation',
    subtitle: 'Dividindo grandes SPAs monolíticas em módulos independentes sem dor de cabeça.',
    excerpt: 'Técnicas reais para orquestrar times independentes em uma interface unificada e veloz.',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    publishedAt: '14 de Julho, 2026',
    readTime: '7 min',
    tags: ['Microfrontends', 'Webpack', 'Vite'],
    content: `# Microfrontends na Prática com Module Federation

Module Federation permite que diferentes aplicações compartilhem código em tempo de execução sem pacotes NPM intermediários.
`,
  },
  {
    id: 'engenharia-de-software-em-escala',
    title: 'Engenharia de Software em Escala: Resiliência e Métricas',
    subtitle: 'Observabilidade com OpenTelemetry e padrões de circuit breaker no ecossistema Node.',
    excerpt: 'Como construir sistemas que suportam milhões de requisições mantendo latência previsível.',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    publishedAt: '01 de Julho, 2026',
    readTime: '9 min',
    tags: ['Escalabilidade', 'Node.js', 'Resiliência'],
    content: `# Engenharia de Software em Escala

Resiliência não é a ausência de falhas; é a capacidade de um sistema continuar operando mesmo quando componentes falham.
`,
  },
  {
    id: 'introducao-a-web-assembly',
    title: 'WebAssembly: Executando Rust e C no Navegador a 60 FPS',
    subtitle: 'Acelerando processamento pesado e gráficos no browser com código nativo compilado.',
    excerpt: 'Um guia prático para compilar Rust para WASM e integrar diretamente com seu aplicativo React.',
    coverImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80',
    publishedAt: '18 de Junho, 2026',
    readTime: '6 min',
    tags: ['WebAssembly', 'Rust', 'Performance'],
    content: `# WebAssembly: Executando Rust e C no Navegador

WebAssembly permite executar binários compilados em tempo quase nativo na sandbox segura do navegador web.
`,
  },
  {
    id: 'testes-de-software-que-fazem-sentido',
    title: 'Testes de Software que Fazem Sentido: Nem 100% de Cobertura, Nem Zero Testes',
    subtitle: 'Focando no retorno sobre o investimento de testes unitários, integração e E2E.',
    excerpt: 'Como evitar testes frágeis que quebram a cada refatoração e focar no comportamento do usuário.',
    coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    publishedAt: '05 de Junho, 2026',
    readTime: '5 min',
    tags: ['Testes', 'TDD', 'Qualidade'],
    content: `# Testes de Software que Fazem Sentido

Testar comportamento, não implementação. Essa é a regra de ouro dos testes de software sustentáveis.
`,
  },
];

export const mockBlogAdapter = {
  async getArticles({ page = 1, limit = 9 } = {}) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const items = MOCK_ARTICLES.slice(startIndex, endIndex).map(
      ({ id, title, excerpt, coverImage, publishedAt, readTime, tags }) => ({
        id,
        title,
        excerpt,
        coverImage,
        publishedAt,
        readTime,
        tags,
      })
    );

    const hasMore = endIndex < MOCK_ARTICLES.length;

    return {
      items,
      hasMore,
      page,
      total: MOCK_ARTICLES.length,
    };
  },

  async getArticleById(id) {
    const article = MOCK_ARTICLES.find((a) => a.id === id);
    if (!article) {
      throw new Error(`Artigo com id "${id}" não encontrado.`);
    }
    return article;
  },
};
