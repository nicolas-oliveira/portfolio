import styled from 'styled-components';

export const CarouselContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100vw;
  position: relative;
  overflow: hidden;
  padding: 20px 0 60px 0;

  font-size: 16px;

  @media (max-width: 1024px) {
    font-size: 14px;
  }
  @media (max-width: 728px) {
    font-size: 13px;
  }
  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

export const GroupCards = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  position: relative;
  margin-top: 1em;
  width: 100%;
  max-width: 1000px;
  min-height: 30em;

  @media (max-width: 728px) {
    min-height: 26em;
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 32px;
  position: relative;
  margin-bottom: 1em;
  z-index: 10;

  user-select: none;

  .counter {
    font-size: 1.1em;
    color: #888;
    letter-spacing: 2px;
  }
`;

export const ActionButton = styled.button`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;

  background: rgba(39, 30, 30, 0.8);
  color: #fff;
  border: 1px solid rgba(245, 25, 25, 0.5);
  padding: 10px 20px;
  border-radius: 2px;
  cursor: pointer;
  white-space: nowrap;
  font-family: 'Cyber', sans-serif;
  font-size: 1em;
  text-transform: uppercase;
  letter-spacing: 1px;
  clip-path: polygon(0 0, 100% 0, 100% 80%, 90% 100%, 0 100%);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(245, 25, 25, 0.2);
    border-color: #f51919;
    box-shadow: 0 0 12px rgba(245, 25, 25, 0.5);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid #0df2f2;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.25;
    border-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 480px) {
    padding: 8px 14px;
    font-size: 0.9em;
  }
`;

export const StatusMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px;
  color: #aaa;
  text-align: center;

  button {
    color: hsl(0, 85%, 53%);
    text-decoration: underline;
    font-size: 1em;
  }
`;
