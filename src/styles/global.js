import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  @font-face {
    font-family: 'Cyber';
    src: url('/fonts/Blender-Pro-Bold.otf') format('opentype');
    font-display: swap;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    min-height: 100vh;
    min-height: 100dvh;
    width: 100%;
  }

  body {
    background: #1d1d1d;
    color: #eee;
    font-family: 'Cyber', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    font-family: inherit;
    border: none;
    background: transparent;
    cursor: pointer;
  }
`;
