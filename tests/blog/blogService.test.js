import { describe, it, expect } from 'vitest';
import { getArticles, getArticleById } from '../../src/services/blog/index.js';

describe('Blog Service (Casca Agnóstica)', () => {
  it('deve retornar a primeira página de artigos no formato 3x3 (9 itens)', async () => {
    const result = await getArticles({ page: 1, limit: 9 });

    expect(result).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.items.length).toBe(9);
    expect(result.page).toBe(1);
    expect(result.hasMore).toBe(true);

    // Valida o contrato ArticleSummary em cada item
    result.items.forEach((article) => {
      expect(article.id).toBeTypeOf('string');
      expect(article.title).toBeTypeOf('string');
      expect(article.excerpt).toBeTypeOf('string');
      expect(article.coverImage).toMatch(/^(\/images\/|https?:\/\/)/);
      expect(article.publishedAt).toBeTypeOf('string');
      expect(article.readTime).toMatch(/min$/);
      expect(Array.isArray(article.tags)).toBe(true);
    });
  });

  it('deve suportar paginação e controle de hasMore para o infinite scroll', async () => {
    const page1 = await getArticles({ page: 1, limit: 9 });
    const page2 = await getArticles({ page: 2, limit: 9 });

    expect(page2.page).toBe(2);
    expect(Array.isArray(page2.items)).toBe(true);

    // Os itens da página 2 devem ser diferentes da página 1
    const idsPage1 = new Set(page1.items.map((a) => a.id));
    const hasOverlap = page2.items.some((a) => idsPage1.has(a.id));
    expect(hasOverlap).toBe(false);
  });

  it('deve retornar o artigo detalhado pelo ID com conteúdo Markdown e código', async () => {
    const list = await getArticles({ page: 1, limit: 1 });
    const targetId = list.items[0].id;

    const detail = await getArticleById(targetId);

    expect(detail).toBeDefined();
    expect(detail.id).toBe(targetId);
    expect(detail.title).toBeTypeOf('string');
    expect(detail.subtitle).toBeTypeOf('string');
    expect(detail.coverImage).toMatch(/^(\/images\/|https?:\/\/)/);
    expect(detail.content).toBeTypeOf('string');
    // Deve conter blocos de código em markdown (```)
    expect(detail.content).toContain('```');
    expect(Array.isArray(detail.tags)).toBe(true);
  });

  it('deve lançar erro se o artigo não for encontrado', async () => {
    await expect(getArticleById('artigo-inexistente-404')).rejects.toThrow();
  });
});
