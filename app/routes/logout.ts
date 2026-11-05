import { redirect } from "react-router";
import { clearSessionCookieHeader } from "../services/auth/session.server";

// A sessão não tem estado no servidor: sair é apagar o cookie.
export function action() {
  return redirect("/login", { headers: { "Set-Cookie": clearSessionCookieHeader() } });
}

export function loader() {
  return redirect("/");
}
