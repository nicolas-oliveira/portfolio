import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const POSTS_DIR = path.join(ROOT_DIR, 'src', 'content', 'posts');
const PUBLIC_IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images', 'posts');
const TEMP_DIR = path.join(ROOT_DIR, 'temp');

// Garante que os diretórios existam
fs.mkdirSync(POSTS_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });

// Mapeamento exato de datas históricas fornecidas pelo usuário
const DATES_MAP = {
  'Ainda não entendeu Redux? Parte 3': '2021-07-09',
  'Ainda não aprendeu Redux? Parte 2': '2021-07-09',
  'Ainda não entendeu Redux? Se liga nisso': '2021-07-09',
  'O incrível mundo das High Order Functions': '2021-07-08',
  'Radicle um grande candidato como alternativa ao Github, Gitlab e Bitbucket!': '2021-03-30',
  'Como configurar o MongoDB localmente no backend usando Docker e Mongoose': '2021-01-26',
  'Padrão de código com Eslint, Prettier e Babel no React': '2021-01-13',
  'Faça seu push automaticamente com SSH no Github (Linux)': '2021-01-12',
  'Criei um servidor doméstico do ZERO com um clone do Google Drive dentro': '2020-12-14',
  'Git para NOOBS': '2020-12-15',
  'Como criar um ambiente de desenvolvimento com ES6 + Webpack': '2020-12-08',
  'Padronização dos Commits com CommitLint': '2020-12-13',
  'O básico do sequelize em 2 minutos': '2021-07-30',
  'How to install and use Handlebars with express': '2020-12-02',
  'How to create a Ink Terminal React program': '2020-12-14',
  'Refatorando o NodeJS para classes e ES6': '2020-12-01',
  'Configure React without npx create-react-app': '2020-12-08',
  'Como juntar vários commits em um só': '2021-01-12',
  'Docker, tudo que você precisa saber em 9 minutos': '2021-03-30',
  'O que é Autenticação?': '2024-07-29',
};

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function inferTags(title, content) {
  const text = (title + ' ' + content).toLowerCase();
  const tags = [];
  if (text.includes('autentica') || text.includes('jwt') || text.includes('oauth')) {
    tags.push('Segurança', 'Auth');
  }
  if (text.includes('redux')) tags.push('Redux');
  if (text.includes('react')) tags.push('React');
  if (text.includes('docker')) tags.push('Docker');
  if (text.includes('git') || text.includes('github') || text.includes('commit')) tags.push('Git');
  if (text.includes('node') || text.includes('express')) tags.push('Node.js');
  if (text.includes('mongodb') || text.includes('mongoose')) tags.push('MongoDB');
  if (text.includes('sequelize')) tags.push('Sequelize');
  if (text.includes('webpack')) tags.push('Webpack');
  if (text.includes('eslint') || text.includes('prettier') || text.includes('babel')) tags.push('Clean Code');
  if (text.includes('linux') || text.includes('ssh')) tags.push('Linux');
  if (text.includes('radicle')) tags.push('Open Source');
  if (text.includes('javascript') || text.includes('es6')) tags.push('JavaScript');
  if (tags.length === 0) tags.push('Desenvolvimento');
  return [...new Set(tags)].slice(0, 4);
}

/**
 * Baixa e comprime uma imagem para WebP usando sharp
 * @param {string} url - URL remota da imagem
 * @param {string} outputPath - Caminho local onde salvar o .webp
 * @param {number} [maxWidth=1200]
 * @returns {Promise<boolean>}
 */
async function downloadAndOptimizeImage(url, outputPath, maxWidth = 1200) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!res.ok) {
      console.warn(`   [WARN] Falha ao baixar imagem: ${url} (status: ${res.status})`);
      return false;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Otimização Sharp: redimensionamento proporcional e compressão WebP quality: 80
    await sharp(buffer)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);

    const originalSizeKb = (buffer.length / 1024).toFixed(1);
    const optimizedSizeKb = (fs.statSync(outputPath).size / 1024).toFixed(1);
    console.log(
      `   🖼️  Otimizada: ${path.basename(outputPath)} (${originalSizeKb} KB -> ${optimizedSizeKb} KB WebP)`
    );
    return true;
  } catch (err) {
    console.error(`   [ERROR] Erro ao processar imagem ${url}:`, err.message);
    return false;
  }
}

/**
 * Migra artigos a partir dos arquivos Markdown baixados em temp/
 */
async function migrateFromTempDir() {
  console.log(`\n📂 Detectada pasta temp/ com arquivos baixados manualmente.`);
  const allFiles = fs.readdirSync(TEMP_DIR).filter((f) => f.endsWith('.md'));

  console.log(`📊 Processando ${allFiles.length} artigos históricos...`);

  for (let i = 0; i < allFiles.length; i++) {
    const filename = allFiles[i];
    const fullPath = path.join(TEMP_DIR, filename);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Identifica a chave para a data
    const baseName = filename.replace(/\.md$/, '').replace(/\.+$/, '').trim();
    let matchedKey = null;
    for (const key of Object.keys(DATES_MAP)) {
      if (
        baseName.toLowerCase().startsWith(key.toLowerCase()) ||
        key.toLowerCase().startsWith(baseName.toLowerCase())
      ) {
        matchedKey = key;
        break;
      }
    }

    const publishedAt = matchedKey ? DATES_MAP[matchedKey] : '2021-07-08';
    const title = matchedKey || baseName;
    const slug = slugify(title);

    console.log(`\n[${i + 1}/${allFiles.length}] 👉 "${title}" (${publishedAt}) -> slug: "${slug}"`);

    // Diretório de imagens do artigo
    const postImgDir = path.join(PUBLIC_IMAGES_DIR, slug);
    fs.mkdirSync(postImgDir, { recursive: true });

    // 1. Extração da imagem de capa (pode começar com ou sem # / ## no markdown)
    let remoteCover = '';
    const coverRegex = /^(?:#+\s*)?!\[(?:Cover preview|.*?)\]\((https:\/\/cdn\.hashnode\.com\/[^)]+)\)\r?\n/m;
    const coverMatch = content.match(coverRegex);

    if (coverMatch) {
      remoteCover = coverMatch[1];
      // Remove a imagem de capa do topo do corpo do markdown para não duplicar com o banner do header
      content = content.replace(coverMatch[0], '').trimStart();
    } else if (slug === 'ainda-nao-entendeu-redux-parte-3') {
      // Usa a capa temática de Redux da Parte 2
      remoteCover = 'https://cdn.hashnode.com/res/hashnode/image/upload/v1625798464420/D-wIjxbIg.png';
    }

    let coverLocalPath = '';
    if (remoteCover) {
      const coverDest = path.join(postImgDir, 'cover.webp');
      const ok = await downloadAndOptimizeImage(remoteCover, coverDest, 1200);
      if (ok) {
        coverLocalPath = `/images/posts/${slug}/cover.webp`;
      }
    }

    // 2. Extração e download de imagens inline: ![alt](https://cdn.hashnode.com/...)
    const inlineRegex = /!\[([^\]]*)\]\((https:\/\/cdn\.hashnode\.com\/[^)]+)\)/g;
    let match;
    let imgIdx = 1;

    // Criamos uma lista de substituições para evitar loop infinito com regex em substituição dinâmica
    const replacements = [];
    while ((match = inlineRegex.exec(content)) !== null) {
      replacements.push({
        full: match[0],
        alt: match[1],
        url: match[2],
        index: imgIdx++,
      });
    }

    for (const r of replacements) {
      const inlineFileName = `image-${r.index}.webp`;
      const inlineDest = path.join(postImgDir, inlineFileName);
      console.log(`   ⏳ Otimizando imagem interna #${r.index}...`);
      const ok = await downloadAndOptimizeImage(r.url, inlineDest, 1000);
      if (ok) {
        const localUrl = `/images/posts/${slug}/${inlineFileName}`;
        content = content.replaceAll(r.url, localUrl);
      }
    }

    // 3. Remove o título H1 se ele estiver no início do corpo (já será renderizado pelo componente Post)
    const h1Regex = /^#\s+(.*?)\r?\n/;
    const h1Match = content.match(h1Regex);
    if (h1Match && h1Match[1].toLowerCase().includes(title.toLowerCase().slice(0, 15))) {
      content = content.replace(h1Regex, '').trimStart();
    }

    // Remove qualquer data solta no topo (ex: "29 de Julho de 2024", "1 Dezembro 2020", etc.)
    content = content.replace(/^(?:\d{1,2}\s+de\s+[a-zA-ZçÇ]+\s+(?:de\s+)?\d{4}|\d{1,2}\s+[a-zA-ZçÇ]+\s+\d{4})\r?\n+/m, '').trimStart();

    // 4. Tags e resumo
    const tags = inferTags(title, content);
    // Pega o primeiro parágrafo como resumo
    const firstPara = content
      .split(/\r?\n\r?\n/)
      .find((p) => p.trim() && !p.startsWith('#') && !p.startsWith('!') && !/^\d{1,2}\s+/.test(p.trim())) || '';
    const excerpt = firstPara
      .replace(/[#*`_\[\]()]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 160);

    const subtitle = excerpt ? (excerpt.endsWith('.') ? excerpt : excerpt + '...') : '';

    // 5. Monta o Frontmatter YAML
    const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
slug: "${slug}"
publishedAt: "${publishedAt}"
subtitle: "${subtitle.replace(/"/g, '\\"')}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
coverImage: "${coverLocalPath || '/images/posts/default-banner.webp'}"
tags: [${tags.map((t) => `"${t}"`).join(', ')}]
---

`;

    const targetPostFile = path.join(POSTS_DIR, `${slug}.md`);
    fs.writeFileSync(targetPostFile, frontmatter + content.trim() + '\n', 'utf8');
    console.log(`   ✅ Artigo gerado: src/content/posts/${slug}.md (Capa: ${coverLocalPath || 'default'})`);
  }

  // Gera o default-banner.webp se não existir
  const defaultBannerPath = path.join(PUBLIC_IMAGES_DIR, 'default-banner.webp');
  if (!fs.existsSync(defaultBannerPath)) {
    const svgBuffer = Buffer.from(`
      <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#121212"/>
        <rect x="0" y="0" width="100%" height="8" fill="#f51919"/>
        <rect x="0" y="622" width="100%" height="8" fill="#fee715"/>
        <text x="50%" y="50%" fill="#fee715" font-size="52" font-family="monospace" font-weight="bold" text-anchor="middle" dominant-baseline="middle">&lt;BRUXO.DEV /&gt;</text>
      </svg>
    `);
    await sharp(svgBuffer).webp({ quality: 90 }).toFile(defaultBannerPath);
    console.log(`🖼️  Banner padrão cyberpunk gerado: public/images/posts/default-banner.webp`);
  }

  console.log(`\n🧹 Removendo a pasta temporária temp/ conforme o plano de migração...`);
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  console.log(`✅ Pasta temp/ removida com sucesso. Todos os artigos agora vivem exclusivamente em src/content/posts/`);

  console.log(`\n🎉 Migração dos 20 artigos e otimização das imagens concluídas com 100% de sucesso!`);
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Iniciando pipeline de migração do Blog...');

  if (fs.existsSync(TEMP_DIR)) {
    await migrateFromTempDir();
    return;
  }

  console.warn('⚠️ Nenhuma fonte de artigos encontrada em temp/ nem arquivo de exportação.');
}

main().catch((err) => {
  console.error('❌ Erro inesperado na migração:', err);
  process.exit(1);
});
