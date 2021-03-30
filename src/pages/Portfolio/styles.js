import styled from 'styled-components';

export const PortfolioContainer = styled.div`
  --primary-color-red: hsl(0, 85%, calc(53 * 1%));

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h2 {
    text-transform: uppercase;
  }

  h3 {
    font-size: 1.5em;
    margin-bottom: 10px;
    text-transform: uppercase;
  }

  font-size: 17px;

  @media (max-width: 1024px) {
    padding: 0 30px;
  }
`;
