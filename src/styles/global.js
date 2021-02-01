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
  }

  #root {
    display: grid; 
    align-items: center;
    justify-content: space-evenly;
    grid-template-columns: 3fr 1fr;
    min-width: 1000px;
    height: 100vh;
    padding: 40px;
  }
  
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: center;

    margin: 0;
    height: 100vh;
    width: 100vw;

    background: linear-gradient(50deg, #1d1d1d 40%, #111111 60%), #fff700;
    color: azure;
    font-family: 'Cyber', sans-serif;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    text-decoration: none;
    color: #fff;
  }

  @media(max-width: 1000px) {
    body {
      background:#1d1d1d;
 
    }
    #root {
      all: unset;
      box-sizing: border-box;
      padding: 40px;
      width: 468px;
      height: 100vh;
    }
  }
}
`;
