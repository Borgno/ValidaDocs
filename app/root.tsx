import "./app.css";
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useNavigation, useRouteLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requestLoggerMiddleware } from "./middleware/requestLogger";
import { themeCookie } from "./services/config.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const theme = (await themeCookie.parse(cookieHeader)) || "light";

  return { theme };
}

export const middleware = [requestLoggerMiddleware];

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous" as const,
  },
  {
    rel: "preload",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@300;400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
    as: "style",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@300;400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
  },
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
];

function ProgressBar() {
  const navigation = useNavigation();
  const active = navigation.state !== "idle";

  return (
    <div className={`global-progress-bar ${active ? 'active' : ''}`} />
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useRouteLoaderData<typeof loader>("root");
  const theme = loaderData?.theme || "light";

  return (
    <html lang="pt-BR" className={theme === "dark" ? "dark" : ""} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#030712" />
        <title>ValidaDocs</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-bg text-text antialiased font-sans">
        <ProgressBar />
        {children}

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: any }) {
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
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-8 text-center text-text bg-bg">
      <h1 className="text-3xl font-bold mb-4">{message}</h1>
      <p className="text-text-muted mb-8">{details}</p>
      {stack && (
        <pre className="w-full max-w-4xl p-6 overflow-x-auto bg-card-bg border border-glass-border rounded-xl text-left font-mono text-sm shadow-card">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

