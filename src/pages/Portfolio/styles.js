import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const PortfolioContainer = styled.main`
  --primary-color-red: hsl(0, 85%, calc(53 * 1%));

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 40px 20px;
  box-sizing: border-box;

  h2 {
    text-transform: uppercase;
  }

  h3 {
    font-size: 1.5em;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-align: center;
  }

  font-size: 17px;

  @media (max-width: 1024px) {
    padding: 20px;
  }
`;

export const BackButton = styled(Link)`
  align-self: flex-start;
  margin-bottom: 20px;
  color: #aaa;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Cyber', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;

  &:hover {
    color: #fff;
    border-color: var(--primary-color-red);
    box-shadow: 0 0 10px rgba(245, 25, 25, 0.3);
  }
`;
