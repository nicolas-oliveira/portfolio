import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

function getEnvToken() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/^GITHUB_TOKEN=(.+)$/m);
    if (match) {
      return match[1].trim();
    }
  }
  return process.env.GITHUB_TOKEN || '';
}

describe('GitHub Token & Bundle Security', () => {
  const token = getEnvToken();

  it('deve possuir um GITHUB_TOKEN configurado no .env para os testes', () => {
    expect(token).toBeDefined();
    expect(token.length).toBeGreaterThan(10);
  });

  it('SEGURANÇA: garante que o token do .env não possui prefixo VITE_ para não vazar no bundle', () => {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      expect(content).not.toMatch(/VITE_GITHUB_TOKEN/);
      expect(content).not.toMatch(/VITE_.*TOKEN/);
    }
  });
});
