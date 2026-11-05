import type { User } from "@prisma/client";
import { prisma } from "../db.server";
import { recordFailure, recordSuccess, retryAfterSeconds } from "./loginThrottle.server";
import { getDummyHash, hashPassword, verifyPassword } from "./password.server";
import { createSessionToken, readSessionToken, type Session } from "./session.server";

// O que vai para a tela. Nunca inclui o hash da senha nem o sessionVersion.
export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  mustChangePassword: boolean;
};

function toSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
  };
}

export class AuthError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

// O login é o nome de usuário (a parte antes do "@") ou o e-mail completo. Se o mesmo nome existe em
// domínios diferentes, a busca por nome falha para não entrar na conta errada.
async function findUserByLogin(login: string) {
  const normalized = normalizeEmail(login);
  if (normalized.includes("@")) return prisma.user.findUnique({ where: { email: normalized } });
  const matches = await prisma.user.findMany({
    where: { email: { startsWith: `${normalized}@` } },
    take: 2,
  });
  return matches.length === 1 ? matches[0] : null;
}

export async function login(input: { email: string; password: string; ip: string }) {
  const email = normalizeEmail(input.email);

  const retryAfter = retryAfterSeconds(email, input.ip);
  if (retryAfter !== null) {
    throw new AuthError(429, "Muitas tentativas. Tente de novo mais tarde.");
  }

  const user = await findUserByLogin(email);
  // Login inexistente também paga o custo do bcrypt: a resposta leva o mesmo tempo nos dois casos.
  const valid = await verifyPassword(input.password, user?.passwordHash ?? (await getDummyHash()));

  if (!user || !valid) {
    recordFailure(email, input.ip);
    throw new AuthError(401, "Usuário ou senha incorretos.");
  }

  recordSuccess(email);

  // Só quem acertou a senha descobre que a conta está desativada.
  if (!user.active) throw new AuthError(403, "Este usuário está desativado.");

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  return { user: toSessionUser(user), token: createSessionToken(user.id, user.sessionVersion) };
}

// Usuário e sessão do cookie, ou null se o token é inválido, o usuário sumiu, foi desativado ou trocou
// a senha depois deste login (sessionVersion mudou).
export async function resolveSession(
  token: string | undefined,
): Promise<{ user: SessionUser; session: Session } | null> {
  const session = readSessionToken(token);
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || !user.active || user.sessionVersion !== session.version) return null;
  return { user: toSessionUser(user), session };
}

// Troca da própria senha. Derruba as outras sessões e devolve o token novo desta.
export async function changeOwnPassword(
  userId: string,
  sessionId: string,
  input: { currentPassword: string; newPassword: string },
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AuthError(404, "Usuário não encontrado.");
  if (!(await verifyPassword(input.currentPassword, user.passwordHash))) {
    throw new AuthError(400, "Senha atual incorreta.");
  }
  if (input.newPassword.length < 8) {
    throw new AuthError(400, "A nova senha precisa ter ao menos 8 caracteres.");
  }
  if (input.newPassword === input.currentPassword) {
    throw new AuthError(400, "A nova senha precisa ser diferente da atual.");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash: await hashPassword(input.newPassword),
      mustChangePassword: false,
      sessionVersion: { increment: 1 },
    },
  });
  return createSessionToken(updated.id, updated.sessionVersion, Date.now(), sessionId);
}
