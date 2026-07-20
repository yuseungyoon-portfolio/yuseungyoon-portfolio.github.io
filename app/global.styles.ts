import { globalCss } from "@pigment-css/react";

globalCss`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  :root {
    --font-sans: "Geist", "Noto Sans KR", ui-sans-serif, system-ui, sans-serif,
      "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --font-mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    --color-text: #1f1f1f;
    --color-text-muted: #6d6d6d;
    --color-border: #e8e8e8;
    --color-surface: #f7f7f7;
  }

  html,
  body {
    font-family: var(--font-sans);
    background: #fff;
    color: var(--color-text);
    -webkit-font-smoothing: antialiased;
    margin: 0;
    padding: 0;
    font-size: 100%;
  }

  p, a, h1, h2, h3, h4, h5, h6, input, textarea, button, figcaption, li {
    margin: 0;
    padding: 0;
    font-family: var(--font-sans);
    font-size: inherit;
    font-weight: normal;
  }

  a {
    color: var(--color-text);
    text-decoration: none;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  ol {
    padding: 0;
    margin: 0;
  }

  img {
    display: block;
  }
`;
