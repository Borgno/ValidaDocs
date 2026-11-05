import { useState } from "react";
import { Form, NavLink, Outlet, useLoaderData, useRouteLoaderData } from "react-router";
import { LayoutDashboard, CheckSquare, FileText, Menu, LogOut } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { authMiddleware, getSessionUser } from "../middleware/auth.server";
import type { SessionUser } from "../services/auth/auth.server";
import type { Route } from "./+types/_app";

// Layout das telas autenticadas. O middleware barra sem sessão (manda para o login) e com troca de
// senha pendente (manda para /change-password). Vale também para as rotas de API filhas.
export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export function loader({ context }: Route.LoaderArgs) {
  return { user: getSessionUser(context) };
}

function Sidebar({ theme, user, isExpanded, setIsExpanded }: { theme: "light" | "dark", user: SessionUser, isExpanded: boolean, setIsExpanded: (val: boolean) => void }) {

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
          <Form method="post" action="/logout">
            <button
              type="submit"
              className={`mx-4 h-12 flex items-center rounded-xl transition-all ${isExpanded ? 'px-4 w-[calc(100%-2rem)]' : 'w-12 mx-auto justify-center'} text-text-muted bg-transparent hover:bg-surface-light hover:text-text font-normal`}
              title={`Sair (${user.email})`}
            >
              <LogOut size={20} strokeWidth={1.5} className="shrink-0" />
              <span className={`ml-3 text-[14px] whitespace-nowrap truncate transition-opacity delay-100 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>Sair</span>
            </button>
          </Form>
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
          <Form method="post" action="/logout">
            <button type="submit" title="Sair" className="relative w-11 h-11 flex items-center justify-center text-text-muted hover:text-text transition-colors">
              <LogOut size={20} />
            </button>
          </Form>
        </nav>
      </aside>
    </>
  );
}

export default function AppLayout() {
  const { user } = useLoaderData<typeof loader>();
  const rootData = useRouteLoaderData<{ theme: "light" | "dark" }>("root");
  const theme = rootData?.theme || "light";
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar theme={theme} user={user} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      <div className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ease-layout ${isExpanded ? 'md:pl-[260px]' : 'md:pl-[80px]'} pb-[70px] md:pb-0`}>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
