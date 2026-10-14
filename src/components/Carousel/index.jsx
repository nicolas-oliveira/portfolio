import React, { useState, useEffect, useCallback } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import RepoCard from '../RepoCard';
import {
  fetchRepositories,
  getCachedRepositories,
  preloadImages,
} from '../../services/github';
import {
  CarouselContainer,
  GroupCards,
  ActionsContainer,
  ActionButton,
  StatusMessage,
} from './styles';

export default function Carousel() {
  // Inicialização síncrona com dados do cache: ZERO delay de carregamento na montagem
  const [repositories, setRepositories] = useState(() => getCachedRepositories());
  const [requestIndex, setRequestIndex] = useState(() => {
    try {
      const saved = localStorage.getItem('requestIndex');
      if (saved !== null) {
        const parsed = Number(saved);
        return !isNaN(parsed) && parsed >= 0 ? parsed : 0;
      }
    } catch {
      // Ignora erro no localStorage
    }
    return 0;
  });

  // Somente exibe estado de loading se NENHUM dado existir no cache
  const [loading, setLoading] = useState(() => getCachedRepositories().length === 0);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    // Se já temos repositórios no cache, não exibimos tela de loading para não travar o usuário
    if (repositories.length === 0) {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await fetchRepositories();
      setRepositories(data);

      const savedIndex = localStorage.getItem('requestIndex');
      if (savedIndex !== null) {
        const parsed = Number(savedIndex);
        if (!isNaN(parsed) && parsed >= 0 && parsed < data.length) {
          setRequestIndex(parsed);
        }
      }
    } catch (err) {
      if (repositories.length === 0) {
        setError('Não foi possível carregar os repositórios no momento.');
      }
    } finally {
      setLoading(false);
    }
  }, [repositories.length]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Persiste o índice ativo no localStorage
  useEffect(() => {
    if (repositories.length > 0) {
      try {
        localStorage.setItem('requestIndex', String(requestIndex));
      } catch {
        // Ignora
      }
    }
  }, [requestIndex, repositories.length]);

  // PRÉ-CARREGAMENTO DE IMAGENS: 2 cards à frente e 2 cards atrás
  useEffect(() => {
    if (repositories.length === 0) return;

    // Carrega antecipadamente o card atual e 2 cards em cada direção
    const indicesToPreload = [
      requestIndex - 2,
      requestIndex - 1,
      requestIndex,
      requestIndex + 1,
      requestIndex + 2,
    ];

    const urlsToPreload = indicesToPreload
      .filter((idx) => idx >= 0 && idx < repositories.length)
      .map((idx) => repositories[idx]?.openGraphImageUrl)
      .filter(Boolean);

    preloadImages(urlsToPreload);
  }, [requestIndex, repositories]);

  const handleNext = useCallback(() => {
    setRequestIndex((prev) =>
      prev < repositories.length - 1 ? prev + 1 : prev
    );
  }, [repositories.length]);

  const handlePrev = useCallback(() => {
    setRequestIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // Navegação via teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  if (loading && repositories.length === 0) {
    return (
      <CarouselContainer>
        <StatusMessage>Carregando repositórios do GitHub...</StatusMessage>
      </CarouselContainer>
    );
  }

  if (error && repositories.length === 0) {
    return (
      <CarouselContainer>
        <StatusMessage>
          <p>{error}</p>
          <button type="button" onClick={loadData}>
            Tentar novamente
          </button>
        </StatusMessage>
      </CarouselContainer>
    );
  }

  const previous = requestIndex > 0 ? repositories[requestIndex - 1] : null;
  const current = repositories[requestIndex] || null;
  const next =
    requestIndex < repositories.length - 1
      ? repositories[requestIndex + 1]
      : null;

  const showCase = [
    { item: previous, slot: 'prev' },
    { item: current, slot: 'current' },
    { item: next, slot: 'next' },
  ];

  return (
    <CarouselContainer>
      <ActionsContainer>
        <ActionButton
          type="button"
          onClick={handlePrev}
          disabled={!previous}
          aria-label="Repositório anterior"
        >
          <IoIosArrowBack aria-hidden="true" />
          <span>Anterior</span>
        </ActionButton>

        <span className="counter" aria-live="polite">
          {repositories.length > 0 ? `${requestIndex + 1} / ${repositories.length}` : ''}
        </span>

        <ActionButton
          type="button"
          onClick={handleNext}
          disabled={!next}
          aria-label="Próximo repositório"
        >
          <span>Próximo</span>
          <IoIosArrowForward aria-hidden="true" />
        </ActionButton>
      </ActionsContainer>

      <GroupCards>
        {showCase.map(({ item, slot }) => {
          if (!item) {
            return <RepoCard key={`empty-${slot}`} />;
          }
          return (
            <RepoCard
              key={item.key}
              nameOfRepository={item.nameOfRepository}
              description={item.description}
              openGraphImageUrl={item.openGraphImageUrl}
              usesCustomOpenGraphImage={item.usesCustomOpenGraphImage}
              htmlUrl={item.htmlUrl}
              language={item.language}
              stars={item.stars}
            />
          );
        })}
      </GroupCards>
    </CarouselContainer>
  );
}
