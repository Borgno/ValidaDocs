import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

// Mesmo formato do ModuloDefault. Sessão sem estado no servidor: o cookie carrega { sub, sid, ver, exp }
// assinado por HMAC. Role e status são lidos do usuário a cada request, então desativar vale na hora.
// "ver" é o sessionVersion do usuário: trocar a senha incrementa e derruba as sessões antigas.

export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

type SessionPayload = { sub: string; sid: string; ver: number; exp: number };
export type Session = { id: string; userId: string; version: number; expiresAt: Date };

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("SESSION_SECRET ausente ou curta (use ao menos 32 caracteres).");
  }
  return value;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

// Sem `sessionId`, é um login novo. Com ele, reemite o token da mesma sessão (troca da própria senha).
export function createSessionToken(
  userId: string,
  version: number,
  now = Date.now(),
  sessionId: string = randomUUID(),
) {
  const payload: SessionPayload = {
    sub: userId,
    sid: sessionId,
    ver: version,
    exp: Math.floor(now / 1000) + SESSION_MAX_AGE_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

// Devolve a sessão, ou null para token ausente, adulterado ou vencido.
export function readSessionToken(token: string | undefined, now = Date.now()): Session | null {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = Buffer.from(sign(encoded));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (
      typeof payload.sub !== "string" ||
      typeof payload.sid !== "string" ||
      typeof payload.ver !== "number" ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }
    if (payload.exp < Math.floor(now / 1000)) return null;
    return {
      id: payload.sid,
      userId: payload.sub,
      version: payload.ver,
      expiresAt: new Date(payload.exp * 1000),
    };
  } catch {
    return null;
  }
}

const cookieAttributes = () =>
  ["Path=/", "HttpOnly", "SameSite=Lax", process.env.NODE_ENV === "production" ? "Secure" : null]
    .filter(Boolean)
    .join("; ");

export function sessionCookieHeader(token: string) {
  return `${SESSION_COOKIE}=${token}; Max-Age=${SESSION_MAX_AGE_SECONDS}; ${cookieAttributes()}`;
}

export function clearSessionCookieHeader() {
  return `${SESSION_COOKIE}=; Max-Age=0; ${cookieAttributes()}`;
}

export function readSessionCookie(request: Request) {
  const header = request.headers.get("Cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === SESSION_COOKIE) return rest.join("=");
  }
  return undefined;
}
