import React from 'react';
import { Container, Title, Cover } from './styles';
import { string, bool } from 'prop-types';

RepoCard.propTypes = {
  name: string,
  description: string,
  cover: bool,
};

function RepoCard({ name, description, cover }) {
  return (
    <Container>
      <Title>
        <div className="submask">
          <h1>{name}</h1>
        </div>
      </Title>
      <Cover>
        <div className="submask">
          {cover ? <span>Cover</span> : null}
          <p>{description}</p>
        </div>
      </Cover>
    </Container>
  );
}

export default RepoCard;
