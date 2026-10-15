import { mockBlogAdapter } from './mockAdapter.js';

/**
 * Utilitário para parse de frontmatter YAML leve (sem dependências externas de Node)
 * @param {string} rawContent
 * @returns {{ data: Record<string, any>, content: string }}
 */
export function parseFrontmatter(rawContent) {
  if (!rawContent || typeof rawContent !== 'string') {
    return { data: {}, content: '' };
  }

  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: rawContent.trim() };
  }

  const [, yamlBlock, content] = match;
  const data = {};

  yamlBlock.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx !== -1) {
      const key = trimmed.slice(0, colonIdx).trim();
      let val = trimmed.slice(colonIdx + 1).trim();

      // Trata aspas
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      } else if (val.startsWith('[') && val.endsWith(']')) {
        // Trata arrays inline: [Tag1, Tag2]
        val = val
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean);
      }
      data[key] = val;
    }
  });

  return { data, content: content.trim() };
}

/**
 * Formata data ISO para exibição amigável em Português
 * @param {string} dateStr
 * @returns {string}
 */
export function formatPublishedDate(dateStr) {
  if (!dateStr) return '';
  if (dateStr.includes(' de ')) return dateStr;

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

/**
 * Calcula tempo estimado de leitura (200 palavras/minuto)
 * @param {string} text
 * @returns {string}
 */
export function estimateReadTime(text) {
  if (!text) return '1 min';
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

/**
 * Carrega todos os arquivos markdown da pasta src/content/posts
 * @returns {Array<import('./types.js').ArticleDetail>}
 */
export function loadLocalMarkdownArticles() {
  const modules = import.meta.glob('/src/content/posts/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  });

  const articles = [];

  for (const [filepath, rawContent] of Object.entries(modules)) {
    if (!rawContent || typeof rawContent !== 'string') continue;

    // Extrai o slug do nome do arquivo (ex: /src/content/posts/meu-post.md -> meu-post)
    const filenameMatch = filepath.match(/\/([^/]+)\.md$/);
    const fileSlug = filenameMatch ? filenameMatch[1] : '';

    const { data, content } = parseFrontmatter(rawContent);

    const id = data.slug || data.id || fileSlug;
    const title = data.title || id;
    const subtitle = data.subtitle || data.brief || data.excerpt || '';
    const excerpt = data.excerpt || data.brief || subtitle || (content.slice(0, 150) + '...');
    const coverImage = data.coverImage || data.cover || '/images/posts/default-banner.webp';
    const rawDate = data.publishedAt || data.dateAdded || data.date || '';
    const publishedAt = formatPublishedDate(rawDate);
    const readTime = data.readTime ? (String(data.readTime).includes('min') ? String(data.readTime) : `${data.readTime} min`) : estimateReadTime(content);
    const tags = Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []);

    articles.push({
      id,
      title,
      subtitle,
      excerpt,
      coverImage,
      content,
      publishedAt,
      rawDate,
      readTime,
      tags,
      author: {
        name: data.authorName || 'Nicolas',
        avatarUrl: data.authorAvatar || undefined,
      },
    });
  }

  // Ordena por data decrescente (mais recentes primeiro)
  articles.sort((a, b) => {
    const timeA = a.rawDate ? new Date(a.rawDate).getTime() : 0;
    const timeB = b.rawDate ? new Date(b.rawDate).getTime() : 0;
    return timeB - timeA;
  });

  return articles;
}

export const localMarkdownAdapter = {
  /**
   * Busca artigos paginados para a listagem (Grid 3x3)
   * @param {Object} params
   * @param {number} [params.page=1]
   * @param {number} [params.limit=9]
   * @returns {Promise<import('./types.js').PaginatedArticles>}
   */
  async getArticles({ page = 1, limit = 9 } = {}) {
    const articles = loadLocalMarkdownArticles();

    // Se nenhum post local foi adicionado ainda, faz fallback transparente para o mockAdapter
    if (articles.length === 0) {
      return mockBlogAdapter.getArticles({ page, limit });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const items = articles.slice(startIndex, endIndex).map(
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

    const hasMore = endIndex < articles.length;

    return {
      items,
      hasMore,
      page,
      total: articles.length,
    };
  },

  /**
   * Busca artigo detalhado por ID / Slug
   * @param {string} id
   * @returns {Promise<import('./types.js').ArticleDetail>}
   */
  async getArticleById(id) {
    const articles = loadLocalMarkdownArticles();

    if (articles.length === 0) {
      return mockBlogAdapter.getArticleById(id);
    }

    const article = articles.find((a) => a.id === id);
    if (!article) {
      // Se não achar nos locais, tenta o mockAdapter como fallback de segurança
      try {
        return await mockBlogAdapter.getArticleById(id);
      } catch {
        throw new Error(`Artigo com id "${id}" não encontrado.`);
      }
    }

    return article;
  },
};
