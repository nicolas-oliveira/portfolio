import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BlogGrid from '../../src/components/BlogGrid/index.jsx';

describe('Componente BlogGrid', () => {
  it('deve renderizar o grid responsivo com os primeiros 9 cards inicialmente', async () => {
    const { container } = render(
      <BrowserRouter>
        <BlogGrid />
      </BrowserRouter>
    );

    // Aguarda o carregamento inicial da primeira página
    await waitFor(() => {
      const cards = container.querySelectorAll('[data-testid="blog-card"]');
      expect(cards.length).toBe(9);
    });

    // Deve conter o elemento sentinela do infinite scroll
    const sentinel = container.querySelector('[data-testid="infinite-scroll-sentinel"]');
    expect(sentinel).not.toBeNull();
  });
});
