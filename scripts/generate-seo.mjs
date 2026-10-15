import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEO_CONFIG, SITE_URL } from '../src/config/seo.js';
import { parseFrontmatter } from '../src/services/blog/localMarkdownAdapter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_ROOT = path.resolve(__dirname, '..');

/**
 * Escapa caracteres especiais para XML
 */
export function escapeXml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Escapa aspas para atributos HTML
 */
export function escapeAttr(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Normaliza data para formato ISO YYYY-MM-DD
 */
export function normalizeDate(dateStr) {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
  return d.toISOString().split('T')[0];
}

/**
 * Lê e analisa todos os posts da pasta src/content/posts
 */
export function getAllPosts(rootDir = DEFAULT_ROOT) {
  const postsDir = path.resolve(rootDir, 'src/content/posts');
  if (!fs.existsSync(postsDir)) {
    return [];
  }

  const files = fs.readdirSync(postsDir).filter((file) => file.endsWith('.md'));
  const posts = [];

  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const rawContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = parseFrontmatter(rawContent);

    const fileSlug = file.replace(/\.md$/, '');
    const slug = data.slug || data.id || fileSlug;
    const title = data.title || fileSlug;
    const brief = data.brief || data.excerpt || data.subtitle || (content.slice(0, 160).replace(/\r?\n/g, ' ') + '...');
    const rawDate = data.publishedAt || data.dateAdded || data.date || '';
    const date = normalizeDate(rawDate);
    const cover = data.cover || data.coverImage || `/images/posts/${slug}/cover.webp`;
    const tags = Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : ['Tecnologia']);

    posts.push({
      slug,
      title,
      brief,
      date,
      cover,
      tags,
    });
  }

  // Ordena pelos mais recentes
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

/**
 * Gera o conteúdo do sitemap.xml
 */
export function generateSitemapXml(posts, siteUrl = SITE_URL) {
  const cleanSiteUrl = siteUrl.replace(/\/+$/, '');

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  // Home
  xml += `  <url>\n`;
  xml += `    <loc>${cleanSiteUrl}/</loc>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;

  // Posts
  for (const post of posts) {
    const postUrl = `${cleanSiteUrl}/post/${post.slug}`;
    const imageUrl = post.cover.startsWith('http')
      ? post.cover
      : `${cleanSiteUrl}${post.cover.startsWith('/') ? '' : '/'}${post.cover}`;

    xml += `  <url>\n`;
    xml += `    <loc>${postUrl}</loc>\n`;
    xml += `    <lastmod>${post.date}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `    <image:image>\n`;
    xml += `      <image:loc>${escapeXml(imageUrl)}</image:loc>\n`;
    xml += `      <image:title>${escapeXml(post.title)}</image:title>\n`;
    xml += `    </image:image>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;
  return xml;
}

/**
 * Gera o conteúdo do robots.txt
 */
export function generateRobotsTxt(siteUrl = SITE_URL) {
  const cleanSiteUrl = siteUrl.replace(/\/+$/, '');
  return `# https://www.robotstxt.org/robotstxt.html\nUser-agent: *\nAllow: /\n\nSitemap: ${cleanSiteUrl}/sitemap.xml\n`;
}

/**
 * Remove metadados de SEO existentes para evitar tags duplicadas
 */
export function stripExistingSeoTags(htmlTemplate) {
  let clean = htmlTemplate;
  clean = clean.replace(/<!--[\s\S]*?-->/gi, '');
  clean = clean.replace(/<title>.*?<\/title>/gi, '');
  clean = clean.replace(/<meta\s+name=["']description["'][^>]*>/gi, '');
  clean = clean.replace(/<meta\s+name=["']keywords["'][^>]*>/gi, '');
  clean = clean.replace(/<meta\s+name=["']author["'][^>]*>/gi, '');
  clean = clean.replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '');
  clean = clean.replace(/<meta\s+property=["']og:[^"']*["'][^>]*>/gi, '');
  clean = clean.replace(/<meta\s+property=["']article:[^"']*["'][^>]*>/gi, '');
  clean = clean.replace(/<meta\s+name=["']twitter:[^"']*["'][^>]*>/gi, '');
  clean = clean.replace(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '');
  // Remove linhas em branco excessivas
  clean = clean.replace(/^\s*[\r\n]/gm, '');
  return clean;
}

/**
 * Injeta metadados Open Graph, Twitter Card e JSON-LD em uma página HTML de post
 */
export function injectPostMeta(htmlTemplate, post, siteUrl = SITE_URL, config = SEO_CONFIG) {
  const cleanSiteUrl = siteUrl.replace(/\/+$/, '');
  const canonicalUrl = `${cleanSiteUrl}/post/${post.slug}`;
  const imageUrl = post.cover.startsWith('http')
    ? post.cover
    : `${cleanSiteUrl}${post.cover.startsWith('/') ? '' : '/'}${post.cover}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${cleanSiteUrl}/#website`,
        url: cleanSiteUrl,
        name: config.siteName,
      },
      {
        '@type': 'Person',
        '@id': `${cleanSiteUrl}/#author`,
        name: config.author.name,
        jobTitle: config.author.jobTitle,
        url: config.author.url,
        sameAs: config.author.sameAs,
      },
      {
        '@type': 'BlogPosting',
        '@id': `${canonicalUrl}#article`,
        isPartOf: { '@id': `${cleanSiteUrl}/#website` },
        author: { '@id': `${cleanSiteUrl}/#author` },
        headline: post.title,
        description: post.brief,
        url: canonicalUrl,
        datePublished: post.date,
        dateModified: post.date,
        image: imageUrl,
        keywords: post.tags,
      },
    ],
  };

  const tagMetas = post.tags
    .map((tag) => `    <meta property="article:tag" content="${escapeAttr(tag)}" />`)
    .join('\n');

  const metaTags = `
    <!-- Metadados de SEO Injetados no Build para Crawlers & Social Previews -->
    <title>${escapeAttr(post.title)} | Nicolas Oliveira</title>
    <meta name="description" content="${escapeAttr(post.brief)}" />
    <meta name="author" content="${escapeAttr(config.author.name)}" />
    <meta name="keywords" content="${escapeAttr(post.tags.join(', '))}" />
    <link rel="canonical" href="${canonicalUrl}" />

    <!-- Open Graph / Facebook / LinkedIn / WhatsApp -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="${escapeAttr(config.siteName)}" />
    <meta property="og:title" content="${escapeAttr(post.title)}" />
    <meta property="og:description" content="${escapeAttr(post.brief)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${escapeAttr(imageUrl)}" />
    <meta property="og:image:alt" content="${escapeAttr(post.title)}" />
    <meta property="article:published_time" content="${post.date}" />
    <meta property="article:author" content="${escapeAttr(config.author.name)}" />
${tagMetas}

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="${config.twitterHandle}" />
    <meta name="twitter:creator" content="${config.twitterHandle}" />
    <meta name="twitter:title" content="${escapeAttr(post.title)}" />
    <meta name="twitter:description" content="${escapeAttr(post.brief)}" />
    <meta name="twitter:image" content="${escapeAttr(imageUrl)}" />

    <!-- JSON-LD Estruturado Schema.org -->
    <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
    </script>
`;

  const cleanHtml = stripExistingSeoTags(htmlTemplate);
  return cleanHtml.replace('</head>', `${metaTags}\n  </head>`);
}

/**
 * Injeta metadados Open Graph e JSON-LD da Home na página index.html
 */
export function injectHomeMeta(htmlTemplate, siteUrl = SITE_URL, config = SEO_CONFIG) {
  const cleanSiteUrl = siteUrl.replace(/\/+$/, '');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${cleanSiteUrl}/#website`,
        url: cleanSiteUrl,
        name: config.siteName,
        description: config.defaultDescription,
      },
      {
        '@type': 'Person',
        '@id': `${cleanSiteUrl}/#author`,
        name: config.author.name,
        jobTitle: config.author.jobTitle,
        url: config.author.url,
        sameAs: config.author.sameAs,
        image: config.fallbackAvatar,
      },
    ],
  };

  const verificationTag = config.googleSiteVerification
    ? `\n    <meta name="google-site-verification" content="${escapeAttr(config.googleSiteVerification)}" />`
    : '';

  const metaTags = `
    <!-- Metadados de SEO Centrais da Home -->
    <title>${escapeAttr(config.defaultTitle)}</title>
    <meta name="description" content="${escapeAttr(config.defaultDescription)}" />
    <meta name="keywords" content="${escapeAttr(config.defaultKeywords.join(', '))}" />
    <meta name="author" content="${escapeAttr(config.author.name)}" />
    <link rel="canonical" href="${cleanSiteUrl}/" />${verificationTag}

    <!-- Open Graph / LinkedIn / WhatsApp -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escapeAttr(config.siteName)}" />
    <meta property="og:title" content="${escapeAttr(config.defaultTitle)}" />
    <meta property="og:description" content="${escapeAttr(config.defaultDescription)}" />
    <meta property="og:url" content="${cleanSiteUrl}/" />
    <meta property="og:image" content="${escapeAttr(config.defaultImage)}" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="${config.twitterHandle}" />
    <meta name="twitter:creator" content="${config.twitterHandle}" />
    <meta name="twitter:title" content="${escapeAttr(config.defaultTitle)}" />
    <meta name="twitter:description" content="${escapeAttr(config.defaultDescription)}" />
    <meta name="twitter:image" content="${escapeAttr(config.defaultImage)}" />

    <!-- JSON-LD Estruturado Schema.org -->
    <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
    </script>
`;

  const cleanHtml = stripExistingSeoTags(htmlTemplate);
  return cleanHtml.replace('</head>', `${metaTags}\n  </head>`);
}

/**
 * Executa todo o processo de geração de SEO pós-build
 */
export function buildSeoAssets(rootDir = DEFAULT_ROOT) {
  console.log('\n🚀 Iniciando geração de SEO, Sitemap, Robots e Prerender estático...');

  const posts = getAllPosts(rootDir);
  console.log(`📚 Carregados ${posts.length} posts para indexação.`);

  // 1. Gera sitemap.xml
  const sitemapXml = generateSitemapXml(posts, SITE_URL);
  const distDir = path.resolve(rootDir, 'dist');
  const publicDir = path.resolve(rootDir, 'public');

  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
  }
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');
  }
  console.log('✅ sitemap.xml gerado com sucesso.');

  // 2. Gera robots.txt
  const robotsTxt = generateRobotsTxt(SITE_URL);
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');
  }
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');
  }
  console.log('✅ robots.txt gerado com sucesso.');

  // 3. Prerender de HTML com Meta Tags para cada artigo
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.warn('⚠️  dist/index.html não encontrado. Pulei o prerender estático.');
    return { postsCount: posts.length };
  }

  const rawIndexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  // Atualiza a própria home dist/index.html com os metadados ricos
  const homeInjectedHtml = injectHomeMeta(rawIndexHtml, SITE_URL, SEO_CONFIG);
  fs.writeFileSync(indexHtmlPath, homeInjectedHtml, 'utf8');
  console.log('✅ dist/index.html atualizado com Open Graph e JSON-LD da Home.');

  // Prerender para cada post
  let prerenderCount = 0;
  for (const post of posts) {
    const postHtml = injectPostMeta(rawIndexHtml, post, SITE_URL, SEO_CONFIG);

    // Salva em dist/post/<slug>/index.html
    const postDir = path.join(distDir, 'post', post.slug);
    fs.mkdirSync(postDir, { recursive: true });
    fs.writeFileSync(path.join(postDir, 'index.html'), postHtml, 'utf8');

    // E também em dist/post/<slug>.html para máxima compatibilidade com cleanUrls
    fs.writeFileSync(path.join(distDir, 'post', `${post.slug}.html`), postHtml, 'utf8');

    prerenderCount++;
  }

  console.log(`✅ Prerender de ${prerenderCount} páginas de artigos estáticos concluído com sucesso.`);
  return { postsCount: posts.length, prerenderCount };
}

// Executa se chamado diretamente
if (process.argv[1] && process.argv[1] === __filename) {
  try {
    buildSeoAssets();
  } catch (err) {
    console.error('❌ Falha na geração de SEO:', err);
    process.exit(1);
  }
}
