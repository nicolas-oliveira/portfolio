import React, { Component } from 'react';

import graphql from '../../services/graphql';
import api from '../../services/api';
import { gql } from '@apollo/client';

import {
  PortifolioContainer,
  GroupCards,
  Actions,
  ActionButton,
} from './styles';
import RepoCard from '../../components/RepoCard/index';

export default class Portifolio extends Component {
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

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }

    // const { data } = await api.get(
    //   '/users/nicolas-oliveira/repos?sort=created'
    // );

    await graphql
      .query({
        query: gql`
          {
            viewer {
              login
              repositories(
                first: 100
                isFork: false
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
        const dataRepositories = result.data.viewer.repositories.edges;

        this.setState({
          repositories: dataRepositories.map(({ node }) => {
            const { id, name, description, openGraphImageUrl } = node;

            return {
              id,
              nameOfRepository: name,
              description,
              openGraphImageUrl,
            };
          }),
          requestIndex: 0,
        });
      });

    // const dataRepository = data.map(({ name, description }) => {
    //   return { nameOfRepository: name, description };
    // });
  }

  componentDidUpdate(e, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  render() {
    const previous = this.state.repositories[this.state.requestIndex - 1];
    const actual = this.state.repositories[this.state.requestIndex];
    const next = this.state.repositories[this.state.requestIndex + 1];

    const showCase = [previous || null, actual || null, next || null];

    return (
      <PortifolioContainer>
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
          {showCase.map((repository, index) => {
            if (!repository) {
              return <RepoCard />;
            }
            return (
              <RepoCard
                key={repository.id}
                nameOfRepository={repository.nameOfRepository}
                description={repository.description}
                openGraphImageUrl={repository.openGraphImageUrl}
              />
            );
          })}
        </GroupCards>
      </PortifolioContainer>
    );
  }
}
