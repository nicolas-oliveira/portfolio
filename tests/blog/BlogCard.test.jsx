import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BlogCard from '../../src/components/BlogCard/index.jsx';

const mockArticle = {
  id: 'como-funciona-o-v8',
  title: 'Como funciona o motor V8 do Node.js e Chrome',
  excerpt: 'Uma análise profunda dos compiladores Ignition e TurboFan.',
  coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
  publishedAt: '12 de Outubro, 2026',
  readTime: '6 min',
  tags: ['Node.js', 'V8', 'Compiladores'],
};

describe('Componente BlogCard', () => {
  it('deve renderizar título, descrição pequena e banner com link para /post/:id', () => {
    const { container } = render(
      <BrowserRouter>
        <BlogCard article={mockArticle} />
      </BrowserRouter>
    );

    // Título e descrição
    expect(screen.getAllByText(mockArticle.title)[0]).not.toBeNull();
    expect(screen.getAllByText(mockArticle.excerpt)[0]).not.toBeNull();

    // Link para a rota do post
    const link = container.querySelector('a');
    expect(link).not.toBeNull();
    expect(link?.getAttribute('href')).toBe(`/post/${mockArticle.id}`);

    // Banner
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('src')).toBe(mockArticle.coverImage);
  });

  it('deve conter a estrutura da animação de glitch no hover idêntica ao CyberButton', () => {
    const { container } = render(
      <BrowserRouter>
        <BlogCard article={mockArticle} />
      </BrowserRouter>
    );

    // Deve possuir o elemento de overlay de glitch para animação no hover
    const glitchElement = container.querySelector('[data-glitch]');
    expect(glitchElement).not.toBeNull();
  });
});
