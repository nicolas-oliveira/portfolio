import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { getGitHubRepositories } from './api/github.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Trava de segurança contra vazamento de segredos no bundle público do cliente
  const forbiddenVars = Object.keys(env).filter(
    (key) =>
      key.startsWith('VITE_') &&
      (key.includes('TOKEN') || key.includes('SECRET') || key.includes('KEY'))
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

  return {
    plugins: [
      react(),
      {
        name: 'local-api-github-middleware',
        configureServer(server) {
          server.middlewares.use('/api/github', async (req, res) => {
            try {
              const repos = await getGitHubRepositories(githubToken);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(repos));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
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
