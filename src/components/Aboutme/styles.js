import styled from 'styled-components';

export const AboutText = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-size: 22px;
  max-width: 728px;
  width: 100%;

  min-height: 100vh;
  min-height: 100dvh;

  margin-top: 10px;
  margin-bottom: 40px;
  padding: 20px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
  @media (max-width: 425px) {
    font-size: 16px;
  }
`;

export const TextSelf = styled.div`
  width: 100%;

  h1 {
    margin-bottom: 0.4em;
    font-size: 1.8em;
  }

  p {
    margin-bottom: 0.8em;
    line-height: 1.5;
  }

  a {
    color: hsl(0, 85%, 53%);
    text-decoration: underline;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  span:first-child {
    margin-top: 1em;
  }

  span {
    color: rgba(255, 255, 255, 0.4);
    animation: bounce 2s infinite;
  }

  img {
    width: 10em;
    height: 10em;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid hsl(0, 85%, 53%);
    box-shadow: 0 0 15px rgba(245, 25, 25, 0.4);
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
      transform: translateY(-20px);
    }
    60% {
      transform: translateY(-10px);
    }
  }
`;
