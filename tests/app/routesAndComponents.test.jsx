import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CyberButton from '../../src/components/CyberButton/index.jsx';
import Header from '../../src/components/Header/index.jsx';
import GroupButtons from '../../src/components/GroupButtons/index.jsx';
import Aboutme from '../../src/components/Aboutme/index.jsx';
import Main from '../../src/pages/Main/index.jsx';

describe('Cobertura de Componentes Core (Header, CyberButton, GroupButtons, Aboutme & Main)', () => {
  it('CyberButton deve aplicar rel="noopener noreferrer" em links externos e renderizar rota interna com <Link>', () => {
    const { container } = render(
      <MemoryRouter>
        <CyberButton name="GITHUB_" href="https://github.com/nicolas-oliveira" />
        <CyberButton name="PORTFOLIO_" to="/portfolio" />
      </MemoryRouter>
    );

    const ext = container.querySelector('a[href="https://github.com/nicolas-oliveira"]');
    expect(ext).not.toBeNull();
    expect(ext?.getAttribute('target')).toBe('_blank');
    expect(ext?.getAttribute('rel')).toBe('noopener noreferrer');

    const internal = container.querySelector('a[href="/portfolio"]');
    expect(internal).not.toBeNull();
    expect(internal?.getAttribute('target')).toBeNull();
  });

  it('Header e GroupButtons devem renderizar identidade do autor e links sociais seguros', () => {
    const { container } = render(
      <MemoryRouter>
        <Header />
        <GroupButtons />
      </MemoryRouter>
    );

    expect(screen.getByText(/Nicolas Oliveira/i)).not.toBeNull();
    expect(container.querySelector('a[href="/portfolio"]')).not.toBeNull();
    expect(container.querySelector('a[href*="linkedin.com"]')?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('Aboutme deve renderizar bio e link externo seguro da UEMG', () => {
    const { container } = render(<Aboutme />);
    const uemgLink = container.querySelector('a[href*="uemg.br"]');
    expect(uemgLink).not.toBeNull();
    expect(uemgLink?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('Main deve renderizar a Home completa integrando Header, GroupButtons e BlogGrid', async () => {
    const { findAllByTestId } = render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );

    const cards = await findAllByTestId('blog-card');
    expect(cards.length).toBe(9);
  });
});
