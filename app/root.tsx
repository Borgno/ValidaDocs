import "./app.css";
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, NavLink, useLocation, useNavigation, useRouteLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { useState } from "react";
import { LayoutDashboard, CheckSquare, FileText, Menu, Home } from "lucide-react";
import { requestLoggerMiddleware } from "./middleware/requestLogger";
import { themeCookie } from "./services/config.server";
import { ThemeToggle } from "./components/ThemeToggle";

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

function Sidebar({ theme, isExpanded, setIsExpanded }: { theme: "light" | "dark", isExpanded: boolean, setIsExpanded: (val: boolean) => void }) {

  return (
    <>
      <aside className={`hidden md:flex fixed left-0 top-0 h-screen transition-all duration-300 ease-layout ${isExpanded ? 'w-[260px]' : 'w-[80px]'}
        bg-card-bg border-r border-glass-border shadow-sm dark:shadow-none
        flex-col justify-between py-6 z-[1000] overflow-hidden`}>
        
        <div className="flex flex-col gap-2 w-full">
          <button 
            className={`mx-4 mb-6 h-12 rounded-xl flex items-center text-text-muted hover:bg-surface hover:text-text transition-colors bg-transparent ${isExpanded ? 'px-4 justify-start' : 'w-12 mx-auto justify-center'}`}
            onClick={() => setIsExpanded(!isExpanded)} 
            title="Recolher"
          >
            <Menu size={22} strokeWidth={1.5} className="shrink-0" />
            <span className={`ml-3 text-[14px] font-medium transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>Recolher</span>
          </button>
          
          <nav className="flex flex-col gap-1 w-full relative">
            <NavLink to="/" prefetch="render" className={({ isActive }) => `relative mx-4 h-12 flex items-center rounded-xl transition-all ${isExpanded ? 'px-4' : 'w-12 mx-auto justify-center'} ${isActive ? 'text-primary bg-transparent font-medium' : 'text-text-muted bg-transparent hover:bg-surface-light hover:text-text font-normal'}`} title="Dashboard" end>
              {({ isActive }) => (
                <>
                  <LayoutDashboard size={22} strokeWidth={1.5} className="shrink-0" />
                  <span className={`ml-3 text-[14px] whitespace-nowrap transition-opacity delay-100 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>Dashboard</span>
                  {isActive && <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r bg-primary" />}
                </>
              )}
            </NavLink>

            <NavLink to="/conciliacao" prefetch="render" className={({ isActive }) => `relative mx-4 h-12 flex items-center rounded-xl transition-all ${isExpanded ? 'px-4' : 'w-12 mx-auto justify-center'} ${isActive ? 'text-primary bg-transparent font-medium' : 'text-text-muted bg-transparent hover:bg-surface-light hover:text-text font-normal'}`} title="Conferência de Lotes">
              {({ isActive }) => (
                <>
                  <CheckSquare size={22} strokeWidth={1.5} className="shrink-0" />
                  <span className={`ml-3 text-[14px] whitespace-nowrap transition-opacity delay-100 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>Conferência de Lotes</span>
                  {isActive && <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r bg-primary" />}
                </>
              )}
            </NavLink>

            <NavLink to="/comprovantes-fat" prefetch="render" className={({ isActive }) => `relative mx-4 h-12 flex items-center rounded-xl transition-all ${isExpanded ? 'px-4' : 'w-12 mx-auto justify-center'} ${isActive ? 'text-primary bg-transparent font-medium' : 'text-text-muted bg-transparent hover:bg-surface-light hover:text-text font-normal'}`} title="Mapeador de CTE">
              {({ isActive }) => (
                <>
                  <FileText size={22} strokeWidth={1.5} className="shrink-0" />
                  <span className={`ml-3 text-[14px] whitespace-nowrap transition-opacity delay-100 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>Mapeador de CTE</span>
                  {isActive && <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r bg-primary" />}
                </>
              )}
            </NavLink>

            <NavLink to="/pix-adm" prefetch="render" className={({ isActive }) => `relative mx-4 h-12 flex items-center rounded-xl transition-all ${isExpanded ? 'px-4' : 'w-12 mx-auto justify-center'} ${isActive ? 'text-primary bg-transparent font-medium' : 'text-text-muted bg-transparent hover:bg-surface-light hover:text-text font-normal'}`} title="Pix ADM">
              {({ isActive }) => (
                <>
                  <FileText size={22} strokeWidth={1.5} className="shrink-0" />
                  <span className={`ml-3 text-[14px] whitespace-nowrap transition-opacity delay-100 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>Pix ADM</span>
                  {isActive && <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r bg-primary" />}
                </>
              )}
            </NavLink>
          </nav>
        </div>

        <div className="flex flex-col border-t border-glass-border pt-6">
          <ThemeToggle initialTheme={theme} isExpanded={isExpanded} />
        </div>
      </aside>

      <aside className="md:hidden fixed bottom-0 left-0 right-0 flex flex-row items-center justify-between px-4 py-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] bg-card-bg border-t border-glass-border z-[1000]">
        <nav className="flex-1 flex justify-around">
          <NavLink to="/" prefetch="render" className={({ isActive }) => `relative w-11 h-11 flex items-center justify-center transition-colors ${isActive ? 'text-primary' : 'text-text-muted hover:text-text'}`} end>
            {({ isActive }) => (
              <>
                <LayoutDashboard size={22} />
                {isActive && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-b bg-primary" />}
              </>
            )}
          </NavLink>
          <NavLink to="/conciliacao" prefetch="render" className={({ isActive }) => `relative w-11 h-11 flex items-center justify-center transition-colors ${isActive ? 'text-primary' : 'text-text-muted hover:text-text'}`}>
            {({ isActive }) => (
              <>
                <CheckSquare size={22} />
                {isActive && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-b bg-primary" />}
              </>
            )}
          </NavLink>
          <NavLink to="/comprovantes-fat" prefetch="render" className={({ isActive }) => `relative w-11 h-11 flex items-center justify-center transition-colors ${isActive ? 'text-primary' : 'text-text-muted hover:text-text'}`}>
            {({ isActive }) => (
              <>
                <FileText size={22} />
                {isActive && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-b bg-primary" />}
              </>
            )}
          </NavLink>
          <NavLink to="/pix-adm" prefetch="render" className={({ isActive }) => `relative w-11 h-11 flex items-center justify-center transition-colors ${isActive ? 'text-primary' : 'text-text-muted hover:text-text'}`}>
            {({ isActive }) => (
              <>
                <FileText size={22} />
                {isActive && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-b bg-primary" />}
              </>
            )}
          </NavLink>
          <ThemeToggle initialTheme={theme} isMobile />
        </nav>
      </aside>
    </>
  );
}

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
  const [isExpanded, setIsExpanded] = useState(false);

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
        <div className="flex h-screen w-screen overflow-hidden">
          <Sidebar theme={theme} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

          <div className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ease-layout ${isExpanded ? 'md:pl-[260px]' : 'md:pl-[80px]'} pb-[70px] md:pb-0`}>
            <main className="flex-1 overflow-y-auto p-8">
              {children}
            </main>
          </div>
        </div>
        
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
    <main className="flex h-full w-full flex-col items-center justify-center p-8 text-center text-text bg-bg">
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

