import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia as monokai } from 'react-syntax-highlighter/dist/esm/styles/prism/index.js';
import 'github-markdown-css/github-markdown-dark.css';
import { IoIosArrowBack } from 'react-icons/io/index.js';
import { getArticleById } from '../../services/blog';
import { useSEO } from '../../hooks/useSEO';
import {
  PageContainer,
  NavHeader,
  BackButton,
  ArticleWrapper,
  ArticleHeader,
  MarkdownContainer,
  StatusScreen,
} from './styles';

export default function Post() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useSEO({
    title: article?.title,
    description: article?.excerpt,
    image: article?.coverImage,
    url: article ? `/post/${article.id}` : undefined,
    type: 'article',
    publishedTime: article?.rawDate,
    tags: article?.tags || [],
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        // Fallback para ambientes sem suporte a smooth scroll
      }
    }

    let isMounted = true;

    async function loadPost() {
      try {
        setLoading(true);
        setError(null);
        const data = await getArticleById(id);
        if (isMounted) {
          setArticle(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Artigo não encontrado no banco de dados.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadPost();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <NavHeader>
          <BackButton to="/">
            <IoIosArrowBack aria-hidden="true" />
            <span>Início</span>
          </BackButton>
        </NavHeader>
        <StatusScreen>
          <h2>&gt; ACESSANDO SERVIDOR...</h2>
          <p>Decodificando transmissão criptografada do log #{id}...</p>
        </StatusScreen>
      </PageContainer>
    );
  }

  if (error || !article) {
    return (
      <PageContainer>
        <NavHeader>
          <BackButton to="/">
            <IoIosArrowBack aria-hidden="true" />
            <span>Início</span>
          </BackButton>
        </NavHeader>
        <StatusScreen>
          <h2>&gt; ERRO 404: ARQUIVO CORROMPIDO</h2>
          <p>{error || 'A transmissão solicitada não foi encontrada ou foi apagada do banco.'}</p>
          <BackButton to="/">
            <IoIosArrowBack aria-hidden="true" />
            <span>Início</span>
          </BackButton>
        </StatusScreen>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <NavHeader>
        <BackButton to="/">
          <IoIosArrowBack aria-hidden="true" />
          <span>Início</span>
        </BackButton>
        <div className="terminal-status">// LOG ID: {article.id}</div>
      </NavHeader>

      <ArticleWrapper>
        <ArticleHeader>
          <div className="meta-info">
            <span className="date">{article.publishedAt}</span>
            <span>•</span>
            <span className="read-time">{article.readTime}</span>
            {article.tags?.length > 0 && (
              <>
                <span>•</span>
                <div className="tags">
                  {article.tags.map((tag, idx) => (
                    <span key={idx}>#{tag}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          <h1>{article.title}</h1>

          {article.excerpt && <p className="excerpt">{article.excerpt}</p>}

          {article.coverImage && (
            <div className="cover-container">
              <img src={article.coverImage} alt={article.title} />
            </div>
          )}
        </ArticleHeader>

        <MarkdownContainer className="markdown-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              pre(props) {
                return <>{props.children}</>;
              },
              code(props) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <SyntaxHighlighter
                    {...rest}
                    language={match[1]}
                    style={monokai}
                    PreTag="pre"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {article.content}
          </ReactMarkdown>
        </MarkdownContainer>
      </ArticleWrapper>
    </PageContainer>
  );
}
