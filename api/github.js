const USERNAME = 'nicolas-oliveira';

export async function getGitHubRepositories(token) {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'portfolio-app',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // 1. Se houver token, usa GraphQL para obter o openGraphImageUrl oficial com precisão
  if (token) {
    try {
      const graphqlQuery = {
        query: `
          query GetUserRepos($username: String!) {
            user(login: $username) {
              repositories(
                first: 100
                isFork: false
                affiliations: OWNER
                orderBy: { field: UPDATED_AT, direction: DESC }
              ) {
                nodes {
                  id
                  name
                  description
                  url
                  openGraphImageUrl
                  usesCustomOpenGraphImage
                  primaryLanguage {
                    name
                  }
                  stargazerCount
                }
              }
            }
          }
        `,
        variables: { username: USERNAME },
      };

      const gqlRes = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphqlQuery),
      });

      if (gqlRes.ok) {
        const gqlData = await gqlRes.json();
        const nodes = gqlData?.data?.user?.repositories?.nodes;
        if (Array.isArray(nodes)) {
          return nodes.map((node) => ({
            id: node.id,
            name: node.name,
            description: node.description || 'Projeto open source no GitHub.',
            html_url: node.url,
            language: node.primaryLanguage?.name || null,
            stargazers_count: node.stargazerCount || 0,
            openGraphImageUrl: node.openGraphImageUrl,
            usesCustomOpenGraphImage: Boolean(node.usesCustomOpenGraphImage),
          }));
        }
      }
    } catch (gqlErr) {
      console.warn('Falha na consulta GraphQL do GitHub, tentando REST:', gqlErr);
    }
  }

  // 2. Fallback via API REST
  const restRes = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`,
    { headers }
  );

  if (!restRes.ok) {
    throw new Error(`GitHub API error: ${restRes.status} ${restRes.statusText}`);
  }

  const restRepos = await restRes.json();

  return restRepos
    .filter((repo) => !repo.fork)
    .map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || 'Projeto open source no GitHub.',
      html_url: repo.html_url,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      openGraphImageUrl: `https://opengraph.githubassets.com/1/${repo.owner?.login || USERNAME}/${repo.name}`,
      usesCustomOpenGraphImage: false,
    }));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const token = process.env.GITHUB_TOKEN;

  try {
    const repos = await getGitHubRepositories(token);

    // Cache na CDN da Vercel por 1 hora
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400'
    );

    return res.status(200).json(repos);
  } catch (err) {
    console.error('Erro na Vercel Serverless Function /api/github:', err);
    return res.status(500).json({ error: err.message || 'Falha ao buscar repositórios' });
  }
}
