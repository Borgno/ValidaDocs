// Constantes e tipos de usuário usados pelo servidor e pela tela. Fica fora do users.server.ts porque
// o bundle do navegador não pode importar módulo .server.

export type Role = "admin" | "user";
export const ROLE_LABELS: Record<Role, string> = { admin: "Administrador", user: "Usuário" };

export const PAGE_SIZE = 20;

// O que vai para a tela. Nunca inclui o hash da senha nem o sessionVersion.
export type ManagedUser = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  active: boolean;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

export type ListUsersQuery = {
  search?: string;
  role?: Role;
  active?: boolean;
  page: number;
};

export function isRole(value: unknown): value is Role {
  return value === "admin" || value === "user";
}
