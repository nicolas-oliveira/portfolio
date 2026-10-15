import { describe, it, expect, beforeEach } from 'vitest';
import { getCachedRepositories, fetchRepositories } from '../../src/services/github.js';

describe('GitHub Service & Cache', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('CACHE: deve persistir no localStorage e reutilizar sem chamadas de rede desnecessárias', async () => {
    const fakeData = [
      {
        key: 999,
        nameOfRepository: 'cached-custom-repo',
        description: 'Repo em cache',
        htmlUrl: 'https://github.com/nicolas-oliveira/cached-custom-repo',
        language: 'TypeScript',
        stars: 42,
        usesCustomOpenGraphImage: true,
        openGraphImageUrl: 'https://repository-images.githubusercontent.com/fake.png',
      },
    ];

    localStorage.setItem(
      'portfolio_repositories_v6',
      JSON.stringify({
        timestamp: Date.now(),
        data: fakeData,
      })
    );

    const sync = getCachedRepositories();
    expect(sync.length).toBe(1);
    expect(sync[0].nameOfRepository).toBe('cached-custom-repo');
    expect(sync[0].usesCustomOpenGraphImage).toBe(true);

    const result = await fetchRepositories(false);
    expect(result.length).toBe(1);
    expect(result[0].nameOfRepository).toBe('cached-custom-repo');
  });
});
