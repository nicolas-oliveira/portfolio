/**
 * Configurações Centrais de SEO e Metadados do Portfólio
 */

const rawSiteUrl =
  (typeof process !== 'undefined' && process.env?.SITE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SITE_URL) ||
  'https://nicolasoliveira.dev';

// Garante que o siteUrl não termine com barra para evitar barras duplas
export const SITE_URL = rawSiteUrl.replace(/\/+$/, '');

export const SEO_CONFIG = {
  siteUrl: SITE_URL,
  siteName: 'Nicolas Oliveira',
  defaultTitle: 'Nicolas Oliveira | Software Engineer',
  titleTemplate: '%s | Nicolas Oliveira',
  defaultDescription:
    'Portfólio e blog de engenharia de software por Nicolas Oliveira. Artigos sobre React, Node.js, Docker, Arquitetura e Open Source.',
  defaultKeywords: [
    'Nicolas Oliveira',
    'Software Engineer',
    'Desenvolvedor Full Stack',
    'React',
    'Node.js',
    'Docker',
    'Linux',
    'JavaScript',
    'TypeScript',
    'Web Development',
    'Frontend',
    'Backend',
  ],
  defaultImage: `${SITE_URL}/images/posts/default-banner.webp`,
  fallbackAvatar: 'https://github.com/nicolas-oliveira.png',
  locale: 'pt_BR',
  twitterHandle: '@nicolasom',
  googleSiteVerification:
    (typeof process !== 'undefined' && process.env?.GOOGLE_SITE_VERIFICATION) || '',
  author: {
    name: 'Nicolas Oliveira',
    jobTitle: 'Software Engineer',
    url: SITE_URL,
    sameAs: [
      'https://github.com/nicolas-oliveira',
      'https://www.linkedin.com/in/nicolasom/',
    ],
    email: 'mailto:nicolas.oliveira.ug@gmail.com',
  },
};
