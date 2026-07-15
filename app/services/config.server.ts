import { createCookie } from "react-router";

export const themeCookie = createCookie("app_theme", {
  maxAge: 31536000, // 1 ano
  sameSite: "lax",
  path: "/",
  secure: process.env.NODE_ENV === "production",
});
