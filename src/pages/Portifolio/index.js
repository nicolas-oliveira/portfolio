import React, { Component } from 'react';

import api from '../../services/api';
import {
  PortifolioContainer,
  GroupCards,
  Actions,
  AbsolutePositioning,
} from './styles';
import RepoCard from '../../components/RepoCard/index';

export default class Portifolio extends Component {
  state = {
    repositories: [],
    previousRepository: null,
    actualRepository: null,
    nextRepository: null,
    requestIndex: 0,
  };

  async componentDidMount() {
    const { data } = await api.get(
      '/users/nicolas-oliveira/repos?sort=created'
    );

    const dataRepository = data.map(({ name, description }) => {
      return { name, description };
    });

    this.setState({
      repositories: dataRepository,
      // previousRepository: dataRepository[2], // Temporario
      actualRepository: dataRepository[0],
      nextRepository: dataRepository[1],
    });
  }

  componentDidUpdate() {}

  render() {
    const { previousRepository, actualRepository, nextRepository } = this.state;

    const showCase = [previousRepository, actualRepository, nextRepository];
    showCase.map((el) => console.log(el));
    return (
      <PortifolioContainer>
        <Actions>
          <h2 className="prev">&larr; Anterior</h2>
          <h2 className="next">Próximo &rarr;</h2>
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
