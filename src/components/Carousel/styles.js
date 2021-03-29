import styled from 'styled-components';

export const CarouselContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  position: relative;

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
  @media (max-width: 570px) {
    font-size: 8px;
  }
  @media (max-width: 425px) {
    font-size: 6px;
  }
  @media (max-width: 375px) {
    font-size: 5.7px;
  }
`;

export const GroupCards = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin-top: 4em;

  max-height: 28.4em;
  max-width: 28.4em;
`;

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;

  margin-bottom: 1em;

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

export const ActionButton = styled.h2.attrs((props) => ({
  disabled: props.disabled,
}))`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  white-space: nowrap;

  span {
    padding: 0 5px 0 5px;
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.3;
  }

  &:first-child {
    margin-right: calc(12vw);
  }

  @media (max-width: 728px) {
    all: unset;
    position: relative;
    align-self: center;
    z-index: 2;
    span {
      display: none;
    }
    .IoIosArrowBack {
      position: absolute;
      font-size: 100px;
      left: -2em !important;
      bottom: -2em !important;
      padding: 10px;
    }
    .IoIosArrowForward {
      position: absolute;
      font-size: 100px;
      left: 1em !important;
      bottom: -2em !important;
      padding: 10px;
    }
  }
  @media (max-width: 425px) {
    .IoIosArrowBack {
      left: -1.5em !important;
      bottom: -1.5em !important;
    }
    .IoIosArrowForward {
      left: 0.5em !important;
      bottom: -1.5em !important;
    }
  }
`;
