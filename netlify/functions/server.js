import { createRequestHandler } from "react-router";

export const handler = createRequestHandler(
  () => import("../../build/server/index.js"),
  "production"
);

export default handler;