import React, { Component } from 'react';
import { Container, Title, Cover } from './styles';
import { string, bool } from 'prop-types';

RepoCard.propTypes = {
  nameOfRepository: string,
  description: string,
  openGraphImageUrl: string,
};

export default function RepoCard({
  nameOfRepository,
  openGraphImageUrl,
  description,
}) {
  return (
    <Container>
      <Title>
        <div className="submask">
          <h1>{nameOfRepository}</h1>
        </div>
      </Title>
      <Cover>
        <div className="submask">
          {openGraphImageUrl ? <img src={openGraphImageUrl}></img> : null}
          <p>{description}</p>
        </div>
      </Cover>
    </Container>
  );
}
