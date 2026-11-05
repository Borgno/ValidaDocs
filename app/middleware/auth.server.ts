import { createContext, redirect, type MiddlewareFunction, type RouterContextProvider } from "react-router";
import { resolveSession, type SessionUser } from "../services/auth/auth.server";
import { readSessionCookie, type Session } from "../services/auth/session.server";

export const sessionContext = createContext<{ user: SessionUser; session: Session } | null>(null);

type ContextReader = Readonly<RouterContextProvider>;

// Usuário da sessão. Só chamar em rota sob o authMiddleware, que garante a sessão.
export function getSessionUser(context: ContextReader) {
  const resolved = context.get(sessionContext);
  if (!resolved) throw new Error("getSessionUser fora do authMiddleware.");
  return resolved.user;
}

export function getSession(context: ContextReader) {
  const resolved = context.get(sessionContext);
  if (!resolved) throw new Error("getSession fora do authMiddleware.");
  return resolved;
}

// Caminho que o usuário vê, sem o sufixo das requests de dados do React Router (/conciliacao.data).
export function visiblePath(request: Request) {
  const url = new URL(request.url);
  let pathname = url.pathname.replace(/\.data$/, "");
  if (pathname === "/_root") pathname = "/";
  return pathname + url.search;
}

export function loginPath(request: Request) {
  const from = visiblePath(request);
  return from === "/" ? "/login" : `/login?redirectTo=${encodeURIComponent(from)}`;
}

// Só aceita caminho interno, para o redirectTo do login não virar open redirect.
export function safeRedirect(target: string | null) {
  return target && target.startsWith("/") && !target.startsWith("//") ? target : "/";
}

export function loadSession(request: Request) {
  return resolveSession(readSessionCookie(request));
}

export const authMiddleware: MiddlewareFunction<Response> = async ({ request, context }, next) => {
  const resolved = await loadSession(request);
  if (!resolved) throw redirect(loginPath(request));
  if (resolved.user.mustChangePassword) throw redirect("/change-password");
  context.set(sessionContext, resolved);
  return next();
};
