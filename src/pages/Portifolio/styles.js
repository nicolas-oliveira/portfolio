import styled from 'styled-components';

export const PortfolioContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin: 0 15%;
  margin-top: 3em;
  overflow-x: hidden;

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
    font-size: 11px;
    margin: 0 5%;
  }
  @media (max-width: 728px) {
    font-size: 9px;
    margin: 0 2%;
  }
  @media (max-width: 425px) {
    font-size: 8px;
    margin: 0;
  }
`;
