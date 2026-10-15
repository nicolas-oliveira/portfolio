import { localMarkdownAdapter } from './localMarkdownAdapter.js';

// Casca agnóstica: o activeAdapter é o localMarkdownAdapter (Git-based Markdown CMS),
// mantendo a casca 100% desacoplada dos componentes visuais do front-end.
const activeAdapter = localMarkdownAdapter;

/**
 * Busca artigos paginados para a listagem (Grid 3x3 com Infinite Scroll)
 * @param {Object} params
 * @param {number} [params.page=1] - Página atual
 * @param {number} [params.limit=9] - Quantidade de itens por lote
 * @returns {Promise<import('./types.js').PaginatedArticles>}
 */
export async function getArticles({ page = 1, limit = 9 } = {}) {
  return activeAdapter.getArticles({ page, limit });
}

/**
 * Busca o artigo detalhado pelo ID para a página de leitura (/post/:id)
 * @param {string} id - ID ou slug do post
 * @returns {Promise<import('./types.js').ArticleDetail>}
 */
export async function getArticleById(id) {
  return activeAdapter.getArticleById(id);
}
