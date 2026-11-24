import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Title,
  Cover,
  PreviewContainer,
  Skeleton,
  FallbackCyberBanner,
} from './styles';

export default function RepoCard({
  nameOfRepository,
  openGraphImageUrl,
  usesCustomOpenGraphImage,
  description,
  htmlUrl,
  language,
  stars,
}) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [openGraphImageUrl, usesCustomOpenGraphImage]);

  if (!nameOfRepository) {
    return (
      <Container as="div" aria-hidden="true">
        <Title>
          <div className="submask">
            <h1>...</h1>
          </div>
        </Title>
        <Cover>
          <div className="submask">
            <PreviewContainer>
              <Skeleton aria-hidden="true" />
            </PreviewContainer>
            <p>Carregando repositório...</p>
          </div>
        </Cover>
      </Container>
    );
  }

  const showCustomImage = Boolean(
    usesCustomOpenGraphImage && openGraphImageUrl && !imageError
  );
  const previewType = showCustomImage ? 'custom' : 'fallback';

  return (
    <Container
      href={htmlUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ver repositório ${nameOfRepository} no GitHub`}
    >
      <Title>
        <div className="submask">
          <h1>{nameOfRepository}</h1>
        </div>
      </Title>
      <Cover>
        <div className="submask">
          <PreviewContainer data-preview-type={previewType}>
            {showCustomImage ? (
              <img
                src={openGraphImageUrl}
                alt={`Social preview do repositório ${nameOfRepository}`}
                data-preview-type="custom"
                onError={() => setImageError(true)}
              />
            ) : (
              <FallbackCyberBanner aria-hidden="true" data-preview-type="fallback">
                <div className="terminal-header">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                  <span className="title">GITHUB_PREVIEW_SYS</span>
                </div>
                <div className="terminal-body">
                  <p className="prompt">&gt; git clone {nameOfRepository}</p>
                  <div className="repo-badge">{language || 'OPEN-SOURCE'}</div>
                </div>
              </FallbackCyberBanner>
            )}
          </PreviewContainer>

          <p>{description}</p>

          <div className="meta">
            {language && <span className="badge">[{language}]</span>}
            {stars > 0 && <span>★ {stars}</span>}
            <span className="cta">Acessar no GitHub ↗</span>
          </div>
        </div>
      </Cover>
    </Container>
  );
}

RepoCard.propTypes = {
  nameOfRepository: PropTypes.string,
  openGraphImageUrl: PropTypes.string,
  usesCustomOpenGraphImage: PropTypes.bool,
  description: PropTypes.string,
  htmlUrl: PropTypes.string,
  language: PropTypes.string,
  stars: PropTypes.number,
};
