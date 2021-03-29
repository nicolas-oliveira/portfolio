import styled from 'styled-components';

export const MainStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: center;

  overflow-x: hidden;
`;

export const RelativeChildrenStyle = styled.div`
  display: grid;
  align-items: center;
  justify-content: space-evenly;
  grid-template-columns: 3fr 1fr;

  min-width: 1024px;
  height: 100vh;
  padding: 40px;

  @media (max-width: 1024px) {
    all: unset;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    overflow: hidden;
    padding: 40px 10px;
  }
`;
