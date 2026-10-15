import React from 'react';
import PropTypes from 'prop-types';
import {
  CardLink,
  BannerContainer,
  ContentContainer,
  RepeatedContainerGlitch,
} from './styles';

export default function BlogCard({ article, time = '4.1s' }) {
  if (!article) return null;

  const { id, title, excerpt, coverImage, readTime, tags } = article;

  const cardContent = (
    <>
      <BannerContainer>
        <img src={coverImage} alt={`Banner do artigo: ${title}`} loading="lazy" />
      </BannerContainer>

      <ContentContainer>
        <div>
          <h2>{title}</h2>
          <p>{excerpt}</p>
        </div>

        <div className="meta">
          <div className="tags">
            {tags?.slice(0, 2).map((tag, idx) => (
              <span key={idx}>#{tag}</span>
            ))}
          </div>
          <span className="read-time">{readTime}</span>
        </div>
      </ContentContainer>
    </>
  );

  return (
    <CardLink to={`/post/${id}`} data-testid="blog-card">
      {cardContent}

      <RepeatedContainerGlitch aria-hidden="true" data-glitch="true" time={time}>
        {cardContent}
      </RepeatedContainerGlitch>
    </CardLink>
  );
}

BlogCard.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string,
    coverImage: PropTypes.string,
    readTime: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  time: PropTypes.string,
};
