import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteDef } from "../../route-config";
import { AddMapper } from "../add/AddMapper";

export type AddIdentityProviderMapperTabParams = {
  realm: string;
  providerId: string;
  alias: string;
};

export const IdentityProviderAddMapperRoute: RouteDef = {
  path: "/:realm/identity-providers/:providerId/:alias/mappers/create",
  component: AddMapper,
  access: "manage-identity-providers",
};

export const toIdentityProviderAddMapper = (
  params: AddIdentityProviderMapperTabParams
): LocationDescriptorObject => ({
  pathname: generatePath(IdentityProviderAddMapperRoute.path, params),
});
