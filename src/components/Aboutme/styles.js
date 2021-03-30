import styled from 'styled-components';

window.addEventListener('resize', () => {
  document
    .querySelector(':root')
    .style.setProperty('--vh', window.innerHeight / 100 + 'px');
});

export const AboutText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-size: 22px;
  max-width: 728px;

  min-height: -webkit-fill-available !important;
  min-height: calc(100 * var(--vh)) !important;

  margin-top: 10px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
  @media (max-width: 425px) {
    font-size: 17px;
  }
  @media (max-width: 425px) {
    font-size: 17px;
  }
  @media (max-width: 375px) {
    font-size: 16px;
  }
`;
export const TextSelf = styled.div`
  h1 {
    margin-bottom: 0.2em;
  }

  p {
    margin-bottom: 0.5em;
  }
`;

export const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  span:first-child {
    margin-top: 1em;
  }
  span {
    color: rgba(255, 255, 255, 0.3);
    -moz-animation: bounce 2s infinite;
    -webkit-animation: bounce 2s infinite;
    animation: bounce 2s infinite;
  }

  img {
    width: 10em;
    border-radius: 50%;
  }

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-30px);
    }
    60% {
      transform: translateY(-15px);
    }
  }
`;
