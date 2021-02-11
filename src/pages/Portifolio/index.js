import React, { Component } from 'react';

import api from '../../services/api';
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

    const { data } = await api.get(
      '/users/nicolas-oliveira/repos?sort=created'
    );

    const dataRepository = data.map(({ name, description }) => {
      return { name, description };
    });

    const { requestIndex } = this.state;

    this.setState({
      repositories: dataRepository,
      requestIndex: 0,
    });
  }

  render() {
    const { repositories, requestIndex } = this.state;

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
                key={index}
                name={repository.name}
                description={repository.description}
                cover={true}
              />
            );
          })}
        </GroupCards>
      </PortifolioContainer>
    );
  }
}
