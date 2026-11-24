import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  parseFrontmatter,
  localMarkdownAdapter,
} from '../../src/services/blog/localMarkdownAdapter.js';
import { injectPostMeta } from '../../scripts/generate-seo.mjs';
import { generateFrontmatter } from '../../scripts/create-post.mjs';
import { SEO_CONFIG } from '../../src/config/seo.js';

const ROOT = process.cwd();
const POSTS_DIR = path.resolve(ROOT, 'src/content/posts');

/**
 * Remove blocos cercados por ``` para inspecionar apenas o texto Markdown fora de exemplos de código
 */
function stripCodeFences(markdown) {
  return markdown.replace(/```[\s\S]*?```/g, '');
}

describe('Auditoria de Integridade do Repositório (Conteúdo, Adapter, SEO & Configs)', () => {
  const postFiles = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort();

  it('CONTEÚDO: nenhum artigo deve conter links antigos do Hashnode (bruxo.hashnode.dev / cdn.hashnode.com)', () => {
    const violations = [];
    for (const file of postFiles) {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      if (/bruxo\.hashnode\.dev|cdn\.hashnode\.com/i.test(raw)) {
        violations.push(file);
      }
    }
    expect(violations, `Artigos com restos do Hashnode: ${violations.join(', ')}`).toEqual([]);
  });

  it('CONTEÚDO: nenhum artigo deve ter HTML bruto <img> ou <iframe> fora de blocos de código (react-markdown não renderiza)', () => {
    const violations = [];
    for (const file of postFiles) {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      const { content } = parseFrontmatter(raw);
      const prose = stripCodeFences(content);
      if (/<(?:img|iframe)\b/i.test(prose)) {
        violations.push(file);
      }
    }
    expect(violations, `Artigos com HTML bruto não renderizado: ${violations.join(', ')}`).toEqual([]);
  });

  it('CONTEÚDO: nenhum excerpt ou subtitle deve conter URLs cruas coladas no texto', () => {
    const violations = [];
    for (const file of postFiles) {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      const { data } = parseFrontmatter(raw);
      if (/https?:\/\//i.test(data.excerpt || '') || /https?:\/\//i.test(data.subtitle || '')) {
        violations.push(file);
      }
    }
    expect(violations, `Artigos com URL colada no excerpt/subtitle: ${violations.join(', ')}`).toEqual([]);
  });

  it('CONTEÚDO: todas as imagens locais (capa e corpo) referenciadas nos 20 artigos devem existir em public/', () => {
    const missing = [];
    for (const file of postFiles) {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      const { data, content } = parseFrontmatter(raw);
      const cover = data.coverImage || data.cover;
      if (!cover || !fs.existsSync(path.join(ROOT, 'public', cover))) {
        missing.push(`${file} -> cover:${cover}`);
      }
      const prose = stripCodeFences(content);
      for (const m of prose.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)) {
        const imgPath = m[1];
        if (imgPath.startsWith('/') && !fs.existsSync(path.join(ROOT, 'public', imgPath))) {
          missing.push(`${file} -> inline:${imgPath}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it('FRONTMATTER: parseFrontmatter deve fazer unescape de aspas escapadas (\\") geradas por create-post.mjs', () => {
    const generated = generateFrontmatter({
      title: 'Guia "Definitivo" de React',
      slug: 'guia-definitivo-de-react',
      brief: 'Entenda "hooks" sem mistério',
    });
    const { data } = parseFrontmatter(generated);
    expect(data.title).toBe('Guia "Definitivo" de React');
    expect(data.brief).toBe('Entenda "hooks" sem mistério');
  });

  it('ADAPTER: getArticleById NÃO deve vazar artigos fictícios do mockAdapter quando existem artigos reais', async () => {
    await expect(localMarkdownAdapter.getArticleById('como-funciona-o-v8')).rejects.toThrow(
      /não encontrado/i
    );
  });

  it('SEO SEGURANÇA: injectPostMeta deve escapar </script> dentro do JSON-LD para prevenir XSS', () => {
    const html = '<!DOCTYPE html><html><head><title>T</title></head><body></body></html>';
    const maliciousPost = {
      slug: 'teste-xss',
      title: 'Entendendo </script><script>alert(1)</script> em HTML',
      brief: 'Payload </script> no resumo',
      date: '2026-11-24',
      cover: '/images/posts/teste-xss/cover.webp',
      tags: ['Segurança'],
    };

    const output = injectPostMeta(html, maliciousPost, 'https://nicolasoliveira.dev', SEO_CONFIG);
    const ldScripts = [...output.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
    expect(ldScripts).toHaveLength(1);
    expect(ldScripts[0][1]).not.toMatch(/<\/script/i);
    expect(() => JSON.parse(ldScripts[0][1])).not.toThrow();
    expect(output).not.toContain('<script>alert(1)</script>');
  });

  it('MANIFEST: public/manifest.json não deve conter texto padrão "Create React App Sample"', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/manifest.json'), 'utf8'));
    expect(manifest.name).not.toMatch(/Create React App/i);
    expect(manifest.short_name).not.toMatch(/^React App$/i);
    expect(manifest.background_color).toBe('#1d1d1d');
  });

  it('VERCEL: vercel.json deve configurar headers HTTP essenciais de segurança', () => {
    const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
    expect(Array.isArray(vercel.headers)).toBe(true);
    const allHeaders = vercel.headers.flatMap((rule) => rule.headers || []);
    const keys = allHeaders.map((h) => h.key.toLowerCase());
    expect(keys).toContain('x-content-type-options');
    expect(keys).toContain('x-frame-options');
    expect(keys).toContain('referrer-policy');
  });
});
