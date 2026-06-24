import "./app.css";
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, NavLink, useLocation, useNavigation } from "react-router";
import { useState } from "react";
import { LayoutDashboard, CheckSquare, FileText, Menu, Sun, Moon } from "lucide-react";
import { requestLoggerMiddleware } from "./middleware/requestLogger";

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

function Sidebar() {
  const location = useLocation();
  const path = location.pathname;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
      <div className="sidebar-top">
        <button className="sidebar-toggle" onClick={() => setIsExpanded(!isExpanded)} title="Expandir menu">
          <Menu size={24} className="sidebar-icon" />
          {isExpanded && <span className="sidebar-text">Recolher</span>}
        </button>

        <div className="sidebar-nav">
          <NavLink to="/" prefetch="render" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} title="Dashboard" end>
            <LayoutDashboard size={24} className="sidebar-icon" />
            {isExpanded && <span className="sidebar-text">Dashboard</span>}
          </NavLink>

          <NavLink to="/conciliacao" prefetch="render" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} title="Conferência de Lotes">
            <CheckSquare size={24} className="sidebar-icon" />
            {isExpanded && <span className="sidebar-text">Conferência de Lotes</span>}
          </NavLink>

          <NavLink to="/comprovantes-fat" prefetch="render" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} title="Mapeador de CTE">
            <FileText size={24} className="sidebar-icon" />
            {isExpanded && <span className="sidebar-text">Mapeador de CTE</span>}
          </NavLink>
        </div>
      </div>
      <div className="sidebar-bottom">
        <button 
          className="sidebar-toggle" 
          onClick={() => {
            const isLight = document.documentElement.classList.contains('light');
            if (isLight) {
              document.documentElement.classList.remove('light');
              localStorage.setItem('theme', 'dark');
            } else {
              document.documentElement.classList.add('light');
              localStorage.setItem('theme', 'light');
            }
            // Trigger state update to re-render icon if needed
            window.dispatchEvent(new Event('themechange'));
          }} 
          title="Alternar Tema"
          style={{ marginBottom: '16px' }}
        >
          <Sun size={24} className="sidebar-icon sun-icon" />
          {isExpanded && <span className="sidebar-text">Tema</span>}
        </button>
      </div>
    </aside>
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
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#030712" />
        <title>ValidaDocs</title>
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'light') {
                  document.documentElement.classList.add('light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <ProgressBar />
        <div className="page-shell">
          <Sidebar />

          <div className="page-content">
            <main className="page-main">
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
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
