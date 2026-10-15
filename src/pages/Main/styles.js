import styled from 'styled-components';

export const MainStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  overflow-x: hidden;
`;

export const RelativeChildrenStyle = styled.main`
  display: grid;
  align-items: center;
  justify-content: space-evenly;
  grid-template-columns: 3fr 1fr;
  width: 100%;
  max-width: 1280px;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 40px;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 40px;
    height: auto;
    min-height: 100vh;
    min-height: 100dvh;
    padding: 40px 20px;
  }
`;
