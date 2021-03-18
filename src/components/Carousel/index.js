import React, { Component } from 'react';

import graphql from '../../services/graphql';
import { gql } from '@apollo/client';

import { CarouselContainer, GroupCards, Actions, ActionButton } from './styles';
import RepoCard from '../../components/RepoCard/index';

export default class Carousel extends Component {
  state = {
    repositories: [],
    requestIndex: 0,
  };

  incrementArray() {
    if (this.state.requestIndex < this.state.repositories.length - 1) {
      this.setState({
        requestIndex: this.state.requestIndex + 1,
      });
    }
  }

  decrementArray() {
    if (this.state.requestIndex > 0) {
      this.setState({
        requestIndex: this.state.requestIndex - 1,
      });
    }
  }

  async componentDidMount() {
    const repositories = localStorage.getItem('repositories');
    const requestIndex = localStorage.getItem('requestIndex');
    let dataRepositories = [];

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }

    await graphql
      .query({
        query: gql`
          {
            viewer {
              login
              repositories(
                first: 100
                isFork: false
                affiliations: OWNER
                orderBy: { field: CREATED_AT, direction: DESC }
              ) {
                edges {
                  node {
                    id
                    name
                    description
                    openGraphImageUrl
                  }
                }
              }
            }
          }
        `,
      })
      .then((result) => {
        dataRepositories = result.data.viewer.repositories.edges.filter(
          (repositoryToBeRemoved) =>
            repositoryToBeRemoved.node.name !== 'portfolio' &&
            repositoryToBeRemoved.node.name !== 'nicolas-oliveira'
        );

        this.setState({
          repositories: dataRepositories.map(({ node }) => ({
            key: node.id,
            nameOfRepository: node.name,
            description: node.description,
            openGraphImageUrl: node.openGraphImageUrl,
          })),
        });
      });

    if (requestIndex && requestIndex < dataRepositories.length) {
      this.setState({ requestIndex: JSON.parse(requestIndex) });
    } else {
      this.setState({ requestIndex: 0 });
    }
  }

  componentDidUpdate(e, prevState) {
    const { repositories, requestIndex } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }

    if (prevState.requestIndex !== requestIndex) {
      localStorage.setItem('requestIndex', JSON.stringify(requestIndex));
    }
  }

  render() {
    const previous = this.state.repositories[this.state.requestIndex - 1];
    const actual = this.state.repositories[this.state.requestIndex];
    const next = this.state.repositories[this.state.requestIndex + 1];

    const showCase = [previous || null, actual || null, next || null];

    return (
      <CarouselContainer>
        <Actions>
          {previous ? (
            <ActionButton onClick={() => this.decrementArray()}>
              &larr; Anterior
            </ActionButton>
          ) : (
            <ActionButton onClick={() => this.decrementArray()} disabled>
              &larr; Anterior
            </ActionButton>
          )}

          {next ? (
            <ActionButton onClick={() => this.incrementArray()}>
              Próximo &rarr;
            </ActionButton>
          ) : (
            <ActionButton onClick={() => this.incrementArray()} disabled>
              Próximo &rarr;
            </ActionButton>
          )}
        </Actions>

        <GroupCards>
          {showCase.map((repository) => {
            if (!repository) {
              return <RepoCard />;
            }
            return (
              <RepoCard
                key={repository.key}
                nameOfRepository={repository.nameOfRepository}
                description={repository.description}
                openGraphImageUrl={repository.openGraphImageUrl}
              />
            );
          })}
        </GroupCards>
      </CarouselContainer>
    );
  }
}
