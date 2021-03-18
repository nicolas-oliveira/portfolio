import styled from 'styled-components';

export const Container = styled.div`
  --primary-color-red: hsl(0, 85%, calc(53 * 1%));

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

export const Pseudocode = styled.code`
  font-family: source-code-pro, 'Courier New', monospace;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.418);
  code {
    display: block;
  }
`;

export const TextContent = styled.div`
  margin: 10px 0 20px 40px;
  h1 {
    margin: 0;
    padding: 0 0 20px;
    font-size: 60px;
    font-weight: 800;
    line-height: 55px;
  }
  h2 {
    margin: 0;
    padding: 20px 0 5px 0;
    font-size: 25px;
    font-weight: 800;
    line-height: 20px;
  }
  h1 span {
    color: var(--primary-color-red);
  }
  code {
    color: rgba(192, 192, 192, 0.85);
    font-size: 14px;
  }
`;
