import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteDef } from "../../route-config";
import { AddMapper } from "../add/AddMapper";

export type IdentityProviderTab = "mappers";

export type AddIdentityProviderMapperTabParams = {
  realm: string;
  id?: string;
  tab?: IdentityProviderTab;
  alias?: string;
  providerId?: string;
};

export const IdentityProviderAddMapperRoute: RouteDef = {
  path: "/:realm/identity-providers/:providerId/:alias/mappers/create",
  component: AddMapper,
  access: "manage-identity-providers",
};

export const toAddIdentityProviderMapperTab = (
  params: AddIdentityProviderMapperTabParams
): LocationDescriptorObject => ({
  pathname: generatePath(IdentityProviderAddMapperRoute.path, params),
});
