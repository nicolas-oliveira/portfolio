import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

const scanline = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 100%;
  }
`;

export const PageContainer = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  background-color: #171111;
  color: #e5e5e5;
  box-sizing: border-box;
  padding: 40px 24px 100px 24px;
  position: relative;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 24px 16px 60px 16px;
  }
`;

export const BackButton = styled(Link)`
  --primary-color-red: hsl(0, 85%, calc(53 * 1%));

  align-self: flex-start;
  color: #aaa;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Cyber', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    color: #fff;
    border-color: var(--primary-color-red);
    box-shadow: 0 0 10px rgba(245, 25, 25, 0.3);
  }
`;

export const NavHeader = styled.nav`
  max-width: 900px;
  margin: 0 auto 36px auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(245, 25, 25, 0.25);
  padding-bottom: 18px;

  ${BackButton} {
    margin-bottom: 0;
  }

  .terminal-status {
    font-family: monospace;
    font-size: 0.85em;
    color: #fee715;
    letter-spacing: 1.5px;
  }
`;

export const ArticleWrapper = styled.article`
  max-width: 900px;
  margin: 0 auto;
`;

export const ArticleHeader = styled.header`
  margin-bottom: 36px;

  .meta-info {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    font-family: monospace;
    font-size: 0.85em;
    color: #888;
    margin-bottom: 16px;
    align-items: center;

    .date {
      color: #bbb;
    }

    .read-time {
      color: #fee715;
    }

    .tags {
      display: flex;
      gap: 8px;

      span {
        color: #f51919;
        background: rgba(245, 25, 25, 0.12);
        padding: 2px 8px;
        border-radius: 2px;
      }
    }
  }

  h1 {
    font-size: 2.6em;
    font-weight: 900;
    line-height: 1.25;
    color: #fff;
    margin: 0 0 16px 0;
    letter-spacing: 0.5px;

    @media (max-width: 768px) {
      font-size: 1.9em;
    }
  }

  .excerpt {
    font-size: 1.15em;
    line-height: 1.6;
    color: #a8a8a8;
    margin: 0 0 28px 0;
    border-left: 3px solid #f51919;
    padding-left: 16px;
  }

  .cover-container {
    width: 100%;
    aspect-ratio: 16 / 9;
    max-height: 480px;
    overflow: hidden;
    position: relative;
    border: 1px solid rgba(245, 25, 25, 0.3);
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%);
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.6);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }
`;

export const MarkdownContainer = styled.div`
  &.markdown-body {
    background-color: transparent !important;
    color: #d8d8d8;
    font-family: 'Cyber', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    font-size: 1.05em;
    line-height: 1.8;

    h1, h2, h3, h4, h5, h6 {
      color: #fff;
      border-bottom-color: rgba(245, 25, 25, 0.25);
      margin-top: 36px;
      margin-bottom: 18px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    h1 {
      font-size: 2em;
    }

    h2 {
      font-size: 1.6em;
      color: #fee715;
    }

    h3 {
      font-size: 1.3em;
      color: #ff5555;
    }

    p {
      margin-bottom: 20px;
      line-height: 1.8;
      color: #ccc;
    }

    a {
      color: #fee715;
      text-decoration: underline;
      text-underline-offset: 3px;
      transition: color 0.2s ease, text-shadow 0.2s ease;

      &:hover {
        color: #fff;
        text-shadow: 0 0 8px #fee715;
      }
    }

    blockquote {
      border-left: 4px solid #f51919;
      color: #aaa;
      background: rgba(245, 25, 25, 0.08);
      padding: 12px 20px;
      margin: 24px 0;
      border-radius: 0 4px 4px 0;
    }

    ul, ol {
      padding-left: 28px;
      margin-bottom: 20px;

      li {
        margin-bottom: 8px;
        color: #ccc;
      }
    }

    table {
      width: 100%;
      margin: 24px 0;
      border-collapse: collapse;

      th, td {
        border: 1px solid rgba(255, 255, 255, 0.12);
        padding: 10px 14px;
      }

      th {
        background-color: #231919;
        color: #fee715;
        font-family: monospace;
      }

      tr:nth-child(2n) {
        background-color: rgba(255, 255, 255, 0.02);
      }
    }

    hr {
      border: 0;
      height: 1px;
      background: linear-gradient(90deg, #f51919, rgba(254, 231, 21, 0.5), transparent);
      margin: 40px 0;
    }

    pre {
      border: 1px solid rgba(245, 25, 25, 0.3) !important;
      border-radius: 4px !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
      margin: 24px 0 !important;
    }

    code:not(pre code) {
      background-color: rgba(254, 231, 21, 0.12);
      color: #fee715;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: monospace;
      font-size: 0.9em;
    }
  }
`;

export const StatusScreen = styled.div`
  max-width: 900px;
  margin: 100px auto;
  text-align: center;
  font-family: monospace;
  padding: 40px;
  border: 1px dashed rgba(245, 25, 25, 0.3);

  h2 {
    color: #f51919;
    font-size: 1.8em;
    margin-bottom: 16px;
  }

  p {
    color: #888;
    margin-bottom: 24px;
  }
`;
