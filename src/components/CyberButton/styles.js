import styled from 'styled-components';

export const ContainerButton = styled.a`
  --border: 4px;
  --color: #ffffff;
  --shadow-primary-hue: 180;
  --shadow-primary: rgba(13, 242, 242, 90%);
  --primary: hsl(0, 85%, calc(53 * 1%));
  --shadow-secondary: rgba(245, 245, 61, 80%);
  --clip: polygon(0 0, 100% 0, 100% 100%, 8% 100%, 0 70%);
  --shimmy-distance: 3;

  --clip-one: polygon(
    0 2%,
    100% 2%,
    100% 95%,
    95% 95%,
    95% 90%,
    85% 90%,
    85% 95%,
    8% 95%,
    0 70%
  );
  --clip-two: polygon(
    0 78%,
    100% 78%,
    100% 100%,
    95% 100%,
    95% 90%,
    85% 90%,
    85% 100%,
    8% 100%,
    0 78%
  );
  --clip-three: polygon(
    0 44%,
    100% 44%,
    100% 54%,
    95% 54%,
    95% 54%,
    85% 54%,
    85% 54%,
    8% 54%,
    0 54%
  );
  --clip-four: polygon(
    0 0,
    100% 0,
    100% 0,
    95% 0,
    95% 0,
    85% 0,
    85% 0,
    8% 0,
    0 0
  );
  --clip-five: polygon(
    0 0,
    100% 0,
    100% 0,
    95% 0,
    95% 0,
    85% 0,
    85% 0,
    8% 0,
    0 0
  );
  --clip-six: polygon(
    0 40%,
    100% 40%,
    100% 85%,
    95% 85%,
    95% 85%,
    85% 85%,
    85% 85%,
    8% 85%,
    0 70%
  );
  --clip-seven: polygon(
    0 63%,
    100% 63%,
    100% 80%,
    95% 80%,
    95% 80%,
    85% 80%,
    85% 80%,
    8% 80%,
    0 70%
  );

  display: flex;
  flex-direction: center;
  align-items: center;
  justify-content: center;
  position: relative;

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  padding: 28px;
  margin: 20px 0 0 0;
  background: var(--primary);
  outline: transparent;
  border: 0;

  font-family: 'Cyber', sans-serif;
  font-size: 18px;
  box-shadow: inset -3px 0 0 var(--shadow-primary);
  clip-path: polygon(0 0, 110% -10%, 110% 110%, 10% 110%, -10% 40%);

  &:before {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--primary);
    clip-path: var(--clip);
    z-index: -1;
  }

  svg {
    margin: 0 10px 0 0;
  }
`;

export const RepeatedContainerGlitch = styled.span`
  display: flex;
  flex-direction: center;
  align-items: center;
  justify-content: center;

  position: absolute;
  top: calc(var(--border) * -1);
  left: calc(var(--border) * -1);
  right: calc(var(--border) * -1);
  bottom: calc(var(--border) * -1);

  opacity: 0;
  letter-spacing: 2px;
  background: var(--shadow-primary);
  text-shadow: 2px 2px var(--shadow-primary), -2px -2px var(--shadow-secondary);
  clip-path: var(--clip);
  transform: translate(0, 100%);
  animation: glitch ${(props) => props.time} infinite ease-in-out;
  animation-delay: ${(props) => props.delay};

  svg {
    filter: drop-shadow(2px 2px var(--shadow-primary))
      drop-shadow(-2px -2px var(--shadow-secondary));
  }

  span {
    text-shadow: 2px 2px var(--shadow-primary),
      -2px -2px var(--shadow-secondary);
  }

  &:before {
    content: '';
    position: absolute;
    top: var(--border);
    right: var(--border);
    bottom: var(--border);
    left: var(--border);
    clip-path: var(--clip);
    background: var(--primary);
    z-index: -1;
  }

  @keyframes glitch {
    0% {
      opacity: 100%;
      clip-path: var(--clip-one);
    }
    1%,
    3% {
      clip-path: var(--clip-two);
      transform: translate(calc(var(--shimmy-distance) * -1%), 0);
    }
    2% {
      clip-path: var(--clip-two);
      transform: translate(calc(var(--shimmy-distance) * 1%), 0);
    }
    4% {
      clip-path: var(--clip-two);
      transform: translate(0, 0);
    }
    5% {
      clip-path: var(--clip-three);
      transform: translate(calc(var(--shimmy-distance) * 1%), 0);
    }
    6% {
      clip-path: var(--clip-three);
      transform: translate(0, 0);
    }
    8%,
    10% {
      clip-path: var(--clip-four);
      transform: translate(calc(var(--shimmy-distance) * 1%), 0);
    }
    11% {
      clip-path: var(--clip-five);
      transform: translate(calc(var(--shimmy-distance) * 1%), 0);
    }
    14% {
      clip-path: var(--clip-five);
      transform: translate(calc(var(--shimmy-distance) * -1%), 0);
    }
    16%,
    20% {
      clip-path: var(--clip-six);
      transform: translate(calc(var(--shimmy-distance) * -1%));
    }
    17% {
      clip-path: var(--clip-six);
      transform: translate(calc(var(--shimmy-distance) * 1%));
    }
    21% {
      clip-path: var(--clip-six);
      transform: translate(0, 0);
    }
    25% {
      clip-path: var(--clip-seven);
      transform: translate(calc(var(--shimmy-distance) * 1%), 0);
    }
    26% {
      clip-path: var(--clip-seven);
      transform: translate(0, 0);
    }
    17%,
    27% {
      opacity: 100%;
      clip-path: var(--clip-four);
    }
    28% {
      opacity: 0;
      transform: translate(0, 0);
    }
    100% {
      opacity: 0;
      transform: translate(0, 0);
    }
  }
`;
