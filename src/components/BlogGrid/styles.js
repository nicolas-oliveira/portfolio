import styled, { keyframes } from 'styled-components';

const neonFlicker = keyframes`
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
    text-shadow:
      0 0 4px #fee715,
      0 0 10px #fee715,
      0 0 18px rgba(254, 231, 21, 0.6);
  }
  20%, 24%, 55% {
    text-shadow: none;
  }
`;

export const SectionContainer = styled.section`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 20px 80px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
`;

export const SectionHeader = styled.header`
  margin-bottom: 36px;
  border-left: 4px solid #f51919;
  padding-left: 18px;

  .terminal-tag {
    font-size: 0.85em;
    font-family: monospace;
    color: #fee715;
    letter-spacing: 2px;
    margin-bottom: 6px;
    text-transform: uppercase;
  }

  h2 {
    font-size: 2.2em;
    font-weight: 900;
    color: #fff;
    margin: 0 0 6px 0;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    animation: ${neonFlicker} 3s infinite alternate;
  }

  p {
    color: #888;
    font-size: 0.95em;
    margin: 0;
  }

  @media (max-width: 768px) {
    h2 {
      font-size: 1.6em;
    }
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const Sentinel = styled.div`
  width: 100%;
  height: 20px;
  margin-top: 20px;
  pointer-events: none;
`;

export const StatusIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
  font-family: monospace;
  font-size: 0.9em;
  letter-spacing: 2px;
  color: #fee715;

  &.ended {
    color: #555;
    border-top: 1px dashed rgba(255, 255, 255, 0.1);
    margin-top: 30px;
  }
`;
