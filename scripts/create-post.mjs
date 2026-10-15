import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_ROOT = path.resolve(__dirname, '..');

/**
 * Converte um título em slug seguro para URL
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFD') // Separa caracteres de acentos
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres inválidos
    .replace(/\s+/g, '-') // Espaços viram hífens
    .replace(/-+/g, '-') // Remove múltiplos hífens
    .replace(/^-+|-+$/g, ''); // Remove hífens no início e fim
}

/**
 * Monta o cabeçalho frontmatter YAML do post
 */
export function generateFrontmatter({
  title,
  slug,
  brief = '',
  tags = ['Desenvolvimento', 'Tecnologia'],
  readTime = '5 min',
  authorName = 'Nicolas',
  dateAdded = new Date().toISOString(),
}) {
  const formattedTags = Array.isArray(tags)
    ? `[${tags.map((t) => `"${t.trim()}"`).join(', ')}]`
    : `["${tags}"]`;

  return `---
title: "${title.replace(/"/g, '\\"')}"
slug: "${slug}"
dateAdded: "${dateAdded}"
brief: "${brief.replace(/"/g, '\\"') || 'Breve resumo do artigo para os cards de prévia e motores de busca.'}"
cover: "/images/posts/${slug}/cover.webp"
tags: ${formattedTags}
readTime: "${readTime}"
authorName: "${authorName}"
---

# ${title}

Escreva seu artigo aqui em formato Markdown...

## Introdução

Conteúdo inicial...

`;
}

/**
 * Cria a estrutura de um novo post (arquivo .md e pasta de imagens)
 */
export function createNewPost({
  title,
  brief = '',
  tags = ['Desenvolvimento', 'Tecnologia'],
  rootDir = DEFAULT_ROOT,
  dateAdded = new Date().toISOString(),
}) {
  if (!title || !title.trim()) {
    throw new Error('O título do artigo é obrigatório.');
  }

  const cleanTitle = title.trim();
  const slug = slugify(cleanTitle);

  if (!slug) {
    throw new Error('Não foi possível gerar um slug válido a partir do título.');
  }

  const postsDir = path.resolve(rootDir, 'src/content/posts');
  const imagesDir = path.resolve(rootDir, 'public/images/posts', slug);
  const postFile = path.resolve(postsDir, `${slug}.md`);

  // Garante que os diretórios existam
  fs.mkdirSync(postsDir, { recursive: true });
  fs.mkdirSync(imagesDir, { recursive: true });

  if (fs.existsSync(postFile)) {
    throw new Error(`O arquivo de post "${postFile}" já existe.`);
  }

  const content = generateFrontmatter({
    title: cleanTitle,
    slug,
    brief,
    tags,
    dateAdded,
  });

  fs.writeFileSync(postFile, content, 'utf8');

  // Adiciona um placeholder na pasta de imagens se não houver cover.webp
  const coverFile = path.resolve(imagesDir, 'cover.webp');
  if (!fs.existsSync(coverFile)) {
    // Se existir uma imagem padrão no projeto, copia como template inicial
    const defaultBanner = path.resolve(rootDir, 'public/images/posts/default-banner.webp');
    if (fs.existsSync(defaultBanner)) {
      fs.copyFileSync(defaultBanner, coverFile);
    } else {
      // Cria um .gitkeep para garantir que a pasta seja versionada no Git
      fs.writeFileSync(path.resolve(imagesDir, '.gitkeep'), '', 'utf8');
    }
  }

  return {
    slug,
    postFile,
    imagesDir,
  };
}

// Execução interativa ou direta por linha de comando
async function runCli() {
  const argTitle = process.argv.slice(2).join(' ').trim();

  if (argTitle) {
    try {
      const result = createNewPost({ title: argTitle });
      console.log(`\n✅ Post criado com sucesso!`);
      console.log(`📄 Arquivo Markdown: ${result.postFile}`);
      console.log(`🖼️  Pasta de Imagens:  ${result.imagesDir}`);
      console.log(`\n💡 Dica: Adicione sua imagem de capa em: ${result.imagesDir}/cover.webp`);
    } catch (err) {
      console.error(`❌ Erro ao criar post: ${err.message}`);
      process.exit(1);
    }
    return;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query) => new Promise((resolve) => rl.question(query, resolve));

  try {
    console.log('\n📝 === Criar Novo Artigo para o Blog ===\n');
    const title = await question('Título do artigo: ');
    if (!title.trim()) {
      console.log('Operação cancelada: título não informado.');
      rl.close();
      return;
    }

    const brief = await question('Resumo breve (opcional): ');
    const tagsInput = await question('Tags separadas por vírgula (ex: React, Node, Web): ');
    const tags = tagsInput
      ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
      : ['Desenvolvimento', 'Tecnologia'];

    const result = createNewPost({ title, brief, tags });
    console.log(`\n✅ Post criado com sucesso!`);
    console.log(`📄 Arquivo Markdown: ${result.postFile}`);
    console.log(`🖼️  Pasta de Imagens:  ${result.imagesDir}`);
    console.log(`\n💡 Dica: Adicione sua imagem de capa em: ${result.imagesDir}/cover.webp`);
  } catch (err) {
    console.error(`❌ Erro: ${err.message}`);
  } finally {
    rl.close();
  }
}

// Executa se chamado diretamente
if (process.argv[1] && process.argv[1] === __filename) {
  runCli();
}
