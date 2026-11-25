import { randomBytes } from "node:crypto";
import type { Prisma, User } from "@prisma/client";
import { prisma } from "../db.server";
import { AuthError, normalizeEmail } from "../auth/auth.server";
import { hashPassword } from "../auth/password.server";
import {
  PAGE_SIZE,
  isRole,
  type ListUsersQuery,
  type ManagedUser,
  type Role,
} from "./users.shared";

// Gestão de usuários pelo admin. Regras vindas do ModuloDefault (server/services/users): o admin não
// tira o próprio acesso, desativar e resetar a senha derrubam as sessões abertas, e a senha temporária
// só aparece uma vez. O ValidaDocs não tem tabela de auditoria, então o histórico do Default ficou de fora.

function toManagedUser(user: User): ManagedUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role === "admin" ? "admin" : "user",
    active: user.active,
    mustChangePassword: user.mustChangePassword,
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
  };
}

// Erro de validação com o campo, para a tela mostrar embaixo do input certo.
export class UserFieldError extends AuthError {
  constructor(
    public field: string,
    message: string,
  ) {
    super(422, message);
  }
}

function validateFullName(value: string) {
  const fullName = value.trim();
  if (!fullName) throw new UserFieldError("fullName", "Informe o nome.");
  if (fullName.length > 120) throw new UserFieldError("fullName", "Use no máximo 120 caracteres.");
  return fullName;
}

// O bcrypt ignora o que passa de 72 bytes: o limite é em bytes para acento não estourar.
function validatePassword(value: string) {
  if (value.length < 8) throw new UserFieldError("password", "Use ao menos 8 caracteres.");
  if (new TextEncoder().encode(value).length > 72) {
    throw new UserFieldError("password", "Use no máximo 72 caracteres.");
  }
  return value;
}

function validateEmail(value: string) {
  const email = normalizeEmail(value);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new UserFieldError("email", "Informe um e-mail válido.");
  }
  return email;
}

// --- Lista ----------------------------------------------------------------------------------

export function listParamsFrom(searchParams: URLSearchParams): ListUsersQuery {
  const role = searchParams.get("role");
  const active = searchParams.get("active");
  const page = Number(searchParams.get("page"));
  return {
    search: searchParams.get("q")?.trim() || undefined,
    role: isRole(role) ? role : undefined,
    active: active === "true" ? true : active === "false" ? false : undefined,
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

export async function listUsers(query: ListUsersQuery) {
  const where: Prisma.UserWhereInput = {
    ...(query.role && { role: query.role }),
    ...(query.active !== undefined && { active: query.active }),
    ...(query.search && {
      OR: [
        { fullName: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
      ],
    }),
  };
  const [rows, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: [{ fullName: "asc" }, { email: "asc" }],
      skip: (query.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.user.count({ where }),
  ]);
  return { users: rows.map(toManagedUser), total };
}

async function getUserRecord(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AuthError(404, "Usuário não encontrado.");
  return user;
}

// --- Escrita --------------------------------------------------------------------------------

// O usuário criado entra com a senha definida pelo admin e troca no primeiro login.
export async function createUser(input: {
  email: string;
  fullName: string;
  role: string;
  password: string;
}) {
  const email = validateEmail(input.email);
  const fullName = validateFullName(input.fullName);
  if (!isRole(input.role)) throw new UserFieldError("role", "Escolha um cargo.");
  const password = validatePassword(input.password);

  if (await prisma.user.findUnique({ where: { email } })) {
    throw new UserFieldError("email", "Já existe um usuário com este e-mail.");
  }
  const user = await prisma.user.create({
    data: {
      email,
      fullName,
      role: input.role,
      passwordHash: await hashPassword(password),
      mustChangePassword: true,
    },
  });
  return toManagedUser(user);
}

export async function updateUser(
  actorId: string,
  id: string,
  patch: { fullName?: string; role?: string; active?: boolean },
) {
  const before = await getUserRecord(id);
  if (patch.role !== undefined && !isRole(patch.role)) {
    throw new UserFieldError("role", "Escolha um cargo.");
  }
  const losesAdmin =
    before.role === "admin" &&
    before.active &&
    ((patch.role !== undefined && patch.role !== "admin") || patch.active === false);

  // O admin não tira o próprio acesso: sem essa trava, um clique errado tranca a pessoa para fora.
  // Isso também garante que sempre sobra ao menos um admin ativo: quem chama já é um.
  if (id === actorId && losesAdmin) {
    throw new AuthError(409, "Você não pode desativar nem remover o próprio acesso de admin.");
  }

  const fullName = patch.fullName === undefined ? undefined : validateFullName(patch.fullName);
  const activeChanged = patch.active !== undefined && patch.active !== before.active;

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(fullName !== undefined && { fullName }),
      ...(patch.role !== undefined && { role: patch.role }),
      ...(activeChanged && { active: patch.active }),
      // Desativar derruba as sessões: sem isso, reativar devolveria a vida aos cookies antigos.
      ...(activeChanged && !patch.active && { sessionVersion: { increment: 1 } }),
    },
  });
  return toManagedUser(user);
}

// Senha temporária do reset: 12 caracteres sem os que se confundem (0/O, 1/l/I).
const ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function generateTemporaryPassword() {
  return Array.from(randomBytes(12), (byte) => ALPHABET[byte % ALPHABET.length]).join("");
}

// Obriga a troca no próximo login e derruba as sessões abertas do usuário. A senha é devolvida uma
// única vez: o banco só guarda o hash.
export async function resetPassword(id: string) {
  await getUserRecord(id);
  const temporaryPassword = generateTemporaryPassword();
  await prisma.user.update({
    where: { id },
    data: {
      passwordHash: await hashPassword(temporaryPassword),
      mustChangePassword: true,
      sessionVersion: { increment: 1 },
    },
  });
  return temporaryPassword;
}
