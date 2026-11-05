import { ArrowRight, Loader2, Lock, User as UserIcon } from "lucide-react";
import { Form, redirect, useActionData, useNavigation } from "react-router";
import { AuthAlert, AuthCard, AuthField, PasswordInput, authInputClass } from "../components/AuthCard";
import { loadSession, safeRedirect } from "../middleware/auth.server";
import { AuthError, login } from "../services/auth/auth.server";
import { sessionCookieHeader } from "../services/auth/session.server";
import type { Route } from "./+types/login";

export const meta: Route.MetaFunction = () => [{ title: "Entrar | ValidaDocs" }];

// Quem já tem sessão não precisa ver o login.
export async function loader({ request }: Route.LoaderArgs) {
  const resolved = await loadSession(request);
  if (resolved) throw redirect(resolved.user.mustChangePassword ? "/change-password" : "/");
  return null;
}

// Atrás do proxy do Dokploy o IP real vem no X-Forwarded-For.
function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Informe usuário e senha.", email };

  try {
    const { user, token } = await login({ email, password, ip: clientIp(request) });
    const target = user.mustChangePassword
      ? "/change-password"
      : safeRedirect(new URL(request.url).searchParams.get("redirectTo"));
    return redirect(target, { headers: { "Set-Cookie": sessionCookieHeader(token) } });
  } catch (error) {
    if (error instanceof AuthError) return { error: error.message, email };
    throw error;
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const pending = navigation.state !== "idle" && navigation.formMethod === "POST";

  return (
    <AuthCard subtitle="Validação e conciliação de documentos">
      <Form method="post" className="space-y-6" noValidate>
        <AuthField id="email" label="Usuário" icon={UserIcon}>
          <input
            id="email"
            name="email"
            // O login é o nome antes do "@" ou o e-mail inteiro; o servidor resolve os dois.
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            autoComplete="username"
            placeholder="seu.nome"
            required
            defaultValue={actionData?.email}
            className={authInputClass}
          />
        </AuthField>

        <AuthField id="password" label="Senha" icon={Lock}>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
        </AuthField>

        {actionData?.error && <AuthAlert>{actionData.error}</AuthAlert>}

        <button
          type="submit"
          disabled={pending}
          className="group flex h-14 w-full items-center justify-center gap-2 rounded-3xl bg-primary text-sm font-bold tracking-widest text-white uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="animate-spin" size={20} strokeWidth={3} aria-label="Entrando" />
          ) : (
            <>
              <span>Entrar</span>
              <ArrowRight
                size={18}
                strokeWidth={3}
                className="transition-transform group-hover:translate-x-1"
              />
            </>
          )}
        </button>
      </Form>
    </AuthCard>
  );
}
