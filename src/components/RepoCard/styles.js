import styled from 'styled-components';

export const Container = styled.div`
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

  --color-title-background: #3d2020;
  --color-title-border: #f13232;
  --filter-title-neon: drop-shadow(1px 1px 7px var(--color-title-border));

  --color-cover-background: #271e1e;
  --color-cover-border: rgba(31, 7, 7, 0.158);
  --filter-cover-neon: drop-shadow(2px 2px 4px rgba(255, 0, 0, 0.233));

  position: relative;
  padding: 1em;
  margin-bottom: 3em;

  &:nth-child(2) {
    z-index: 1;
    opacity: 0.95;
  }
  &:first-child {
    bottom: -7em;
    right: -150px;
    opacity: 0.5;
  }
  &:last-child {
    bottom: -7em;
    left: -150px;
    opacity: 0.5;
  }
  @media (max-width: 1000px) {
  }
`;

export const Cover = styled.div`
  padding: 0.15em;

  clip-path: var(--clip-right-bottom);
  background: var(--color-cover-border);

  .submask {
    margin: 0;
    padding: 0.8em;
    min-height: 28.4em;
    min-width: 28.4em;
    clip-path: var(--clip-right-bottom-smaller);
    background: var(--color-cover-background);

    span {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12em;
      filter: var(--filter-cover-neon);
    }

    p {
      botttom: 0;
      filter: var(--filter-cover-neon);
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
      flex-direction: column;
      text-transform: uppercase;
      font-size: 1.5em;
    }
`;
