import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import {
  collectEnvSecrets,
  scanContent,
  scanDistDirectory,
  formatRedactedFindings as formatDistFindings,
} from '../../scripts/scan-secrets.mjs';
import {
  ensureGitleaksBinary,
  sanitizeGitleaksReport,
  formatRedactedFindings as formatGitleaksFindings,
  checkTrackedEnvFiles,
  runGitleaksAudit,
} from '../../scripts/run-gitleaks.mjs';

// Monta credenciais sintéticas apenas em memória para não disparar falso positivo no código-fonte dos testes
function buildSyntheticGithubPat() {
  return ['ghp', '_'].join('') + 'AbCdEf1234567890GhIjKlMnOpQrStUvWxYz';
}

function buildSyntheticAwsKey() {
  return ['AKIA', 'IOSFODNN7EXAMPLE'].join('');
}

function buildSyntheticPrivateKey() {
  return ['-----BEGIN RSA ', 'PRIVATE KEY-----\nMIIEpAIBAAKCAQEA'].join('');
}

describe('Secret Scanner Pós-Build (scripts/scan-secrets.mjs)', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-dist-scan-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('deve aprovar um diretório dist/ limpo sem credenciais', () => {
    const distDir = path.join(tempDir, 'dist');
    fs.mkdirSync(path.join(distDir, 'assets'), { recursive: true });
    fs.writeFileSync(path.join(distDir, 'index.html'), '<html><body>Portfolio</body></html>', 'utf8');
    fs.writeFileSync(path.join(distDir, 'assets', 'app.js'), 'console.log("hello world");', 'utf8');

    const result = scanDistDirectory({
      rootDir: tempDir,
      distDir,
      envObj: { GITHUB_TOKEN: 'super_secret_token_value_999999' },
    });

    expect(result.passed).toBe(true);
    expect(result.filesScanned).toBe(2);
    expect(result.findings).toHaveLength(0);
  });

  it('deve detectar vazamento literal e Base64 de variável de ambiente em dist/ sem expor o valor nos logs', () => {
    const secretVal = 'secret_portfolio_runtime_value_884422';
    const base64Val = Buffer.from(secretVal, 'utf8').toString('base64');

    const distDir = path.join(tempDir, 'dist');
    fs.mkdirSync(path.join(distDir, 'assets'), { recursive: true });
    fs.writeFileSync(
      path.join(distDir, 'assets', 'bundle.js'),
      `const a = "${secretVal}";\nconst b = "${base64Val}";\n`,
      'utf8'
    );

    const result = scanDistDirectory({
      rootDir: tempDir,
      distDir,
      envObj: { GITHUB_TOKEN: secretVal },
    });

    expect(result.passed).toBe(false);
    expect(result.findings.map((f) => f.ruleId)).toContain('env-leak:GITHUB_TOKEN');
    expect(result.findings.map((f) => f.ruleId)).toContain('env-leak-base64:GITHUB_TOKEN');

    const formatted = formatDistFindings(result.findings);
    expect(formatted).toContain('[REDACTED]');
    expect(formatted).not.toContain(secretVal);
    expect(formatted).not.toContain(base64Val);
    expect(JSON.stringify(result.findings)).not.toContain(secretVal);
  });

  it('deve detectar assinaturas conhecidas (GitHub PAT, AWS Key, Private Key) sem expor o valor', () => {
    const fakePat = buildSyntheticGithubPat();
    const fakeAws = buildSyntheticAwsKey();
    const fakePem = buildSyntheticPrivateKey();

    const content = `const t="${fakePat}";\nconst k="${fakeAws}";\nconst p=\`${fakePem}\`;\n`;
    const findings = scanContent(content, 'dist/assets/index.js', []);

    const rules = findings.map((f) => f.ruleId);
    expect(rules).toContain('github-pat-classic');
    expect(rules).toContain('aws-access-key-id');
    expect(rules).toContain('private-key-header');

    const formatted = formatDistFindings(findings);
    expect(formatted).not.toContain(fakePat);
    expect(formatted).not.toContain(fakeAws);
    expect(formatted).not.toContain('MIIEpAIBAAKCAQEA');
  });

  it('deve ignorar variáveis não sensíveis ou muito curtas em collectEnvSecrets()', () => {
    const secrets = collectEnvSecrets(tempDir, {
      NODE_ENV: 'production_long_name',
      VERCEL_GIT_COMMIT_SHA: '1234567890abcdef1234567890',
      SHORT_TOKEN: '12345',
      GITHUB_TOKEN: 'valid_long_secret_token_value',
    });

    expect(secrets.map((s) => s.name)).toEqual(['GITHUB_TOKEN']);
  });

  it('deve falhar de forma segura (fail-closed) se o diretório dist/ não existir ou estiver vazio', () => {
    expect(() =>
      scanDistDirectory({ rootDir: tempDir, distDir: path.join(tempDir, 'nao-existe'), envObj: {} })
    ).toThrow(/Diretório de build não encontrado/);

    const emptyDist = path.join(tempDir, 'empty-dist');
    fs.mkdirSync(emptyDist, { recursive: true });
    expect(() =>
      scanDistDirectory({ rootDir: tempDir, distDir: emptyDist, envObj: {} })
    ).toThrow(/Diretório de build vazio/);
  });

  it('deve bloquear via trava do vite.config.js se uma variável VITE_* sensível (ex: VITE_GITHUB_PAT) for definida no build', () => {
    const fakePat = buildSyntheticGithubPat();
    const res = spawnSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `import configFn from './vite.config.js';
         try {
           configFn({ mode: 'production' });
           process.exit(0);
         } catch (err) {
           console.error(err.message);
           process.exit(1);
         }`,
      ],
      {
        cwd: process.cwd(),
        env: { ...process.env, VITE_GITHUB_PAT: fakePat },
        stdio: 'pipe',
        encoding: 'utf8',
      }
    );

    expect(res.status).toBe(1);
    expect(res.stderr).toContain('VIOLAÇÃO DE SEGURANÇA');
    expect(res.stderr).toContain('VITE_GITHUB_PAT');
    expect(res.stderr).not.toContain(fakePat);
  }, 15000);

  it('NÃO deve barrar variáveis públicas do sistema da Vercel como VITE_VERCEL_GIT_COMMIT_AUTHOR_NAME', () => {
    const res = spawnSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `import configFn from './vite.config.js';
         configFn({ mode: 'production' });`,
      ],
      {
        cwd: process.cwd(),
        env: {
          ...process.env,
          VITE_VERCEL_GIT_COMMIT_AUTHOR_NAME: 'Nicolas Oliveira',
          VITE_VERCEL_GIT_COMMIT_AUTHOR_LOGIN: 'nicolas-oliveira',
          VITE_PUBLIC_PATH: '/assets',
        },
        stdio: 'pipe',
        encoding: 'utf8',
      }
    );

    expect(res.status, res.stderr).toBe(0);
  }, 15000);
});

describe('Regressão Vercel Env Vars (VITE_VERCEL_GIT_COMMIT_AUTHOR_NAME / _LOGIN)', () => {
  const vercelAuthorEnv = {
    VITE_VERCEL_GIT_COMMIT_AUTHOR_NAME: 'Nicolas Oliveira',
    VITE_VERCEL_GIT_COMMIT_AUTHOR_LOGIN: 'nicolas-oliveira',
    VERCEL_GIT_COMMIT_AUTHOR_NAME: 'Nicolas Oliveira',
    VERCEL_GIT_COMMIT_AUTHOR_LOGIN: 'nicolas-oliveira',
  };

  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-vercel-reg-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('vite.config.js deve permitir as variáveis de autor da Vercel e continuar bloqueando apenas segredos reais no mesmo ambiente', () => {
    const fakeSecret = buildSyntheticGithubPat();
    const res = spawnSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `import configFn from './vite.config.js';
         try {
           configFn({ mode: 'production' });
           process.exit(0);
         } catch (err) {
           console.error(err.message);
           process.exit(1);
         }`,
      ],
      {
        cwd: process.cwd(),
        env: {
          ...process.env,
          ...vercelAuthorEnv,
          VITE_API_AUTH: fakeSecret,
        },
        stdio: 'pipe',
        encoding: 'utf8',
      }
    );

    expect(res.status).toBe(1);
    expect(res.stderr).toContain('VITE_API_AUTH');
    expect(res.stderr).not.toContain('VITE_VERCEL_GIT_COMMIT_AUTHOR_NAME');
    expect(res.stderr).not.toContain('VITE_VERCEL_GIT_COMMIT_AUTHOR_LOGIN');
    expect(res.stderr).not.toContain(fakeSecret);
  }, 15000);

  it('scan-secrets.mjs não deve gerar falso positivo mesmo quando "Nicolas Oliveira" e "nicolas-oliveira" aparecem no dist/ junto das vars da Vercel', () => {
    const distDir = path.join(tempDir, 'dist');
    fs.mkdirSync(distDir, { recursive: true });
    fs.writeFileSync(
      path.join(distDir, 'index.html'),
      '<title>Nicolas Oliveira</title><a href="https://github.com/nicolas-oliveira">GitHub</a>',
      'utf8'
    );

    const collected = collectEnvSecrets(tempDir, {
      ...vercelAuthorEnv,
      GITHUB_TOKEN: 'real_backend_token_for_regression_check',
    });
    expect(collected.map((s) => s.name)).toEqual(['GITHUB_TOKEN']);

    const cleanResult = scanDistDirectory({
      rootDir: tempDir,
      distDir,
      envObj: {
        ...vercelAuthorEnv,
        GITHUB_TOKEN: 'real_backend_token_for_regression_check',
      },
    });
    expect(cleanResult.passed).toBe(true);
    expect(cleanResult.findings).toHaveLength(0);
  });

  it('scan-secrets.mjs deve continuar bloqueando vazamento real de GITHUB_TOKEN no dist/ mesmo com as vars da Vercel presentes', () => {
    const leakedToken = 'backend_token_leaked_under_vercel_env_999';
    const distDir = path.join(tempDir, 'dist');
    fs.mkdirSync(distDir, { recursive: true });
    fs.writeFileSync(
      path.join(distDir, 'bundle.js'),
      `const author="Nicolas Oliveira"; const user="nicolas-oliveira"; const bad="${leakedToken}";`,
      'utf8'
    );

    const result = scanDistDirectory({
      rootDir: tempDir,
      distDir,
      envObj: {
        ...vercelAuthorEnv,
        GITHUB_TOKEN: leakedToken,
      },
    });

    expect(result.passed).toBe(false);
    expect(result.findings.map((f) => f.ruleId)).toEqual(['env-leak:GITHUB_TOKEN']);
    expect(formatDistFindings(result.findings)).not.toContain(leakedToken);
  });

  it('NÃO deve abrir brecha ampla para VITE_VERCEL_*: VITE_VERCEL_API_TOKEN deve ser bloqueado no vite.config.js e no scan-secrets.mjs', () => {
    const fakeVercelToken = 'vercel_leaked_token_regression_123456';

    const viteRes = spawnSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `import configFn from './vite.config.js';
         try {
           configFn({ mode: 'production' });
           process.exit(0);
         } catch (err) {
           console.error(err.message);
           process.exit(1);
         }`,
      ],
      {
        cwd: process.cwd(),
        env: {
          ...process.env,
          ...vercelAuthorEnv,
          VITE_VERCEL_API_TOKEN: fakeVercelToken,
        },
        stdio: 'pipe',
        encoding: 'utf8',
      }
    );

    expect(viteRes.status).toBe(1);
    expect(viteRes.stderr).toContain('VITE_VERCEL_API_TOKEN');
    expect(viteRes.stderr).not.toContain('VITE_VERCEL_GIT_COMMIT_AUTHOR_NAME');
    expect(viteRes.stderr).not.toContain(fakeVercelToken);

    const distDir = path.join(tempDir, 'dist');
    fs.mkdirSync(distDir, { recursive: true });
    fs.writeFileSync(path.join(distDir, 'bundle.js'), `const x="${fakeVercelToken}";`, 'utf8');

    const distRes = scanDistDirectory({
      rootDir: tempDir,
      distDir,
      envObj: {
        ...vercelAuthorEnv,
        VITE_VERCEL_API_TOKEN: fakeVercelToken,
      },
    });
    expect(distRes.passed).toBe(false);
    expect(distRes.findings.map((f) => f.ruleId)).toContain('env-leak:VITE_VERCEL_API_TOKEN');
    expect(formatDistFindings(distRes.findings)).not.toContain(fakeVercelToken);
  }, 15000);
});

describe('Auditoria Gitleaks Pré-Build (scripts/run-gitleaks.mjs)', () => {
  let tempRepo;

  beforeEach(() => {
    tempRepo = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-gitleaks-test-'));
    execFileSync('git', ['init', '-q'], { cwd: tempRepo });
    execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: tempRepo });
    execFileSync('git', ['config', 'user.name', 'Test Runner'], { cwd: tempRepo });
  });

  afterEach(() => {
    fs.rmSync(tempRepo, { recursive: true, force: true });
  });

  it('deve sanitizar relatórios do Gitleaks removendo Secret, Match e Line', () => {
    const fakePat = buildSyntheticGithubPat();
    const sanitized = sanitizeGitleaksReport(
      [
        {
          RuleID: 'github-pat',
          File: 'src/api.js',
          StartLine: 7,
          Commit: '1234567890abcdef',
          Secret: fakePat,
          Match: `const token = "${fakePat}"`,
        },
      ],
      'git-history'
    );

    expect(sanitized).toEqual([
      {
        scope: 'git-history',
        ruleId: 'github-pat',
        file: 'src/api.js',
        line: 7,
        commit: '1234567',
      },
    ]);

    const formatted = formatGitleaksFindings(sanitized);
    expect(formatted).toContain('[REDACTED]');
    expect(formatted).not.toContain(fakePat);
  });

  it('deve aprovar repositório limpo (inclusive com .env local não rastreado)', async () => {
    const binPath = await ensureGitleaksBinary();
    const fakePat = buildSyntheticGithubPat();

    fs.writeFileSync(path.join(tempRepo, '.gitignore'), '.env\n', 'utf8');
    fs.writeFileSync(path.join(tempRepo, 'index.js'), 'export const ok = true;\n', 'utf8');
    execFileSync('git', ['add', '.gitignore', 'index.js'], { cwd: tempRepo });
    execFileSync('git', ['commit', '-q', '-m', 'init'], { cwd: tempRepo });

    // .env local ignorado pelo Git não deve quebrar o pré-build local
    fs.writeFileSync(path.join(tempRepo, '.env'), `GITHUB_TOKEN=${fakePat}\n`, 'utf8');

    const result = await runGitleaksAudit({ rootDir: tempRepo, binPath });
    expect(result.passed).toBe(true);
    expect(result.findings).toHaveLength(0);
  }, 30000);

  it('deve bloquear credencial em arquivo-fonte não commitado sem expor o valor', async () => {
    const binPath = await ensureGitleaksBinary();
    const fakePat = buildSyntheticGithubPat();

    fs.writeFileSync(path.join(tempRepo, 'index.js'), 'export const ok = true;\n', 'utf8');
    execFileSync('git', ['add', 'index.js'], { cwd: tempRepo });
    execFileSync('git', ['commit', '-q', '-m', 'init'], { cwd: tempRepo });

    fs.writeFileSync(path.join(tempRepo, 'leak.js'), `export const token = "${fakePat}";\n`, 'utf8');

    const result = await runGitleaksAudit({ rootDir: tempRepo, binPath });
    expect(result.passed).toBe(false);
    expect(result.findings.some((f) => f.scope === 'source-code' && f.file.includes('leak.js'))).toBe(true);

    const formatted = formatGitleaksFindings(result.findings);
    expect(formatted).not.toContain(fakePat);
    expect(JSON.stringify(result.findings)).not.toContain(fakePat);
  }, 30000);

  it('deve bloquear credencial enterrada no histórico Git mesmo após remoção do arquivo', async () => {
    const binPath = await ensureGitleaksBinary();
    const fakePat = buildSyntheticGithubPat();

    fs.writeFileSync(path.join(tempRepo, 'leaked.js'), `const k = "${fakePat}";\n`, 'utf8');
    execFileSync('git', ['add', 'leaked.js'], { cwd: tempRepo });
    execFileSync('git', ['commit', '-q', '-m', 'add secret'], { cwd: tempRepo });

    fs.rmSync(path.join(tempRepo, 'leaked.js'));
    execFileSync('git', ['add', '-A'], { cwd: tempRepo });
    execFileSync('git', ['commit', '-q', '-m', 'remove secret'], { cwd: tempRepo });

    const result = await runGitleaksAudit({ rootDir: tempRepo, binPath });
    expect(result.passed).toBe(false);
    expect(result.findings.some((f) => f.scope === 'git-history')).toBe(true);

    const formatted = formatGitleaksFindings(result.findings);
    expect(formatted).not.toContain(fakePat);
  }, 30000);

  it('deve bloquear se um arquivo .env real for adicionado ao rastreamento do Git', () => {
    fs.writeFileSync(path.join(tempRepo, '.env'), 'FOO=bar\n', 'utf8');
    execFileSync('git', ['add', '-f', '.env'], { cwd: tempRepo });

    const envFindings = checkTrackedEnvFiles(tempRepo);
    expect(envFindings).toHaveLength(1);
    expect(envFindings[0].ruleId).toBe('tracked-env-file');
  });
});
