import React, { useState, useEffect, useRef, useCallback } from 'react';
import BlogCard from '../BlogCard';
import { getArticles } from '../../services/blog';
import {
  SectionContainer,
  SectionHeader,
  GridContainer,
  Sentinel,
  StatusIndicator,
} from './styles';

export default function BlogGrid() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sentinelRef = useRef(null);
  const initialLoadDone = useRef(false);

  const loadArticles = useCallback(async (pageToLoad) => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const response = await getArticles({ page: pageToLoad, limit: 9 });
      setArticles((prev) =>
        pageToLoad === 1 ? response.items : [...prev, ...response.items]
      );
      setHasMore(response.hasMore);
      setPage(response.page);
    } catch (err) {
      console.error('Erro ao buscar artigos do blog:', err);
      setError('Falha na conexão com o terminal de artigos.');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Carregamento inicial (página 1)
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      loadArticles(1);
    }
  }, [loadArticles]);

  // Infinite Scroll via IntersectionObserver
  useEffect(() => {
    if (!hasMore || loading) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const currentSentinel = sentinelRef.current;
    if (!currentSentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          loadArticles(page + 1);
        }
      },
      {
        root: null,
        rootMargin: '250px',
        threshold: 0.1,
      }
    );

    observer.observe(currentSentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading, page, loadArticles]);

  return (
    <SectionContainer id="blog-section">
      <SectionHeader>
        <div className="terminal-tag">// TRANSMISSIONS & ARTICLES</div>
        <h2>LOGS DO SISTEMA_</h2>
        <p>Reflexões, arquitetura de software, compiladores e experiências no ciberespaço.</p>
      </SectionHeader>

      <GridContainer>
        {articles.map((article) => (
          <BlogCard key={article.id} article={article} />
        ))}
      </GridContainer>

      {loading && (
        <StatusIndicator>
          <span>&gt; CARREGANDO DADOS DO REPOSITÓRIO...</span>
        </StatusIndicator>
      )}

      {error && (
        <StatusIndicator style={{ color: '#f51919' }}>
          <span>&gt; [ERRO]: {error}</span>
        </StatusIndicator>
      )}

      {!hasMore && articles.length > 0 && (
        <StatusIndicator className="ended">
          <span>&gt; [FIM DAS TRANSMISSÕES DISPONÍVEIS]</span>
        </StatusIndicator>
      )}

      <Sentinel
        ref={sentinelRef}
        data-testid="infinite-scroll-sentinel"
        aria-hidden="true"
      />
    </SectionContainer>
  );
}
