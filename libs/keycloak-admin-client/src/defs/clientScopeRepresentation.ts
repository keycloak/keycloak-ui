/**
 * https://www.keycloak.org/docs-api/11.0/rest-api/index.html#_clientscoperepresentation
 */
import type ProtocolMapperRepresentation from "./protocolMapperRepresentation.js";
import { SSOProtocol } from "./ssoProtocols.js";

export default interface ClientScopeRepresentation {
  attributes?: Record<string, any>;
  description?: string;
  id?: string;
  name?: string;
  protocol?: SSOProtocol;
  protocolMappers?: ProtocolMapperRepresentation[];
}

/**
 * This interace is used to cover the create function of ClientScope.
 * Cause UPDATET should be just send the modifyed data, protocol could not be mandatory in that case!
 */
export interface ClientScopeCreateRepresentation
  extends ClientScopeRepresentation {
  protocol: SSOProtocol;
  name: string;
}
