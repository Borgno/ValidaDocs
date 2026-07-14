import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("conciliacao", "routes/conciliacao.tsx"),
  route("comprovantes-fat", "routes/comprovantes-fat.tsx"),
  route("api/document/:id", "routes/api.document.$id.tsx"),
  route("api/document/:id/sheet", "routes/api.document.$id.sheet.tsx"),
  route("api/batch-download/:id", "routes/api.batch-download.$id.tsx"),
] satisfies RouteConfig;
