import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("conciliacao", "routes/conciliacao.tsx"),
  route("comprovantes-fat", "routes/comprovantes-fat.tsx"),
  route("api/document/:id", "routes/api.document.$id.tsx"),
  route("api/document/:id/sheet", "routes/api.document.$id.sheet.tsx"),
  route("api/batch-download/:id", "domain/conciliacao/api.batch-download.ts"),
  route("api/pix-download/:date", "domain/pix-adm/api.pix-download.ts"),
  route("api/config", "routes/api.config.ts"),
  route("pix-adm", "routes/pix-adm.tsx"),
] satisfies RouteConfig;
