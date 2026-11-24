import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_ROOT = path.resolve(__dirname, '..');

export const GITLEAKS_VERSION = '8.30.1';

const GITLEAKS_ASSETS = {
  'linux:x64': {
    filename: `gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz`,
    sha256: '551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb',
  },
  'linux:arm64': {
    filename: `gitleaks_${GITLEAKS_VERSION}_linux_arm64.tar.gz`,
    sha256: 'e4a487ee7ccd7d3a7f7ec08657610aa3606637dab924210b3aee62570fb4b080',
  },
  'darwin:arm64': {
    filename: `gitleaks_${GITLEAKS_VERSION}_darwin_arm64.tar.gz`,
    sha256: 'b40ab0ae55c505963e365f271a8d3846efbc170aa17f2607f13df610a9aeb6a5',
  },
  'darwin:x64': {
    filename: `gitleaks_${GITLEAKS_VERSION}_darwin_x64.tar.gz`,
    sha256: 'dfe101a4db2255fc85120ac7f3d25e4342c3c20cf749f2c20a18081af1952709',
  },
};

/**
 * Verifica se um binário executável do Gitleaks responde corretamente
 */
function isExecutableGitleaks(binPath) {
  try {
    const res = spawnSync(binPath, ['version'], {
      stdio: 'pipe',
      encoding: 'utf8',
    });
    return res.status === 0;
  } catch {
    return false;
  }
}

/**
 * Resolve o binário do Gitleaks (cache local, PATH ou download verificado por SHA-256)
 */
export async function ensureGitleaksBinary(rootDir = DEFAULT_ROOT) {
  if (process.env.GITLEAKS_BIN && isExecutableGitleaks(process.env.GITLEAKS_BIN)) {
    return process.env.GITLEAKS_BIN;
  }

  const cacheDir = path.resolve(rootDir, 'node_modules/.cache/gitleaks', `v${GITLEAKS_VERSION}`);
  const cachedBin = path.join(cacheDir, process.platform === 'win32' ? 'gitleaks.exe' : 'gitleaks');

  if (fs.existsSync(cachedBin) && isExecutableGitleaks(cachedBin)) {
    return cachedBin;
  }

  if (isExecutableGitleaks('gitleaks')) {
    return 'gitleaks';
  }

  const platformKey = `${process.platform}:${process.arch}`;
  const asset = GITLEAKS_ASSETS[platformKey];
  if (!asset) {
    throw new Error(
      `Plataforma não suportada para download automático do Gitleaks (${platformKey}). Instale o binário gitleaks manualmente no PATH.`
    );
  }

  const downloadUrl = `https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/${asset.filename}`;
  console.log(`🔒 [Gitleaks] Baixando binário oficial v${GITLEAKS_VERSION} (${platformKey})...`);

  const response = await fetch(downloadUrl, {
    headers: { 'User-Agent': 'portfolio-security-scanner' },
  });

  if (!response.ok) {
    throw new Error(`Falha ao baixar Gitleaks v${GITLEAKS_VERSION}: HTTP ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const actualSha256 = crypto.createHash('sha256').update(buffer).digest('hex');
  if (actualSha256 !== asset.sha256) {
    throw new Error(
      `[SEGURANÇA] Checksum SHA-256 do Gitleaks inválido! Esperado: ${asset.sha256}, recebido: ${actualSha256}`
    );
  }

  fs.mkdirSync(cacheDir, { recursive: true });
  const archivePath = path.join(cacheDir, asset.filename);
  fs.writeFileSync(archivePath, buffer);

  try {
    execFileSync('tar', ['-xzf', archivePath, '-C', cacheDir, 'gitleaks'], {
      stdio: 'pipe',
    });
    fs.chmodSync(cachedBin, 0o755);
  } finally {
    fs.rmSync(archivePath, { force: true });
  }

  if (!isExecutableGitleaks(cachedBin)) {
    throw new Error('Binário do Gitleaks extraído, mas falhou na verificação de execução.');
  }

  return cachedBin;
}

/**
 * Garante que nenhum arquivo .env com segredos esteja rastreado ou em stage no Git
 */
export function checkTrackedEnvFiles(rootDir = DEFAULT_ROOT) {
  if (!fs.existsSync(path.join(rootDir, '.git'))) {
    return [];
  }

  const res = spawnSync('git', ['ls-files'], {
    cwd: rootDir,
    stdio: 'pipe',
    encoding: 'utf8',
  });

  if (res.status !== 0) {
    return [];
  }

  const trackedFiles = res.stdout.split(/\r?\n/).filter(Boolean);
  const envPattern = /(^|\/)\.env(\.(?!example$|sample$|template$).+)?$/i;

  return trackedFiles
    .filter((file) => envPattern.test(file))
    .map((file) => ({
      scope: 'git-tracked-env',
      ruleId: 'tracked-env-file',
      file,
      line: 0,
      commit: null,
    }));
}

/**
 * Converte relatório JSON do Gitleaks em achados 100% sanitizados (sem Secret/Match/Line)
 */
export function sanitizeGitleaksReport(rawFindings, scope) {
  if (!Array.isArray(rawFindings)) return [];

  return rawFindings.map((item) => ({
    scope,
    ruleId: String(item.RuleID || 'unknown-rule'),
    file: String(item.File || 'unknown-file'),
    line: Number(item.StartLine || 0),
    commit: item.Commit ? String(item.Commit).slice(0, 7) : null,
  }));
}

/**
 * Formata achados sanitizados sem jamais expor valores de credenciais
 */
export function formatRedactedFindings(findings) {
  return findings
    .map((f) => {
      const loc = f.line > 0 ? `${f.file}:${f.line}` : f.file;
      const commitInfo = f.commit ? ` | commit: ${f.commit}` : '';
      return `  - [${f.scope}] regra: ${f.ruleId} | arquivo: ${loc}${commitInfo} | valor: [REDACTED]`;
    })
    .join('\n');
}

/**
 * Cria configuração temporária para auditoria do working tree (dir),
 * herdando o .gitleaks.toml do repositório e excluindo apenas diretórios
 * gerados e .env locais não rastreados.
 */
function buildDirConfigToml(rootDir) {
  const baseConfigPath = path.join(rootDir, '.gitleaks.toml');
  const baseContent = fs.existsSync(baseConfigPath)
    ? fs.readFileSync(baseConfigPath, 'utf8')
    : `title = "Portfolio Gitleaks Dir Scan"\n\n[extend]\nuseDefault = true\n`;

  return `${baseContent}

[[allowlists]]
description = "Exclui dependências, saída de build, metadados git e arquivos .env locais (auditados separadamente contra rastreamento no Git)"
paths = [
  '''^node_modules/''',
  '''^dist/''',
  '''^\\.git/''',
  '''^coverage/''',
  '''^\\.env$''',
  '''^\\.env\\.local$''',
  '''^\\.env\\.[^/]+\\.local$''',
]
`;
}

/**
 * Executa um comando do Gitleaks com redação total e coleta segura via arquivo JSON temporário
 */
function executeGitleaksScan(binPath, args, { cwd, scope }) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gitleaks-report-'));
  const reportPath = path.join(tmpDir, 'report.json');

  try {
    const fullArgs = [
      ...args,
      '--redact=100',
      '--no-banner',
      '--exit-code',
      '1',
      '--report-format',
      'json',
      '--report-path',
      reportPath,
    ];

    // stdio: 'pipe' impede qualquer saída bruta do Gitleaks de vazar nos logs
    const result = spawnSync(binPath, fullArgs, {
      cwd,
      stdio: 'pipe',
      encoding: 'utf8',
    });

    let findings = [];
    if (fs.existsSync(reportPath)) {
      const rawText = fs.readFileSync(reportPath, 'utf8').trim();
      if (rawText) {
        const parsed = JSON.parse(rawText);
        findings = sanitizeGitleaksReport(parsed, scope);
      }
    }

    if (result.status !== 0 && result.status !== 1) {
      throw new Error(
        `Gitleaks falhou inesperadamente (escopo: ${scope}, exit code: ${result.status ?? 'null'}).`
      );
    }

    if (result.status === 1 && findings.length === 0) {
      findings.push({
        scope,
        ruleId: 'gitleaks-violation',
        file: 'unknown',
        line: 0,
        commit: null,
      });
    }

    return findings;
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

/**
 * Executa a auditoria completa de pré-build (histórico Git + arquivos-fonte)
 */
export async function runGitleaksAudit({
  rootDir = DEFAULT_ROOT,
  scanGit = true,
  scanDir = true,
  binPath = null,
} = {}) {
  const gitleaksBin = binPath || (await ensureGitleaksBinary(rootDir));
  const findings = [];

  // 1. Verifica se algum .env real está rastreado no Git
  if (scanGit) {
    findings.push(...checkTrackedEnvFiles(rootDir));
  }

  // 2. Audita histórico Git (se o diretório .git existir)
  const hasGitDir = fs.existsSync(path.join(rootDir, '.git'));
  if (scanGit && hasGitDir) {
    const gitConfig = path.join(rootDir, '.gitleaks.toml');
    const gitArgs = ['git'];
    if (fs.existsSync(gitConfig)) {
      gitArgs.push('--config', gitConfig);
    }
    gitArgs.push('.');

    const gitFindings = executeGitleaksScan(gitleaksBin, gitArgs, {
      cwd: rootDir,
      scope: 'git-history',
    });
    findings.push(...gitFindings);
  } else if (scanGit && !hasGitDir) {
    console.warn('⚠️  [Gitleaks] Diretório .git não encontrado; prosseguindo com auditoria do código-fonte.');
  }

  // 3. Audita o código-fonte atual (arquivos rastreados, modificados e não rastreados)
  if (scanDir) {
    const tmpCfgDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gitleaks-cfg-'));
    const dirConfigPath = path.join(tmpCfgDir, 'dir.gitleaks.toml');
    try {
      fs.writeFileSync(dirConfigPath, buildDirConfigToml(rootDir), 'utf8');
      const dirFindings = executeGitleaksScan(
        gitleaksBin,
        ['dir', '--config', dirConfigPath, '.'],
        { cwd: rootDir, scope: 'source-code' }
      );
      findings.push(...dirFindings);
    } finally {
      fs.rmSync(tmpCfgDir, { recursive: true, force: true });
    }
  }

  return {
    passed: findings.length === 0,
    findings,
  };
}

// Execução via CLI
async function main() {
  console.log('\n🛡️  [Pré-Build] Executando auditoria Gitleaks (histórico Git + código-fonte)...');
  try {
    const result = await runGitleaksAudit();
    if (!result.passed) {
      console.error(
        `\n❌ [BLOQUEIO DE SEGURANÇA] Gitleaks detectou ${result.findings.length} possível(is) credencial(is):`
      );
      console.error(formatRedactedFindings(result.findings));
      console.error('\nDeploy bloqueado. Remova/rotacione as credenciais detectadas antes de compilar.');
      process.exit(1);
    }
    console.log('✅ [Pré-Build] Gitleaks concluído: nenhuma credencial encontrada no código-fonte nem no histórico Git.');
  } catch (err) {
    console.error(`\n❌ [Pré-Build] Falha na auditoria Gitleaks: ${err.message}`);
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main();
}
