import type { RouteDef } from "../route-config";
import { IdentityProviderRoute } from "./routes/IdentityProvider";
import { IdentityProviderKeycloakOidcRoute } from "./routes/IdentityProviderKeycloakOidc";
import { IdentityProviderOidcRoute } from "./routes/IdentityProviderOidc";
import { IdentityProvidersRoute } from "./routes/IdentityProviders";

const routes: RouteDef[] = [
  IdentityProvidersRoute,
  IdentityProviderOidcRoute,
  IdentityProviderKeycloakOidcRoute,
  IdentityProviderRoute,
];

export default routes;
