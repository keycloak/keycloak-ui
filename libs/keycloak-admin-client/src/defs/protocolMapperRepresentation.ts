/**
 * https://www.keycloak.org/docs-api/11.0/rest-api/index.html#_protocolmapperrepresentation
 */

import { SSOProtocol } from "./ssoProtocols.js";

export default interface ProtocolMapperRepresentation {
  config?: Record<string, any>;
  id?: string;
  name?: string;
  protocol?: SSOProtocol;
  protocolMapper?: string;
}
