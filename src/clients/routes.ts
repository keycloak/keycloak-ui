import type { RouteConfig } from "../routes";
import { AddClientRoute } from "./routes/AddClient";
import { ClientRoute } from "./routes/Client";
import { ClientsRoute } from "./routes/Clients";
import { CreateInitialAccessTokenRoute } from "./routes/CreateInitialAccessToken";
import { ImportClientRoute } from "./routes/ImportClient";

const routes: RouteConfig[] = [
  AddClientRoute,
  ClientRoute,
  ClientsRoute,
  CreateInitialAccessTokenRoute,
  ImportClientRoute,
];

export default routes;
