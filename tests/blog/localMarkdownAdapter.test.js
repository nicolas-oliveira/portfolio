import { describe, it, expect } from 'vitest';
import {
  parseFrontmatter,
  formatPublishedDate,
  estimateReadTime,
  localMarkdownAdapter,
} from '../../src/services/blog/localMarkdownAdapter.js';

describe('Local Markdown Adapter (Git-based CMS)', () => {
  describe('parseFrontmatter', () => {
    it('deve extrair metadados YAML e o conteúdo markdown corretamente', () => {
      const raw = `---
title: "Artigo de Teste 2021"
slug: "artigo-teste-2021"
publishedAt: "2021-07-08"
tags: [Redux, JavaScript, Frontend]
coverImage: "/images/posts/artigo-teste-2021/cover.webp"
---

# Título do Post

Este é o corpo do post em markdown.
`;

      const { data, content } = parseFrontmatter(raw);

      expect(data.title).toBe('Artigo de Teste 2021');
      expect(data.slug).toBe('artigo-teste-2021');
      expect(data.publishedAt).toBe('2021-07-08');
      expect(data.tags).toEqual(['Redux', 'JavaScript', 'Frontend']);
      expect(data.coverImage).toBe('/images/posts/artigo-teste-2021/cover.webp');
      expect(content).toContain('# Título do Post');
      expect(content).toContain('Este é o corpo do post em markdown.');
    });

    it('deve lidar com conteúdo sem frontmatter graciosamente', () => {
      const raw = '# Post Simples\nSem frontmatter';
      const { data, content } = parseFrontmatter(raw);

      expect(data).toEqual({});
      expect(content).toBe('# Post Simples\nSem frontmatter');
    });
  });

  describe('formatPublishedDate', () => {
    it('deve formatar data ISO de 2021 em texto amigável em Português', () => {
      const formatted = formatPublishedDate('2021-07-08');
      expect(formatted).toMatch(/08 de julho de 2021/i);
    });

    it('deve preservar datas já formatadas em texto', () => {
      const formatted = formatPublishedDate('12 de Outubro, 2026');
      expect(formatted).toBe('12 de Outubro, 2026');
    });

    it('deve retornar vazio se a data for nula ou indefinida', () => {
      expect(formatPublishedDate('')).toBe('');
      expect(formatPublishedDate(null)).toBe('');
    });
  });

  describe('estimateReadTime', () => {
    it('deve calcular o tempo estimado de leitura com base nas palavras', () => {
      // 400 palavras ~= 2 min
      const words = Array(400).fill('palavra').join(' ');
      expect(estimateReadTime(words)).toBe('2 min');

      // poucas palavras = no mínimo 1 min
      expect(estimateReadTime('apenas um teste curto')).toBe('1 min');
    });
  });

  describe('Adapter API (getArticles & getArticleById)', () => {
    it('deve responder ao contrato getArticles com paginação completa para os 20 artigos', async () => {
      const page1 = await localMarkdownAdapter.getArticles({ page: 1, limit: 9 });
      expect(page1).toBeDefined();
      expect(Array.isArray(page1.items)).toBe(true);
      expect(page1.items.length).toBe(9);
      expect(page1.page).toBe(1);
      expect(page1.hasMore).toBe(true);
      expect(page1.total).toBe(20);

      const page2 = await localMarkdownAdapter.getArticles({ page: 2, limit: 9 });
      expect(page2.items.length).toBe(9);
      expect(page2.page).toBe(2);
      expect(page2.hasMore).toBe(true);

      const page3 = await localMarkdownAdapter.getArticles({ page: 3, limit: 9 });
      expect(page3.items.length).toBe(2);
      expect(page3.page).toBe(3);
      expect(page3.hasMore).toBe(false);
    });

    it('deve ordenar os artigos em ordem cronológica decrescente (mais recentes primeiro)', async () => {
      const all = await localMarkdownAdapter.getArticles({ page: 1, limit: 20 });
      expect(all.items.length).toBe(20);

      // O mais recente é de Julho de 2024 ("O que é Autenticação?")
      expect(all.items[0].publishedAt).toMatch(/2024/);
      expect(all.items[0].title).toBe('O que é Autenticação?');

      // O mais antigo é de Dezembro de 2020
      expect(all.items[19].publishedAt).toMatch(/2020/);
    });

    it('deve responder ao contrato getArticleById', async () => {
      const list = await localMarkdownAdapter.getArticles({ page: 1, limit: 1 });
      expect(list.items.length).toBeGreaterThan(0);

      const targetId = list.items[0].id;
      const article = await localMarkdownAdapter.getArticleById(targetId);

      expect(article).toBeDefined();
      expect(article.id).toBe(targetId);
      expect(article.title).toBeTypeOf('string');
      expect(article.content).toBeTypeOf('string');
    });

    it('deve lançar erro se o artigo pesquisado não existir', async () => {
      await expect(
        localMarkdownAdapter.getArticleById('artigo-inexistente-totalmente-falso')
      ).rejects.toThrow();
    });
  });
});
