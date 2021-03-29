import React, { Component } from 'react';

import Aboutme from '../../components/Aboutme';
import Carousel from '../../components/Carousel';

import { PortfolioContainer } from './styles';

export default class Portfolio extends Component {
  render() {
    return (
      <PortfolioContainer>
        <Aboutme />
        <Carousel />
      </PortfolioContainer>
    );
  }
}
