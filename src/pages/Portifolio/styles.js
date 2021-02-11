import styled, { createGlobalStyle } from 'styled-components';

export const PortifolioContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  flex-wrap: wrap;
  min-height: 100vh;

  position: relative;
  overflow: hidden;

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
  }
  @media (max-width: 728px) {
    font-size: 9px;
  }
  @media (max-width: 425px) {
    font-size: 8px;
  }
`;

export const GroupCards = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 42%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  top: 11%;
  left: 50%;
  transform: translate(-50%, -50%);

  margin-bottom: 1em;

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  h2 {
    &:first-child {
      margin-right: calc(12vw);
    }
    cursor: pointer;
  }

  @media (max-width: 728px) {
    h2 {
      &:first-child {
        margin-right: calc(14vw);
      }
    }
  }
  @media (max-width: 425px) {
    h2 {
      &:first-child {
        margin-right: calc(16vw);
      }
    }
  }
`;

export const ActionButton = styled.h2.attrs((props) => ({
  disabled: props.disabled,
}))`
  &[disabled] {
    cursor: not-allowed;
    opacity: 0.3;
  }
`;
