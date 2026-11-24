import styled, { css, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

/* Shake seco do card (aprovado) sincronizado com os picos de distorção cromática */
const cardGlitchTwitch = keyframes`
  0%, 100% {
    transform: translateY(-4px);
    filter: none;
  }
  7% {
    transform: translate(2px, -3px) skewX(-1.5deg);
    filter: contrast(1.12);
  }
  11% {
    transform: translateY(-4px);
    filter: none;
  }
  43% {
    transform: translate(-2px, -5px) skewX(1.5deg);
    filter: contrast(1.15);
  }
  47% {
    transform: translateY(-4px);
    filter: none;
  }
`;

/* Distorção de canal AZUL/CIANO rasgando para diagonal canto direito inferior (+X, +Y) */
const glitchCyanDistortion = keyframes`
  0%  { opacity: 0;    transform: translate(0, 0);                  clip-path: var(--clip-zero); }
  /* Rajada 1: aberração cromática breve + fatias rasgadas */
  3%  { opacity: 0.78; transform: translate(6px, 4px) skewX(-3deg); clip-path: var(--clip-full); }
  7%  { opacity: 0.9;  transform: translate(11px, 5px) skewX(4deg); clip-path: var(--clip-one); }
  12% { opacity: 0.85; transform: translate(7px, 4px) skewX(-2deg); clip-path: var(--clip-three); }
  17% { opacity: 0.9;  transform: translate(13px, 6px);             clip-path: var(--clip-two); }
  21% { opacity: 0;    transform: translate(0, 0);                  clip-path: var(--clip-zero); }

  /* Silêncio */
  36% { opacity: 0;    transform: translate(0, 0);                  clip-path: var(--clip-zero); }

  /* Rajada 2: distorção intensa no meio/topo */
  39% { opacity: 0.8;  transform: translate(8px, 5px) skewX(3deg);  clip-path: var(--clip-full); }
  43% { opacity: 0.92; transform: translate(14px, 6px) skewX(-5deg);clip-path: var(--clip-six); }
  49% { opacity: 0.85; transform: translate(6px, 3px) skewX(2deg);  clip-path: var(--clip-five); }
  54% { opacity: 0;    transform: translate(0, 0);                  clip-path: var(--clip-zero); }

  /* Pós-pulso de 1 linha de varredura e limpeza total */
  72% { opacity: 0;    transform: translate(0, 0);                  clip-path: var(--clip-zero); }
  74% { opacity: 0.85; transform: translate(9px, 4px);              clip-path: var(--clip-scanline); }
  79% { opacity: 0;    transform: translate(0, 0);                  clip-path: var(--clip-zero); }
  100%{ opacity: 0;    transform: translate(0, 0);                  clip-path: var(--clip-zero); }
`;

/* Distorção de canal AMARELO rasgando para diagonal canto esquerdo superior (-X, -Y) */
const glitchYellowDistortion = keyframes`
  0%  { opacity: 0;    transform: translate(0, 0);                     clip-path: var(--clip-zero); }
  /* Rajada 1: canal amarelo puxando para cima/esquerda */
  4%  { opacity: 0.72; transform: translate(-6px, -4px) skewX(3deg);   clip-path: var(--clip-full); }
  9%  { opacity: 0.88; transform: translate(-11px, -5px) skewX(-4deg); clip-path: var(--clip-five); }
  14% { opacity: 0.85; transform: translate(-7px, -4px) skewX(2deg);   clip-path: var(--clip-seven); }
  19% { opacity: 0;    transform: translate(0, 0);                     clip-path: var(--clip-zero); }

  /* Silêncio */
  38% { opacity: 0;    transform: translate(0, 0);                     clip-path: var(--clip-zero); }

  /* Rajada 2 */
  40% { opacity: 0.75; transform: translate(-8px, -5px) skewX(-3deg);  clip-path: var(--clip-full); }
  45% { opacity: 0.9;  transform: translate(-13px, -6px) skewX(5deg);  clip-path: var(--clip-one); }
  51% { opacity: 0.82; transform: translate(-6px, -3px) skewX(-2deg);  clip-path: var(--clip-two); }
  55% { opacity: 0;    transform: translate(0, 0);                     clip-path: var(--clip-zero); }

  /* Pós-pulso e limpeza total */
  74% { opacity: 0;    transform: translate(0, 0);                     clip-path: var(--clip-zero); }
  76% { opacity: 0.82; transform: translate(-9px, -4px);               clip-path: var(--clip-three); }
  81% { opacity: 0;    transform: translate(0, 0);                     clip-path: var(--clip-zero); }
  100%{ opacity: 0;    transform: translate(0, 0);                     clip-path: var(--clip-zero); }
`;

export const CardLink = styled(Link)`
  --border: 2px;
  --color: #ffffff;
  --shadow-primary: rgba(13, 242, 242, 95%);
  --primary-color: hsl(0, 85%, calc(53 * 1%));
  --shadow-secondary: rgba(245, 245, 61, 90%);
  --clip: polygon(0 0, 100% 0, 100% 100%, 50px 100%, 0 calc(100% - 50px));

  /* Fatias irregulares de rasgo de vídeo (RGB channel tear) */
  --clip-zero: polygon(0 0, 100% 0, 100% 0, 0 0);
  --clip-full: polygon(0 0, 100% 0, 100% 100%, 50px 100%, 0 calc(100% - 50px));
  --clip-one: polygon(0 5%, 100% 5%, 100% 19%, 0 19%);
  --clip-two: polygon(0 75%, 100% 75%, 100% 91%, 0 91%);
  --clip-three: polygon(0 43%, 100% 43%, 100% 53%, 0 53%);
  --clip-five: polygon(0 23%, 100% 23%, 100% 34%, 0 34%);
  --clip-six: polygon(0 56%, 100% 56%, 100% 69%, 0 69%);
  --clip-seven: polygon(0 13%, 100% 13%, 100% 22%, 0 22%);
  --clip-scanline: polygon(0 36%, 100% 36%, 100% 41%, 0 41%);

  position: relative;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: #eee;
  overflow: visible;
  isolation: isolate;
  transition: filter 0.15s ease;

  &:hover {
    z-index: 2;
    filter: brightness(1.06);
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: translateY(-4px);
    }
  }
`;

export const CardSurface = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: #231919;
  border: 1px solid rgba(245, 25, 25, 0.3);
  clip-path: var(--clip);
  box-shadow: inset -3px 0 0 rgba(245, 25, 25, 0.4);
  transition: transform 0.15s ease, border-color 0.2s ease, box-shadow 0.2s ease;

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

  ${CardLink}:hover & {
    transform: translateY(-4px);
    border-color: var(--primary-color);
    box-shadow: 0 0 15px rgba(245, 25, 25, 0.4), inset -3px 0 0 var(--primary-color);
    animation: ${cardGlitchTwitch} ${(props) => props.$time || '0.7s'} steps(1, end) forwards;

    &:after {
      background: var(--primary-color);
      box-shadow: 0 0 10px rgba(245, 25, 25, 0.8);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    ${CardLink}:hover & {
      animation: none;
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

  ${CardLink}:hover ${CardSurface} & img {
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

  ${CardLink}:hover ${CardSurface} & h2 {
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

/* Base de distorção cromática pura (mix-blend-mode: screen funde apenas os canais
   luminosos ciano/amarelo sobre o card real, sem placas escuras opacas) */
const chromaticDistortionBase = css`
  display: flex;
  flex-direction: column;
  position: absolute;
  inset: 0;
  opacity: 0;
  background: transparent;
  mix-blend-mode: screen;
  clip-path: var(--clip-zero);
  pointer-events: none;
  overflow: hidden;
  user-select: none;
  will-change: transform, clip-path, opacity;

  ${BannerContainer} {
    background: transparent;
  }

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

/* Canal Azul/Ciano puro — distorção diagonal canto direito inferior */
export const RepeatedContainerGlitch = styled.div`
  ${chromaticDistortionBase}
  z-index: 4;
  box-shadow: inset 0 0 0 2px var(--shadow-primary);

  ${BannerContainer} img {
    filter: grayscale(100%) brightness(1.1) contrast(1.45) sepia(100%) hue-rotate(140deg) saturate(600%);
  }

  ${BannerContainer}:after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.55) 0px,
      rgba(0, 0, 0, 0.55) 1px,
      transparent 1px,
      transparent 3px
    );
    pointer-events: none;
  }

  h2,
  p,
  span {
    color: #0df2f2 !important;
    text-shadow: 2px 2px 6px rgba(13, 242, 242, 0.9);
  }

  ${CardLink}:hover & {
    animation: ${glitchCyanDistortion} ${(props) => props.$time || '0.7s'} steps(1, end) forwards;
  }
`;

/* Canal Amarelo puro — distorção diagonal canto esquerdo superior */
export const GlitchSecondaryLayer = styled.div`
  ${chromaticDistortionBase}
  z-index: 3;
  box-shadow: inset 0 0 0 2px var(--shadow-secondary);

  ${BannerContainer} img {
    filter: grayscale(100%) brightness(1.1) contrast(1.45) sepia(100%) hue-rotate(15deg) saturate(650%);
  }

  ${BannerContainer}:after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.5) 0px,
      rgba(0, 0, 0, 0.5) 1px,
      transparent 1px,
      transparent 3px
    );
    pointer-events: none;
  }

  h2,
  p,
  span {
    color: #f5f53d !important;
    text-shadow: -2px -2px 6px rgba(245, 245, 61, 0.9);
  }

  ${CardLink}:hover & {
    animation: ${glitchYellowDistortion} ${(props) => props.$time || '0.7s'} steps(1, end) forwards;
  }
`;
