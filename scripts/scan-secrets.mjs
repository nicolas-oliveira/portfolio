import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_ROOT = path.resolve(__dirname, '..');

const BINARY_EXTENSIONS = new Set([
  '.webp',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.ico',
  '.avif',
  '.bmp',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.otf',
  '.pdf',
  '.zip',
  '.gz',
  '.tar',
  '.mp4',
  '.mp3',
  '.webm',
]);

const SENSITIVE_ENV_NAME_PATTERN =
  /(TOKEN|SECRET|PAT|PASSWORD|PASSWD|PRIVATE_KEY|API_KEY|ACCESS_KEY|AUTH_KEY|CLIENT_SECRET|CREDENTIAL)/i;

const IGNORED_ENV_PREFIXES = [
  'npm_',
  'YARN_',
  'NODE_',
  'XDG_',
  'DBUS_',
  'GNOME_',
  'GTK_',
  'QT_',
  'SYSTEMD_',
  'SSH_AUTH_SOCK',
  'SSH_AGENT_PID',
  'GPG_',
  'VERCEL_GIT_',
  'VERCEL_URL',
  'VERCEL_BRANCH_URL',
  'VERCEL_PROJECT_PRODUCTION_URL',
  'VERCEL_ENV',
  'VERCEL_REGION',
  'SITE_URL',
  'VITE_SITE_URL',
  'GOOGLE_SITE_VERIFICATION',
  'COLORTERM',
  'TERM',
  'LS_COLORS',
];

const SECRET_SIGNATURES = [
  { id: 'github-pat-classic', regex: /\bgh[pousr]_[A-Za-z0-9]{36}\b/g },
  { id: 'github-pat-fine-grained', regex: /\bgithub_pat_[A-Za-z0-9_]{22,255}\b/g },
  { id: 'aws-access-key-id', regex: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g },
  { id: 'private-key-header', regex: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/g },
  { id: 'slack-token', regex: /\bxox[baprs]-[0-9A-Za-z-]{10,}\b/g },
  { id: 'stripe-live-key', regex: /\b(?:sk|rk)_live_[0-9a-zA-Z]{24,}\b/g },
  { id: 'google-api-key', regex: /\bAIza[0-9A-Za-z\-_]{35}\b/g },
  { id: 'openai-or-anthropic-key', regex: /\bsk-(?:proj-|ant-)[A-Za-z0-9_-]{20,}\b/g },
  { id: 'vercel-token', regex: /\bvercel_[A-Za-z0-9_]{24,}\b/g },
  {
    id: 'hardcoded-bearer-token',
    regex: /Authorization['"]?\s*[:=]\s*['"]Bearer\s+[A-Za-z0-9._\-]{20,}['"]/g,
  },
  {
    id: 'database-url-with-password',
    regex: /(?:mongodb(?:\+srv)?|postgres(?:ql)?|mysql|redis):\/\/[^:\s'"`]+:[^@\s'"`]{8,}@[^\s'"`]+/g,
  },
];

/**
 * Faz parse simples de arquivos .env (chave=valor) sem logar nenhum valor
 */
export function parseEnvFile(rawContent) {
  const entries = {};
  if (!rawContent) return entries;

  for (const line of rawContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;

    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (key && val) {
      entries[key] = val;
    }
  }
  return entries;
}

/**
 * Coleta variáveis sensíveis do .env local e do ambiente de build (process.env)
 * para detectar vazamentos literais (ou em Base64) no bundle compilado.
 */
export function collectEnvSecrets(rootDir = DEFAULT_ROOT, envObj = process.env) {
  const merged = {};

  for (const filename of ['.env', '.env.local', '.env.production', '.env.production.local']) {
    const fullPath = path.join(rootDir, filename);
    if (fs.existsSync(fullPath)) {
      Object.assign(merged, parseEnvFile(fs.readFileSync(fullPath, 'utf8')));
    }
  }

  for (const [key, val] of Object.entries(envObj || {})) {
    if (typeof val === 'string' && val.length > 0) {
      merged[key] = val;
    }
  }

  const secrets = [];
  for (const [name, value] of Object.entries(merged)) {
    if (!SENSITIVE_ENV_NAME_PATTERN.test(name)) continue;
    if (IGNORED_ENV_PREFIXES.some((prefix) => name.startsWith(prefix))) continue;
    if (value.length < 12) continue;

    secrets.push({ name, value });
  }

  return secrets;
}

/**
 * Calcula número da linha (1-based) a partir de um índice de caractere
 */
function lineNumberAt(content, index) {
  let line = 1;
  for (let i = 0; i < index; i++) {
    if (content.charCodeAt(i) === 10) line++;
  }
  return line;
}

/**
 * Audita o conteúdo de um arquivo compilado sem nunca incluir o valor do segredo no retorno
 */
export function scanContent(content, relativeFile, envSecrets = []) {
  const findings = [];
  if (!content) return findings;

  // 1. Checagem de vazamento literal e Base64 de variáveis de ambiente sensíveis
  for (const secret of envSecrets) {
    const idx = content.indexOf(secret.value);
    if (idx !== -1) {
      findings.push({
        ruleId: `env-leak:${secret.name}`,
        file: relativeFile,
        line: lineNumberAt(content, idx),
      });
    }

    if (secret.value.length >= 16) {
      const encoded = Buffer.from(secret.value, 'utf8').toString('base64');
      const b64Idx = content.indexOf(encoded);
      if (b64Idx !== -1) {
        findings.push({
          ruleId: `env-leak-base64:${secret.name}`,
          file: relativeFile,
          line: lineNumberAt(content, b64Idx),
        });
      }
    }
  }

  // 2. Checagem por assinatura conhecida de credenciais
  for (const sig of SECRET_SIGNATURES) {
    sig.regex.lastIndex = 0;
    let match;
    while ((match = sig.regex.exec(content)) !== null) {
      findings.push({
        ruleId: sig.id,
        file: relativeFile,
        line: lineNumberAt(content, match.index),
      });
      if (match.index === sig.regex.lastIndex) {
        sig.regex.lastIndex++;
      }
    }
  }

  return findings;
}

/**
 * Lista recursivamente arquivos de texto dentro de dist/
 */
function walkFiles(dirPath) {
  const results = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (!BINARY_EXTENSIONS.has(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

/**
 * Varre todo o diretório dist/ gerado pelo build
 */
export function scanDistDirectory({
  rootDir = DEFAULT_ROOT,
  distDir = path.resolve(rootDir, 'dist'),
  envObj = process.env,
} = {}) {
  if (!fs.existsSync(distDir)) {
    throw new Error(`Diretório de build não encontrado: ${distDir}`);
  }

  const envSecrets = collectEnvSecrets(rootDir, envObj);
  const files = walkFiles(distDir);
  if (files.length === 0) {
    throw new Error(`Diretório de build vazio (nenhum artefato encontrado para auditoria): ${distDir}`);
  }
  const findings = [];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativeFile = path.relative(rootDir, filePath).split(path.sep).join('/');
    findings.push(...scanContent(content, relativeFile, envSecrets));
  }

  return {
    passed: findings.length === 0,
    filesScanned: files.length,
    envSecretsChecked: envSecrets.length,
    findings,
  };
}

/**
 * Formata achados sanitizados sem jamais expor qualquer trecho do segredo
 */
export function formatRedactedFindings(findings) {
  return findings
    .map((f) => `  - [dist-bundle] regra: ${f.ruleId} | arquivo: ${f.file}:${f.line} | valor: [REDACTED]`)
    .join('\n');
}

// Execução via CLI
function main() {
  console.log('\n🔒 [Pós-Build] Executando Secret Scanner nos artefatos compilados (dist/)...');
  try {
    const result = scanDistDirectory();
    if (!result.passed) {
      console.error(
        `\n❌ [BLOQUEIO DE DEPLOY] Secret Scanner detectou ${result.findings.length} vazamento(s) em dist/:`
      );
      console.error(formatRedactedFindings(result.findings));
      console.error('\nDeploy bloqueado. Nenhum valor de credencial foi exposto nos logs.');
      process.exit(1);
    }
    console.log(
      `✅ [Pós-Build] Secret Scanner aprovado: ${result.filesScanned} arquivo(s) em dist/ auditados (${result.envSecretsChecked} segredo(s) de ambiente verificados), 0 vazamentos.`
    );
  } catch (err) {
    console.error(`\n❌ [Pós-Build] Falha no Secret Scanner: ${err.message}`);
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main();
}
