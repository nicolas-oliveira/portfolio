import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import handler, { getGitHubRepositories } from '../../api/github.js';
import { useSEO } from '../../src/hooks/useSEO.js';
import Carousel from '../../src/components/Carousel/index.jsx';
import BlogGrid from '../../src/components/BlogGrid/index.jsx';
import * as githubService from '../../src/services/github.js';
import * as blogService from '../../src/services/blog/index.js';

function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  return res;
}

describe('Auditoria de Edge Cases de Runtime (API, Hooks, Carousel & BlogGrid)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Vercel Serverless Function api/github.js', () => {
    it('deve retornar 405 para métodos diferentes de GET', async () => {
      const res = createMockRes();
      await handler({ method: 'POST' }, res);
      expect(res.statusCode).toBe(405);
    });

    it('deve retornar mensagem genérica no erro 500 sem vazar detalhes internos de err.message', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(
        new Error('ECONNREFUSED 10.0.0.1:443 internal-secret-endpoint')
      );
      const res = createMockRes();
      await handler({ method: 'GET' }, res);
      expect(res.statusCode).toBe(500);
      expect(res.body.error).not.toContain('internal-secret-endpoint');
      expect(res.body.error).not.toContain('ECONNREFUSED');
    });

    it('deve preservar o header Authorization no fallback REST quando GraphQL sofre erro 502 transitório', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce({ ok: false, status: 502, statusText: 'Bad Gateway' })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => [
            {
              id: 1,
              name: 'repo-a',
              fork: false,
              description: 'Desc',
              html_url: 'https://github.com/nicolas-oliveira/repo-a',
              language: 'JS',
              stargazers_count: 1,
              owner: { login: 'nicolas-oliveira' },
            },
          ],
        });

      const repos = await getGitHubRepositories('valid_token_123456');
      expect(repos).toHaveLength(1);
      // A segunda chamada (REST) deve manter Authorization pois o erro do GraphQL não foi 401/403
      expect(fetchSpy.mock.calls[1][1].headers.Authorization).toBe('Bearer valid_token_123456');
    });

    it('deve remover o header Authorization no fallback REST quando GraphQL retorna 401', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce({ ok: false, status: 401, statusText: 'Unauthorized' })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => [],
        });

      await getGitHubRepositories('revoked_token_123456');
      expect(fetchSpy.mock.calls[1][1].headers.Authorization).toBeUndefined();
    });
  });

  describe('Hook useSEO (restauração completa ao voltar para a Home)', () => {
    function PostSeoProbe({ title, description, url }) {
      useSEO({ title, description, url, type: 'article', tags: ['React'] });
      return <div>probe</div>;
    }

    it('deve restaurar meta description, og:type e canonical ao desmontar da página de Post', () => {
      document.head.innerHTML = `
        <title>Nicolas Oliveira | Software Engineer</title>
        <meta name="description" content="Home description" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Nicolas Oliveira | Software Engineer" />
        <link rel="canonical" href="https://nicolasoliveira.dev/" />
      `;

      const { unmount } = render(
        <PostSeoProbe
          title="Artigo X"
          description="Descrição do Artigo X"
          url="/post/artigo-x"
        />
      );

      expect(document.title).toContain('Artigo X');
      expect(document.head.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe('article');
      expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
        'https://nicolasoliveira.dev/post/artigo-x'
      );

      unmount();

      expect(document.title).toBe('Nicolas Oliveira | Software Engineer');
      expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
        'Home description'
      );
      expect(document.head.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe(
        'website'
      );
      expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
        'https://nicolasoliveira.dev/'
      );
    });
  });

  describe('Carousel (resiliência com localStorage corrompido / fora dos limites)', () => {
    it('deve corrigir requestIndex fora dos limites no localStorage em vez de travar em cards vazios', async () => {
      localStorage.setItem('requestIndex', '999');

      vi.spyOn(githubService, 'getCachedRepositories').mockReturnValue([]);
      vi.spyOn(githubService, 'fetchRepositories').mockResolvedValue([
        {
          key: '1',
          nameOfRepository: 'repo-um',
          description: 'Primeiro',
          htmlUrl: 'https://github.com/nicolas-oliveira/repo-um',
          language: 'JS',
          stars: 5,
          usesCustomOpenGraphImage: false,
          openGraphImageUrl: 'https://opengraph.githubassets.com/1/nicolas-oliveira/repo-um',
        },
        {
          key: '2',
          nameOfRepository: 'repo-dois',
          description: 'Segundo',
          htmlUrl: 'https://github.com/nicolas-oliveira/repo-dois',
          language: 'TS',
          stars: 10,
          usesCustomOpenGraphImage: false,
          openGraphImageUrl: 'https://opengraph.githubassets.com/1/nicolas-oliveira/repo-dois',
        },
      ]);

      const { container } = render(<Carousel />);

      await waitFor(() => {
        expect(container.textContent).toContain('repo-um');
        expect(container.textContent).toContain('1 / 2');
      });
    });
  });

  describe('BlogGrid (deduplicação sob disparos concorrentes)', () => {
    it('não deve renderizar cards duplicados se a paginação retornar IDs repetidos', async () => {
      const sampleArticle = {
        id: 'artigo-unico',
        title: 'Artigo Único',
        excerpt: 'Resumo',
        coverImage: '/images/posts/git-para-noobs/cover.webp',
        publishedAt: '15 de dezembro de 2020',
        readTime: '3 min',
        tags: ['Git'],
      };

      let observerCallback;
      globalThis.IntersectionObserver = class {
        constructor(cb) {
          observerCallback = cb;
        }
        observe() {}
        disconnect() {}
      };

      vi.spyOn(blogService, 'getArticles')
        .mockResolvedValueOnce({ items: [sampleArticle], hasMore: true, page: 1, total: 2 })
        .mockResolvedValueOnce({ items: [sampleArticle], hasMore: false, page: 2, total: 2 });

      const { findAllByTestId } = render(
        <BrowserRouter>
          <BlogGrid />
        </BrowserRouter>
      );

      const firstBatch = await findAllByTestId('blog-card');
      expect(firstBatch).toHaveLength(1);

      // Dispara paginação que retorna um ID já existente
      observerCallback([{ isIntersecting: true }]);

      await waitFor(() => {
        expect(blogService.getArticles).toHaveBeenCalledTimes(2);
      });

      const afterBatch = await findAllByTestId('blog-card');
      expect(afterBatch).toHaveLength(1);
    });
  });
});
