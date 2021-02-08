import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  @font-face {
    font-family: Cyber;
    src: url('https://assets.codepen.io/605876/Blender-Pro-Bold.otf');
    font-display: swap;
  }

  * {
		margin: 0;
		bottom: 0;
		outline: 0;
		box-sizing: border-box;
  }

  html, body, #root {
		min-height: 100% auto;
    width: 100vw;
    height: 100vh;
  }
  
  body {
    background-size: auto;
    background: no-repeat linear-gradient(50deg, #1d1d1d 40%, #111111 60%), #fff700;
    color: azure;
    font-family: 'Cyber', sans-serif;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    text-decoration: none;
    color: #fff;
  }
}
`;
