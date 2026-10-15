import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { slugify, generateFrontmatter, createNewPost } from '../../scripts/create-post.mjs';

describe('Utilitário de Criação de Post (create-post.mjs)', () => {
  describe('slugify()', () => {
    it('deve converter títulos com acentuação e pontuação para slugs URL-friendly', () => {
      expect(slugify('O incrível mundo das High Order Functions!')).toBe('o-incrivel-mundo-das-high-order-functions');
      expect(slugify('Ainda não entendeu Redux? Parte 3')).toBe('ainda-nao-entendeu-redux-parte-3');
      expect(slugify('Como configurar o MongoDB localmente no backend usando Docker e Mongoose')).toBe(
        'como-configurar-o-mongodb-localmente-no-backend-usando-docker-e-mongoose'
      );
    });

    it('deve remover caracteres especiais estranhos e espaços duplicados', () => {
      expect(slugify('   Título    com @#$% múltiplos   espaços!  ')).toBe('titulo-com-multiplos-espacos');
    });

    it('deve retornar string vazia para valores nulos ou vazios', () => {
      expect(slugify('')).toBe('');
      expect(slugify(null)).toBe('');
      expect(slugify(undefined)).toBe('');
    });
  });

  describe('generateFrontmatter()', () => {
    it('deve gerar o bloco YAML com as chaves esperadas', () => {
      const yaml = generateFrontmatter({
        title: 'Guia do Docker',
        slug: 'guia-do-docker',
        brief: 'Aprenda Docker rápido',
        tags: ['Docker', 'DevOps'],
        authorName: 'Nicolas Oliveira',
        dateAdded: '2026-10-15T12:00:00.000Z',
      });

      expect(yaml).toContain('title: "Guia do Docker"');
      expect(yaml).toContain('slug: "guia-do-docker"');
      expect(yaml).toContain('dateAdded: "2026-10-15T12:00:00.000Z"');
      expect(yaml).toContain('brief: "Aprenda Docker rápido"');
      expect(yaml).toContain('cover: "/images/posts/guia-do-docker/cover.webp"');
      expect(yaml).toContain('tags: ["Docker", "DevOps"]');
      expect(yaml).toContain('authorName: "Nicolas Oliveira"');
      expect(yaml).toContain('# Guia do Docker');
    });
  });

  describe('createNewPost() em ambiente de testes isolado', () => {
    let tempDir;

    beforeEach(() => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-test-'));
    });

    afterEach(() => {
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it('deve criar o arquivo .md e o diretório de imagens correspondente', () => {
      const result = createNewPost({
        title: 'Post de Teste Automatizado',
        brief: 'Resumo do post de teste',
        tags: ['Testes', 'NodeJS'],
        rootDir: tempDir,
      });

      expect(result.slug).toBe('post-de-teste-automatizado');
      expect(fs.existsSync(result.postFile)).toBe(true);
      expect(fs.existsSync(result.imagesDir)).toBe(true);

      const fileContent = fs.readFileSync(result.postFile, 'utf8');
      expect(fileContent).toContain('title: "Post de Teste Automatizado"');
      expect(fileContent).toContain('slug: "post-de-teste-automatizado"');
    });

    it('deve lançar erro se o post já existir', () => {
      createNewPost({
        title: 'Post Duplicado',
        rootDir: tempDir,
      });

      expect(() => {
        createNewPost({
          title: 'Post Duplicado',
          rootDir: tempDir,
        });
      }).toThrow(/já existe/);
    });

    it('deve lançar erro se o título estiver vazio', () => {
      expect(() => {
        createNewPost({ title: '', rootDir: tempDir });
      }).toThrow(/obrigatório/);
    });
  });
});
