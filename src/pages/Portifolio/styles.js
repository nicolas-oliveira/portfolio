import styled, { createGlobalStyle } from 'styled-components';

export const PortifolioContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  flex-wrap: wrap;
  min-height: 100vh;

  position: relative;

  h2 {
    font-size: 1.5em;
    text-transform: uppercase;
  }
`;

export const GroupCards = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 1em;
  gap: 10em;
`;
