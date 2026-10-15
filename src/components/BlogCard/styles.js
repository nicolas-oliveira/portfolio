import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const CardLink = styled(Link)`
  --border: 4px;
  --color: #ffffff;
  --shadow-primary-hue: 180;
  --shadow-primary: rgba(13, 242, 242, 90%);
  --primary-color: hsl(0, 85%, calc(53 * 1%));
  --shadow-secondary: rgba(245, 245, 61, 80%);
  --clip: polygon(0 0, 100% 0, 100% 100%, 50px 100%, 0 calc(100% - 50px));
  --shimmy-distance: 3;

  --clip-one: polygon(0 0, 100% 0, 100% 28%, 0 28%, 0 28%);
  --clip-two: polygon(0 20%, 100% 20%, 100% 48%, 0 48%, 0 48%);
  --clip-three: polygon(0 42%, 100% 42%, 100% 64%, 0 64%, 0 64%);
  --clip-four: polygon(0 56%, 100% 56%, 100% 72%, 0 72%, 0 72%);
  --clip-five: polygon(0 68%, 100% 68%, 100% 84%, 0 84%, 0 84%);
  --clip-six: polygon(0 80%, 100% 80%, 100% 100%, 50px 100%, 0 calc(100% - 50px));
  --clip-seven: polygon(0 0, 100% 0, 100% 100%, 50px 100%, 0 calc(100% - 50px));

  position: relative;
  display: flex;
  flex-direction: column;
  background: #231919;
  border: 1px solid rgba(245, 25, 25, 0.3);
  clip-path: var(--clip);
  text-decoration: none;
  color: #eee;
  box-shadow: inset -3px 0 0 rgba(245, 25, 25, 0.4);
  transition: transform 0.15s ease, filter 0.15s ease, border-color 0.2s ease, box-shadow 0.2s ease;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 50px;
    width: calc(50px * 1.41421356);
    height: 1.5px;
    background: rgba(245, 25, 25, 0.35);
    transform-origin: 0 0;
    transform: rotate(45deg) translateY(-1px);
    pointer-events: none;
    z-index: 10;
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
  }

  &:hover {
    transform: translateY(-4px);
    filter: brightness(1.08);
    border-color: var(--primary-color);
    box-shadow: 0 0 15px rgba(245, 25, 25, 0.4), inset -3px 0 0 var(--primary-color);

    &:after {
      background: var(--primary-color);
      box-shadow: 0 0 10px rgba(245, 25, 25, 0.8);
    }
  }
`;

export const BannerContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #171010;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
  }

  ${CardLink}:hover & img {
    transform: scale(1.04);
  }
`;

export const ContentContainer = styled.div`
  padding: 18px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;

  h2 {
    font-size: 1.25em;
    font-weight: 700;
    margin-bottom: 8px;
    color: #fff;
    line-height: 1.3;
    letter-spacing: 0.5px;
    transition: color 0.2s ease;
  }

  ${CardLink}:hover & h2 {
    color: #fee715;
    text-shadow: 0 0 8px rgba(254, 231, 21, 0.6);
  }

  p {
    font-size: 0.9em;
    color: #bbb;
    line-height: 1.4;
    margin-bottom: 14px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.78em;
    color: #888;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 10px;
    padding-left: 36px;

    .tags {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;

      span {
        color: hsl(0, 85%, 65%);
        background: rgba(245, 25, 25, 0.15);
        padding: 2px 6px;
        border-radius: 2px;
      }
    }

    .read-time {
      color: #fee715;
      font-family: monospace;
    }
  }
`;

export const RepeatedContainerGlitch = styled.div`
  display: flex;
  flex-direction: column;
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
  pointer-events: none;
  overflow: hidden;
  user-select: none;
  z-index: 5;

  ${BannerContainer} {
    position: relative;
    overflow: hidden;

    img {
      filter: invert(0.85) hue-rotate(180deg) saturate(300%) contrast(160%);
      transform: scale(1.06) translate(calc(var(--shimmy-distance) * -1.5%), -2px) !important;
      display: block;
    }

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(13, 242, 242, 0.45);
      mix-blend-mode: screen;
      transform: translate(-3px, 0);
      z-index: 2;
      pointer-events: none;
    }

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.5) 0px,
        rgba(0, 0, 0, 0.5) 2px,
        transparent 2px,
        transparent 4px
      ), rgba(245, 25, 25, 0.4);
      mix-blend-mode: screen;
      transform: translate(3px, 0);
      z-index: 3;
      pointer-events: none;
    }
  }

  ${CardLink}:hover & ${BannerContainer} img {
    filter: invert(0.85) hue-rotate(180deg) saturate(300%) contrast(160%);
    transform: scale(1.06) translate(calc(var(--shimmy-distance) * -1.5%), -2px) !important;
  }

  span, h2, p {
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
    background: #231919;
    z-index: -1;
  }

  ${CardLink}:hover & {
    opacity: 1;
    animation: glitch ${(props) => props.time || '4.1s'} infinite linear;
  }

  @keyframes glitch {
    0% {
      opacity: 100%;
      clip-path: var(--clip-one);
      transform: translate(calc(var(--shimmy-distance) * -1%), 0);
    }
    1%,
    4% {
      clip-path: var(--clip-one);
      transform: translate(calc(var(--shimmy-distance) * 1.5%), 0);
    }
    2%,
    5% {
      clip-path: var(--clip-one);
      transform: translate(calc(var(--shimmy-distance) * -1.2%), 0);
    }
    6% {
      clip-path: var(--clip-one);
      transform: translate(0, 0);
    }
    7%,
    10% {
      clip-path: var(--clip-two);
      transform: translate(calc(var(--shimmy-distance) * 1.2%), 0);
    }
    8%,
    11% {
      clip-path: var(--clip-two);
      transform: translate(calc(var(--shimmy-distance) * -1%), 0);
    }
    12% {
      clip-path: var(--clip-two);
      transform: translate(0, 0);
    }
    14%,
    17% {
      clip-path: var(--clip-three);
      transform: translate(calc(var(--shimmy-distance) * -0.8%), 0);
    }
    15%,
    18% {
      clip-path: var(--clip-three);
      transform: translate(calc(var(--shimmy-distance) * 0.8%), 0);
    }
    19% {
      clip-path: var(--clip-three);
      transform: translate(0, 0);
    }
    21%,
    23% {
      clip-path: var(--clip-four);
      transform: translate(calc(var(--shimmy-distance) * 0.5%), 0);
    }
    22% {
      clip-path: var(--clip-four);
      transform: translate(calc(var(--shimmy-distance) * -0.5%), 0);
    }
    24% {
      clip-path: var(--clip-four);
      transform: translate(0, 0);
    }
    26% {
      clip-path: var(--clip-five);
      transform: translate(calc(var(--shimmy-distance) * -0.3%), 0);
    }
    28% {
      clip-path: var(--clip-six);
      transform: translate(calc(var(--shimmy-distance) * 0.3%), 0);
    }
    30%,
    32% {
      clip-path: var(--clip-seven);
      opacity: 90%;
      transform: translate(0, 0);
    }
    34% {
      clip-path: var(--clip-seven);
      opacity: 0;
      transform: translate(0, 0);
    }
    100% {
      opacity: 0;
      transform: translate(0, 0);
    }
  }
`;
