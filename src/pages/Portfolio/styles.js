import styled from 'styled-components';

export const PortfolioContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h2 {
    font-size: 1.4em;
    margin-bottom: 10px;
  }
  font-size: 17px;

  @media (max-width: 1024px) {
    padding: 0 30px;
  }
`;
