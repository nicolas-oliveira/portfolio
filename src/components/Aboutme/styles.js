import styled from 'styled-components';

export const AboutText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-size: 24px;
  max-width: 800px;
  height: 100vh;
`;
export const TextSelf = styled.div`
  h1 {
    margin-bottom: 25px;
  }

  p {
    margin-bottom: 10px;
  }
`;

export const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  span:first-child {
    margin-top: 60px;
  }
  span {
    color: rgba(255, 255, 255, 0.3);
    -moz-animation: bounce 2s infinite;
    -webkit-animation: bounce 2s infinite;
    animation: bounce 2s infinite;
  }

  img {
    width: 200px;
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
