import type { RouteDef } from "../route-config";
import {
  AuthenticationRoute,
  CreateFlowRoute,
  FlowDetailsRoute,
} from "./routes/Authentication";

const routes: RouteDef[] = [
  AuthenticationRoute,
  CreateFlowRoute,
  FlowDetailsRoute,
];

export default routes;
