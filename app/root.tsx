import type { Route } from "./+types/root";
import "@pigment-css/react/styles.css";
import "./global.styles";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";
import { getPList } from "features/notion/api/index.server";
import type { NotionPageMeta } from "features/notion/model";
import { css } from "@pigment-css/react";
import { PList } from "features/pList/PList";
import { useState } from "react";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;600&family=Geist:wght@400;600&family=Noto+Sans+KR:wght@400;600&display=swap",
  },
];

export async function loader(_: Route.LoaderArgs) {
  return await getPList(
    process.env.NOTION_KEY!,
    process.env.NOTION_DATABASE_ID!,
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const pList =
    useRouteLoaderData<[NotionPageMeta[], NotionPageMeta[]]>("root");
  const [navOpen, setNavOpen] = useState(false);
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <Meta />
        <Links />
      </head>
      <body>
        <button
          type="button"
          aria-label={navOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={navOpen}
          onClick={() => setNavOpen((v) => !v)}
          className={css`
            display: none;

            @media (width < 768px) {
              display: flex;
              position: fixed;
              top: 1rem;
              right: 1.25rem;
              z-index: 20;
              width: 1.75rem;
              height: 1.5rem;
              align-items: center;
              justify-content: center;
              padding: 0;
              border: 0;
              background: none;
              color: var(--color-text);
              cursor: pointer;
            }
          `}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <main
          className={css`
            padding: 1rem 1.25rem;
            display: flex;
            gap: 1rem;
            flex-direction: row;
            align-items: flex-start;
          `}
        >
          <PList
            pList={pList ?? [[], []]}
            open={navOpen}
            onNavigate={() => setNavOpen(false)}
          />
          <div
            className={css`
              flex: 1;
              min-width: 0;
            `}
          >
            {children}
          </div>
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre style={{ overflowX: "auto" }}>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
