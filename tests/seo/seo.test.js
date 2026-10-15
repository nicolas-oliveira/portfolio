import { describe, it, expect } from 'vitest';
import {
  escapeXml,
  escapeAttr,
  normalizeDate,
  getAllPosts,
  generateSitemapXml,
  generateRobotsTxt,
  injectPostMeta,
  injectHomeMeta,
} from '../../scripts/generate-seo.mjs';
import { SITE_URL, SEO_CONFIG } from '../../src/config/seo.js';

describe('Sistema de SEO e Prerendering (generate-seo.mjs)', () => {
  describe('getAllPosts()', () => {
    it('deve carregar todos os 20 artigos da pasta src/content/posts', () => {
      const posts = getAllPosts();
      expect(posts.length).toBeGreaterThanOrEqual(20);

      const firstPost = posts[0];
      expect(firstPost).toHaveProperty('slug');
      expect(firstPost).toHaveProperty('title');
      expect(firstPost).toHaveProperty('brief');
      expect(firstPost).toHaveProperty('date');
      expect(firstPost).toHaveProperty('cover');
      expect(firstPost).toHaveProperty('tags');
    });

    it('deve incluir o artigo arquivado "O que é Autenticação?"', () => {
      const posts = getAllPosts();
      const authPost = posts.find((p) => p.slug === 'o-que-e-autenticacao');
      expect(authPost).toBeDefined();
      expect(authPost.title).toBe('O que é Autenticação?');
      expect(authPost.date).toBe('2024-07-29');
    });
  });

  describe('generateSitemapXml()', () => {
    it('deve gerar XML válido com a Home e todos os artigos', () => {
      const posts = getAllPosts();
      const xml = generateSitemapXml(posts, 'https://nicolasoliveira.dev');

      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
      expect(xml).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');

      // Home
      expect(xml).toContain('<loc>https://nicolasoliveira.dev/</loc>');
      expect(xml).toContain('<priority>1.0</priority>');

      // Artigos
      expect(xml).toContain('<loc>https://nicolasoliveira.dev/post/o-que-e-autenticacao</loc>');
      expect(xml).toContain('<image:loc>https://nicolasoliveira.dev/images/posts/o-que-e-autenticacao/cover.webp</image:loc>');
    });
  });

  describe('generateRobotsTxt()', () => {
    it('deve permitir acesso geral e referenciar o sitemap', () => {
      const robots = generateRobotsTxt('https://nicolasoliveira.dev');
      expect(robots).toContain('User-agent: *');
      expect(robots).toContain('Allow: /');
      expect(robots).toContain('Sitemap: https://nicolasoliveira.dev/sitemap.xml');
    });
  });

  describe('injectPostMeta()', () => {
    const dummyHtml = `<!DOCTYPE html><html><head><title>Old Title</title></head><body><div id="root"></div></body></html>`;
    const dummyPost = {
      slug: 'meu-post-exemplo',
      title: 'Dominando TypeScript no Backend',
      brief: 'Um guia completo de tipagem avançada e generics no Node.js.',
      date: '2026-10-15',
      cover: '/images/posts/meu-post-exemplo/cover.webp',
      tags: ['TypeScript', 'NodeJS', 'Backend'],
    };

    it('deve injetar tags Open Graph, Twitter e JSON-LD Schema.org', () => {
      const injected = injectPostMeta(dummyHtml, dummyPost, 'https://nicolasoliveira.dev', SEO_CONFIG);

      // Título e Meta
      expect(injected).toContain('<title>Dominando TypeScript no Backend | Nicolas Oliveira</title>');
      expect(injected).toContain('<meta name="description" content="Um guia completo de tipagem avançada e generics no Node.js." />');
      expect(injected).toContain('<link rel="canonical" href="https://nicolasoliveira.dev/post/meu-post-exemplo" />');

      // Open Graph
      expect(injected).toContain('<meta property="og:type" content="article" />');
      expect(injected).toContain('<meta property="og:title" content="Dominando TypeScript no Backend" />');
      expect(injected).toContain('<meta property="og:image" content="https://nicolasoliveira.dev/images/posts/meu-post-exemplo/cover.webp" />');
      expect(injected).toContain('<meta property="article:published_time" content="2026-10-15" />');
      expect(injected).toContain('<meta property="article:tag" content="TypeScript" />');

      // Twitter Cards
      expect(injected).toContain('<meta name="twitter:card" content="summary_large_image" />');
      expect(injected).toContain('<meta name="twitter:title" content="Dominando TypeScript no Backend" />');

      // JSON-LD Schema.org
      expect(injected).toContain('application/ld+json');
      expect(injected).toContain('"@type": "BlogPosting"');
      expect(injected).toContain('"headline": "Dominando TypeScript no Backend"');
      expect(injected).toContain('"@type": "Person"');
      expect(injected).toContain('Nicolas Oliveira');
    });
  });

  describe('injectHomeMeta()', () => {
    const dummyHtml = `<!DOCTYPE html><html><head><title>Old Title</title></head><body><div id="root"></div></body></html>`;

    it('deve injetar metadados da home e JSON-LD WebSite + Person', () => {
      const injected = injectHomeMeta(dummyHtml, 'https://nicolasoliveira.dev', SEO_CONFIG);

      expect(injected).toContain('<title>Nicolas Oliveira | Software Engineer</title>');
      expect(injected).toContain('<meta property="og:type" content="website" />');
      expect(injected).toContain('<link rel="canonical" href="https://nicolasoliveira.dev/" />');
      expect(injected).toContain('"@type": "WebSite"');
      expect(injected).toContain('"@type": "Person"');
    });
  });

  describe('Utilitários de escape e normalização', () => {
    it('escapeXml e escapeAttr devem sanitizar strings adequadamente', () => {
      expect(escapeXml('A & B < C > D "test" \'quote\'')).toBe('A &amp; B &lt; C &gt; D &quot;test&quot; &apos;quote&apos;');
      expect(escapeAttr('Test "quotes" & <tags>')).toBe('Test &quot;quotes&quot; &amp; &lt;tags&gt;');
    });

    it('normalizeDate deve extrair ano-mês-dia de qualquer formato ou retornar data válida', () => {
      expect(normalizeDate('2021-07-09T00:00:00.000Z')).toBe('2021-07-09');
      expect(normalizeDate('2024-07-29')).toBe('2024-07-29');
    });
  });
});
