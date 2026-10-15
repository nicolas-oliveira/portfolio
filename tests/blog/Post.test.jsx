import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Post from '../../src/pages/Post/index.jsx';

describe('Página do Post (/post/:id)', () => {
  it('deve carregar o post pelo ID, renderizar o markdown e os blocos de código', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/post/como-funciona-o-v8']}>
        <Routes>
          <Route path="/post/:id" element={<Post />} />
        </Routes>
      </MemoryRouter>
    );

    // Aguarda o carregamento do artigo
    await waitFor(() => {
      expect(screen.getAllByRole('heading', { level: 1 })[0]).not.toBeNull();
    });

    // Deve conter o wrapper do github-markdown-css
    const markdownWrapper = container.querySelector('.markdown-body');
    expect(markdownWrapper).not.toBeNull();

    // Deve conter blocos de código com destaque de sintaxe
    const codeBlock = container.querySelector('pre');
    expect(codeBlock).not.toBeNull();

    // Deve conter o botão de voltar para o Início
    const backButton = container.querySelector('a[href="/"]');
    expect(backButton).not.toBeNull();
  });
});
