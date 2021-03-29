import styled from 'styled-components';

export const CarouselContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  position: relative;
`;

export const GroupCards = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 42%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const ActionsContainer = styled.div`
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
`;

export const ActionButton = styled.h2.attrs((props) => ({
  disabled: props.disabled,
}))`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  padding: 20px;
  margin-bottom: 20px;

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
