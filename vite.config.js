import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { getGitHubRepositories } from './api/github.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Trava de segurança contra vazamento de segredos no bundle público do cliente
  // Usa fronteiras de segmento (^|_)...(_|$) para não confundir AUTHOR com AUTH nem PATH com PAT,
  // sem abrir exceção ampla para VITE_VERCEL_* (garantindo bloqueio de VITE_VERCEL_API_TOKEN, etc.)
  const sensitiveVarPattern =
    /(^|_)(TOKEN|SECRET|KEY|PAT|PASSWORD|PASSWD|AUTH|CREDENTIAL|PRIVATE)(_|$)/i;
  const forbiddenVars = Object.keys(env).filter(
    (key) => key.startsWith('VITE_') && sensitiveVarPattern.test(key)
  );

  if (forbiddenVars.length > 0) {
    throw new Error(
      `[VIOLAÇÃO DE SEGURANÇA] Variáveis sensíveis encontradas com o prefixo VITE_: ${forbiddenVars.join(
        ', '
      )}. ` +
        `Variáveis VITE_* são compiladas em texto puro no bundle público do navegador! ` +
        `Remova o prefixo VITE_ (ex: utilize apenas GITHUB_TOKEN) para que o segredo fique restrito à Vercel e ao dev server proxy.`
    );
  }

  const githubToken = env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;

  const githubApiMiddleware = async (req, res) => {
    try {
      const repos = await getGitHubRepositories(githubToken);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(repos));
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Falha ao buscar repositórios' }));
    }
  };

  return {
    plugins: [
      react(),
      {
        name: 'local-api-github-middleware',
        configureServer(server) {
          server.middlewares.use('/api/github', githubApiMiddleware);
        },
        configurePreviewServer(server) {
          server.middlewares.use('/api/github', githubApiMiddleware);
        },
      },
    ],
    test: {
      environment: 'jsdom',
      globals: true,
    },
    server: {
      port: 3000,
      open: true,
    },
  };
});
