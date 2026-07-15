import type { ActionFunctionArgs } from "react-router";
import { themeCookie } from "../services/config.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "setTheme") {
    const theme = formData.get("theme") === "dark" ? "dark" : "light";

    return new Response(null, {
      headers: {
        "Set-Cookie": await themeCookie.serialize(theme),
      },
    });
  }

  return new Response(null, { status: 400 });
}
