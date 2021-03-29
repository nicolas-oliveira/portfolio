import styled from 'styled-components';

export const CarouselContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 100px;
  flex-wrap: wrap;
  position: relative;
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
`;
