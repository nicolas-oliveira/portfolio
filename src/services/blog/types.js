/**
 * @typedef {Object} ArticleSummary
 * @property {string} id - Identificador único ou slug
 * @property {string} title - Título do artigo
 * @property {string} excerpt - Descrição curta para o card (~100-160 caracteres)
 * @property {string} coverImage - URL da imagem de capa (banner)
 * @property {string} publishedAt - Data legível de publicação
 * @property {string} readTime - Tempo estimado de leitura (ex: "5 min")
 * @property {string[]} tags - Lista de tags/categorias
 */

/**
 * @typedef {Object} ArticleDetail
 * @property {string} id - Identificador único
 * @property {string} title - Título principal
 * @property {string} subtitle - Subtítulo ou resumo
 * @property {string} coverImage - URL do banner em alta resolução
 * @property {string} content - Conteúdo bruto em Markdown (GFM)
 * @property {string} publishedAt - Data formatada
 * @property {string} readTime - Tempo estimado de leitura
 * @property {string[]} tags - Lista de tags
 * @property {{ name: string, avatarUrl?: string }} [author] - Dados do autor
 */

/**
 * @typedef {Object} PaginatedArticles
 * @property {ArticleSummary[]} items - Lista de artigos da página atual
 * @property {boolean} hasMore - Se ainda existem mais artigos
 * @property {number} page - Número da página atual
 * @property {number} [total] - Total de artigos cadastrados
 */

export const BLOG_CONFIG = {
  DEFAULT_PAGE_SIZE: 9, // Layout 3x3 (3 colunas por 3 linhas)
};
