import { profileData } from '../data/profile.js';

const CACHE_KEY = 'portfolio_repositories_v6';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 horas de cache persistente

/**
 * Lê os repositórios em cache de forma síncrona para inicialização instantânea da UI
 */
export function getCachedRepositories() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.data)) return parsed.data;
  } catch (err) {
    console.warn('Erro ao ler cache do localStorage:', err);
  }
  return [];
}

/**
 * Pré-carrega imagens na memória do navegador para navegação instantânea sem atraso
 */
export function preloadImages(urls = []) {
  urls.filter(Boolean).forEach((url) => {
    try {
      const img = new Image();
      img.src = url;
    } catch {
      // Ignora silenciosamente se o navegador rejeitar
    }
  });
}

/**
 * Busca repositórios com estratégia Stale-While-Revalidate e cache primordial
 */
export async function fetchRepositories(forceRefresh = false) {
  const { githubUsername, ignoredRepositories } = profileData;

  let cachedData = [];
  let cacheTimestamp = 0;

  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        cachedData = parsed;
      } else if (parsed && Array.isArray(parsed.data)) {
        cachedData = parsed.data;
        cacheTimestamp = parsed.timestamp || 0;
      }
    }
  } catch (err) {
    console.warn('Erro ao ler cache do localStorage:', err);
  }

  const isCacheValid = cachedData.length > 0 && Date.now() - cacheTimestamp < CACHE_TTL_MS;

  // Se o cache existir e for recente (< 24h), retorna imediatamente sem gastar requisição de rede
  if (!forceRefresh && isCacheValid) {
    return cachedData;
  }

  const primaryUrl = '/api/github';
  const fallbackUrl = `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`;

  let repos = null;

  try {
    const res = await fetch(primaryUrl, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });
    if (res.ok) {
      repos = await res.json();
    }
  } catch (primaryErr) {
    console.warn('Endpoint /api/github indisponível, usando fallback público:', primaryErr);
  }

  // Fallback se a rota interna não respondeu com dados válidos
  if (!Array.isArray(repos) || repos.length === 0) {
    try {
      const fallbackRes = await fetch(fallbackUrl, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      });
      if (fallbackRes.ok) {
        repos = await fallbackRes.json();
      }
    } catch (fallbackErr) {
      console.error('Falha no fallback da API do GitHub:', fallbackErr);
    }
  }

  // Se obtivemos repositórios válidos
  if (Array.isArray(repos) && repos.length > 0) {
    const filtered = repos
      .filter((repo) => !repo.fork)
      .filter(
        (repo) =>
          !ignoredRepositories.includes(repo.name.toLowerCase())
      )
      .map((repo) => ({
        key: repo.id,
        nameOfRepository: repo.name,
        description: repo.description || 'Projeto open source no GitHub.',
        htmlUrl: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        usesCustomOpenGraphImage: Boolean(repo.usesCustomOpenGraphImage),
        openGraphImageUrl:
          repo.openGraphImageUrl ||
          `https://opengraph.githubassets.com/1/${repo.owner?.login || githubUsername}/${repo.name}`,
      }));

    if (filtered.length > 0) {
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            timestamp: Date.now(),
            data: filtered,
          })
        );
      } catch (err) {
        console.warn('Erro ao salvar no localStorage:', err);
      }
      return filtered;
    }
  }

  if (cachedData.length > 0) {
    return cachedData;
  }

  throw new Error('Não foi possível obter os repositórios do GitHub.');
}
