import styled from 'styled-components';

export const PortfolioContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h2 {
    font-size: 1.5em;
    text-transform: uppercase;
  }
  font-size: 17px;

  @media (max-width: 2560px) {
    font-size: 17px;
  }
  @media (max-width: 1920px) {
    font-size: 14px;
  }
  @media (max-width: 1440px) {
    font-size: 12px;
  }
  @media (max-width: 1024px) {
    padding: 0 30px;
    font-size: 11px;
    overflow-x: hidden;
  }
  @media (max-width: 728px) {
    font-size: 8px;
  }
  @media (max-width: 425px) {
    font-size: 7px;
  }
`;
