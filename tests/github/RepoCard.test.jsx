import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import fs from 'fs';
import path from 'path';
import RepoCard from '../../src/components/RepoCard/index.jsx';
import { getGitHubRepositories } from '../../api/github.js';

function getEnvToken() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/^GITHUB_TOKEN=(.+)$/m);
    if (match) {
      return match[1].trim();
    }
  }
  return process.env.GITHUB_TOKEN || '';
}

describe('Componente RepoCard & Previews', () => {
  const token = getEnvToken();

  beforeEach(() => {
    localStorage.clear();
  });

  it('FRONTEND: se o card tiver imagem personalizada, o frontend DEVE mostrar a imagem personalizada (caso contrário o teste falha)', () => {
    const customImageUrl =
      'https://repository-images.githubusercontent.com/421193882/117ee5cc-6c3a-4b0f-883a-aaf6327d064c';

    const { container } = render(
      <RepoCard
        nameOfRepository="neural-network-dino-chrome"
        openGraphImageUrl={customImageUrl}
        usesCustomOpenGraphImage={true}
        description="Rede neural jogando o jogo do dinossauro do Chrome"
        htmlUrl="https://github.com/nicolas-oliveira/neural-network-dino-chrome"
      />
    );

    // O elemento de imagem DEVE existir no DOM
    const img = container.querySelector('img');
    expect(img, 'A tag <img> com a imagem personalizada DEVE ser renderizada no front-end').not.toBeNull();

    // A imagem DEVE apontar exatamente para o URL personalizado e ter data-preview-type="custom"
    expect(img?.getAttribute('src')).toBe(customImageUrl);
    expect(img?.getAttribute('data-preview-type')).toBe('custom');

    // Não deve renderizar o fallback de terminal quando a imagem personalizada existe
    const fallback = container.querySelector('.terminal-header');
    expect(fallback, 'O fallback não deve ser exibido quando há imagem personalizada').toBeNull();
  });

  it('FRONTEND: se não houver imagem personalizada (mesmo com URL padrão 200 do GitHub), exibe a caixa de terminal de fallback', () => {
    const defaultImageUrl =
      'https://opengraph.githubassets.com/9f40df85da455e03c2adc4438283d23187e40003110e05a1319ff834de1031d0/nicolas-oliveira/pesquisas-profundas';

    const { container } = render(
      <RepoCard
        nameOfRepository="pesquisas-profundas"
        openGraphImageUrl={defaultImageUrl}
        usesCustomOpenGraphImage={false}
        description="Repositório com pesquisas aprofundadas"
        htmlUrl="https://github.com/nicolas-oliveira/pesquisas-profundas"
      />
    );

    // Mesmo recebendo a URL padrão do GitHub, deve renderizar a caixa de terminal GITHUB_PREVIEW_SYS
    expect(container.querySelector('img')).toBeNull();
    const fallback = container.querySelector('.terminal-header');
    expect(fallback, 'A caixa de terminal de fallback DEVE ser renderizada').not.toBeNull();
    expect(container.querySelector('[data-preview-type="fallback"]')).not.toBeNull();
  });

  it('FRONTEND: se a imagem personalizada falhar ao carregar, troca para a caixa de terminal de fallback', () => {
    const customImageUrl =
      'https://repository-images.githubusercontent.com/421193882/broken-image';

    const { container } = render(
      <RepoCard
        nameOfRepository="repo-com-erro"
        openGraphImageUrl={customImageUrl}
        usesCustomOpenGraphImage={true}
        description="Teste de erro de carregamento"
        htmlUrl="https://github.com/nicolas-oliveira/repo-com-erro"
      />
    );

    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe(customImageUrl);

    fireEvent.error(img);

    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('.terminal-header')).not.toBeNull();
    expect(container.querySelector('[data-preview-type="fallback"]')).not.toBeNull();
  });

  it('INTEGRAÇÃO REAL: busca repositórios reais do GitHub e valida renderização de imagem personalizada vs fallback terminal', async () => {
    const repos = await getGitHubRepositories(token);
    expect(Array.isArray(repos)).toBe(true);
    expect(repos.length).toBeGreaterThan(0);

    // 1. Localiza um repositório real com imagem personalizada (ex: neural-network-dino-chrome)
    const customRepo = repos.find((r) => r.usesCustomOpenGraphImage);
    expect(customRepo, 'Deve existir ao menos 1 repositório com imagem personalizada no GitHub').toBeDefined();

    const { container: customContainer } = render(
      <RepoCard
        nameOfRepository={customRepo.name}
        openGraphImageUrl={customRepo.openGraphImageUrl}
        usesCustomOpenGraphImage={customRepo.usesCustomOpenGraphImage}
        description={customRepo.description}
        htmlUrl={customRepo.html_url}
      />
    );

    const customImg = customContainer.querySelector('img');
    expect(customImg, `O front-end deve exibir a imagem personalizada do repo ${customRepo.name}`).not.toBeNull();
    expect(customImg?.getAttribute('src')).toContain('repository-images.githubusercontent.com');
    expect(customImg?.getAttribute('data-preview-type')).toBe('custom');

    // 2. Localiza um repositório real sem imagem personalizada (ex: pesquisas-profundas)
    const defaultRepo = repos.find((r) => !r.usesCustomOpenGraphImage);
    expect(defaultRepo, 'Deve existir ao menos 1 repositório sem banner personalizado').toBeDefined();

    const { container: defaultContainer } = render(
      <RepoCard
        nameOfRepository={defaultRepo.name}
        openGraphImageUrl={defaultRepo.openGraphImageUrl}
        usesCustomOpenGraphImage={defaultRepo.usesCustomOpenGraphImage}
        description={defaultRepo.description}
        htmlUrl={defaultRepo.html_url}
      />
    );

    expect(defaultContainer.querySelector('img')).toBeNull();
    expect(
      defaultContainer.querySelector('.terminal-header'),
      `O front-end deve exibir a caixa de terminal de fallback no repo ${defaultRepo.name}`
    ).not.toBeNull();
    expect(defaultContainer.querySelector('[data-preview-type="fallback"]')).not.toBeNull();
  });
});
