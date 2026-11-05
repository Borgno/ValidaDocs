import { KeyRound, Loader2, Lock } from "lucide-react";
import { Form, redirect, useActionData, useNavigation } from "react-router";
import { AuthAlert, AuthCard, AuthField, PasswordInput } from "../components/AuthCard";
import { loadSession, loginPath } from "../middleware/auth.server";
import { AuthError, changeOwnPassword } from "../services/auth/auth.server";
import { sessionCookieHeader } from "../services/auth/session.server";
import type { Route } from "./+types/change-password";

export const meta: Route.MetaFunction = () => [{ title: "Trocar senha | ValidaDocs" }];

// Tela da troca obrigatória, depois do primeiro login com a senha inicial.
async function requirePendingChange(request: Request) {
  const resolved = await loadSession(request);
  if (!resolved) throw redirect(loginPath(request));
  if (!resolved.user.mustChangePassword) throw redirect("/");
  return resolved;
}

export async function loader({ request }: Route.LoaderArgs) {
  await requirePendingChange(request);
  return null;
}

type ActionResult = { error?: string; field?: "currentPassword" | "newPassword" | "confirmPassword" };

export async function action({ request }: Route.ActionArgs): Promise<ActionResult | Response> {
  const { user, session } = await requirePendingChange(request);
  const form = await request.formData();
  const currentPassword = String(form.get("currentPassword") ?? "");
  const newPassword = String(form.get("newPassword") ?? "");
  if (newPassword !== String(form.get("confirmPassword") ?? "")) {
    return { error: "As senhas não conferem.", field: "confirmPassword" };
  }

  try {
    const token = await changeOwnPassword(user.id, session.id, { currentPassword, newPassword });
    return redirect("/", { headers: { "Set-Cookie": sessionCookieHeader(token) } });
  } catch (error) {
    if (error instanceof AuthError) {
      const field = error.message.startsWith("Senha atual") ? "currentPassword" : "newPassword";
      return { error: error.message, field };
    }
    throw error;
  }
}

export default function ChangePassword() {
  const actionData = useActionData<ActionResult>();
  const navigation = useNavigation();
  const pending = navigation.state !== "idle" && navigation.formMethod === "POST";
  const fieldError = (field: ActionResult["field"]) =>
    actionData?.field === field ? actionData?.error : undefined;

  return (
    <AuthCard subtitle="Primeiro acesso. Escolha uma nova senha para continuar.">
      <Form method="post" className="space-y-6" noValidate>
        <AuthField id="currentPassword" label="Senha atual" icon={Lock} error={fieldError("currentPassword")}>
          <PasswordInput id="currentPassword" name="currentPassword" autoComplete="current-password" />
        </AuthField>

        <AuthField id="newPassword" label="Nova senha" icon={KeyRound} error={fieldError("newPassword")}>
          <PasswordInput id="newPassword" name="newPassword" autoComplete="new-password" />
        </AuthField>

        <AuthField id="confirmPassword" label="Confirme a nova senha" icon={KeyRound} error={fieldError("confirmPassword")}>
          <PasswordInput id="confirmPassword" name="confirmPassword" autoComplete="new-password" />
        </AuthField>

        {actionData?.error && !actionData.field && <AuthAlert>{actionData.error}</AuthAlert>}

        <button
          type="submit"
          disabled={pending}
          className="flex h-14 w-full items-center justify-center rounded-3xl bg-primary text-sm font-bold tracking-widest text-white uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? <Loader2 className="animate-spin" size={20} strokeWidth={3} /> : "Salvar nova senha"}
        </button>
      </Form>
    </AuthCard>
  );
}
