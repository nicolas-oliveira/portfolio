import styled from 'styled-components';

export const MainStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: center;
`;

export const RelativeChildrenStyle = styled.div`
  display: grid;
  align-items: center;
  justify-content: space-evenly;
  grid-template-columns: 3fr 1fr;
  min-width: 1000px;
  height: 100vh;
  padding: 40px;

  @media (max-width: 1000px) {
    all: unset;
    box-sizing: border-box;
    padding: 40px;
    width: 468px;
    height: 100vh;
  }
`;
