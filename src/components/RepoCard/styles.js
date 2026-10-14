import styled from 'styled-components';

export const Container = styled.a`
  --clip-right-bottom: polygon(0 0, 100% 0, 100% 94%, 94% 100%, 0 100%);
  --clip-right-bottom-smaller: polygon(
    0.01% 0.01%,
    99.99% 0.01%,
    99.99% 93%,
    93% 99.99%,
    0 99.99%
  );
  --clip-right-top: polygon(0 0, 95% 0, 100% 40%, 100% 100%, 0 100%);
  --clip-right-top-smaller: polygon(
    0.01% 0.01%,
    93.9% 0.01%,
    99.9% 49.99%,
    99.99% 99.99%,
    0.01% 99.99%
  );

  --color-title-background: #6d2020;
  --color-title-border: #f51919;
  --filter-title-neon: drop-shadow(1px 1px 7px var(--color-title-border));

  --color-cover-background: #271e1e;
  --color-cover-border: rgba(73, 9, 9, 0.158);
  --filter-cover-neon: drop-shadow(2px 2px 4px rgba(255, 0, 0, 0.378));

  position: relative;
  padding: 1em;
  margin-bottom: 3em;
  display: block;
  text-decoration: none;
  color: #eee;
  cursor: ${(props) => (props.href ? 'pointer' : 'default')};
  transition: transform 0.2s ease, filter 0.2s ease;

  &:first-child {
    bottom: -7em;
    right: -150px;
    opacity: 0.3;
    pointer-events: none;
  }

  &:nth-child(2) {
    z-index: 1;
    opacity: 0.99;

    &:hover {
      transform: translateY(-4px);
      filter: brightness(1.08);
    }
  }

  &:last-child {
    bottom: -7em;
    left: -150px;
    opacity: 0.3;
    pointer-events: none;
  }

  @media (max-width: 728px) {
    &:first-child {
      right: -80px;
    }

    &:last-child {
      left: -80px;
    }
  }

  @media (max-width: 480px) {
    &:first-child {
      right: -50px;
    }

    &:nth-child(2) {
      h1 {
        font-size: 1.1em;
      }
      p {
        font-size: 0.9em;
      }
    }

    &:last-child {
      left: -50px;
    }
  }
`;

export const Title = styled.div`
  padding: 0.1em;
  margin-bottom: 0.7em;

  clip-path: var(--clip-right-top);
  background: var(--color-title-border);

  .submask {
    background: var(--color-title-background);
    padding: 1em;
    min-height: 3.65em;
    margin: 0;
    clip-path: var(--clip-right-top-smaller);

    h1 {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      text-transform: uppercase;
      font-size: 1.4em;
      letter-spacing: 1px;
      word-break: break-word;
    }
  }
`;

export const Cover = styled.div`
  padding: 0.15em;

  clip-path: var(--clip-right-bottom);
  background: var(--color-cover-border);

  .submask {
    margin: 0;
    padding: 1.5em;
    min-height: 24em;
    min-width: 24em;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    clip-path: var(--clip-right-bottom-smaller);
    background: var(--color-cover-background);

    p {
      font-size: 1.05em;
      line-height: 1.5;
      color: #ddd;
      filter: var(--filter-cover-neon);
      flex-grow: 1;
    }

    .meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5em;
      padding-top: 0.8em;
      border-top: 1px solid rgba(245, 25, 25, 0.2);
      font-size: 0.9em;
      color: #aaa;

      .badge {
        color: hsl(0, 85%, 65%);
      }

      .cta {
        color: #fff;
        text-transform: uppercase;
        font-weight: bold;
        letter-spacing: 1px;
      }
    }
  }
`;

export const PreviewContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 1;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 1em;
  background: #171010;
  border: 1px solid rgba(245, 25, 25, 0.3);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.35s ease;
  }

  &:hover img {
    transform: scale(1.02);
  }
`;

export const Skeleton = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(39, 30, 30, 0.9) 0%,
    rgba(90, 25, 25, 0.6) 50%,
    rgba(39, 30, 30, 0.9) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite ease-in-out;

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

export const FallbackCyberBanner = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 14px 18px;
  box-sizing: border-box;
  background: radial-gradient(circle at center, #2b1111 0%, #160a0a 100%);
  border: 1px solid rgba(245, 25, 25, 0.25);

  .terminal-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75em;
    color: #888;
    letter-spacing: 1px;

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(245, 25, 25, 0.6);

      &:nth-child(2) {
        background: rgba(245, 245, 61, 0.6);
      }
      &:nth-child(3) {
        background: rgba(13, 242, 242, 0.6);
      }
    }

    .title {
      margin-left: 8px;
      color: #666;
      font-family: monospace;
    }
  }

  .terminal-body {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .prompt {
      font-family: monospace;
      font-size: 1.05em;
      color: #0df2f2;
      text-shadow: 0 0 5px rgba(13, 242, 242, 0.5);
      margin: 0;
      word-break: break-all;
    }

    .repo-badge {
      align-self: flex-start;
      font-size: 0.8em;
      padding: 3px 8px;
      border-radius: 2px;
      background: rgba(245, 25, 25, 0.2);
      border: 1px solid rgba(245, 25, 25, 0.4);
      color: hsl(0, 85%, 70%);
      letter-spacing: 1px;
    }
  }
`;
