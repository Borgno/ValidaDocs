import { adminMiddleware, getSessionUser } from "../middleware/auth.server";
import { AuthError } from "../services/auth/auth.server";
import {
  UserFieldError,
  createUser,
  listParamsFrom,
  listUsers,
  resetPassword,
  updateUser,
} from "../services/users/users.server";
import { UsersView, type UsersActionResult } from "../views/UsersView";
import type { Route } from "./+types/usuarios";

export const meta: Route.MetaFunction = () => [{ title: "Usuários | ValidaDocs" }];

export const middleware: Route.MiddlewareFunction[] = [adminMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
  const params = listParamsFrom(new URL(request.url).searchParams);
  const { users, total } = await listUsers(params);
  return { users, total, params, currentUserId: getSessionUser(context).id };
}

export async function action({ request, context }: Route.ActionArgs): Promise<UsersActionResult> {
  const actor = getSessionUser(context);
  const form = await request.formData();
  const intent = String(form.get("intent") ?? "");
  const id = String(form.get("id") ?? "");

  try {
    switch (intent) {
      case "create": {
        const user = await createUser({
          email: String(form.get("email") ?? ""),
          fullName: String(form.get("fullName") ?? ""),
          role: String(form.get("role") ?? ""),
          password: String(form.get("password") ?? ""),
        });
        return { intent, ok: true, message: `${user.fullName} troca a senha no primeiro acesso.` };
      }
      case "update": {
        const role = form.get("role");
        await updateUser(actor.id, id, {
          fullName: String(form.get("fullName") ?? ""),
          // O select fica desabilitado para o próprio admin e não vai no form.
          ...(role !== null && { role: String(role) }),
        });
        return { intent, ok: true, message: "Alterações salvas." };
      }
      case "setActive": {
        const active = form.get("active") === "true";
        await updateUser(actor.id, id, { active });
        return { intent, ok: true, message: active ? "Usuário reativado." : "Usuário desativado." };
      }
      case "resetPassword": {
        const temporaryPassword = await resetPassword(id);
        return { intent, ok: true, temporaryPassword };
      }
      default:
        return { intent, ok: false, error: "Ação desconhecida." };
    }
  } catch (error) {
    if (error instanceof UserFieldError) {
      return { intent, ok: false, error: error.message, field: error.field };
    }
    if (error instanceof AuthError) return { intent, ok: false, error: error.message };
    throw error;
  }
}

export default function Route({ loaderData }: Route.ComponentProps) {
  return <UsersView {...loaderData} />;
}
