import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import Aboutme from '../../components/Aboutme';
import Carousel from '../../components/Carousel';
import { PortfolioContainer, BackButton } from './styles';

export default function Portfolio() {
  return (
    <PortfolioContainer>
      <BackButton to="/">
        <IoIosArrowBack aria-hidden="true" />
        <span>Início</span>
      </BackButton>
      <Aboutme />
      <Carousel />
    </PortfolioContainer>
  );
}
