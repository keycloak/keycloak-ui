/**
 * Based upon the keycloak documentation could be found here
 * https://www.keycloak.org/docs/latest/server_admin/#sso-protocols
 * or here
 * https://wjw465150.gitbooks.io/keycloak-documentation/content/server_admin/topics/sso-protocols.html
 * there are actually three different SSO Protocols named and implemented
 */
export const SSOProtocol = {
  "openid-connect": "openid-connect",
  saml: "saml",
  "docker-v2": "docker-v2",
};

/**
 * This 'complex' reconstruction of type by keyof typeof is actually equal to
 * export type SSOProtocol = "openid-connect" | "saml" | "docker-v2";
 * In case SSO Protocol will be modified, you do not have to touch this type configuration by using this setup.
 * This is inline with the TypeScript concept by replaceing an enum with an const object:
 * Object vs. Enums - https://www.typescriptlang.org/docs/handbook/enums.html#objects-vs-enums
 */
export type SSOProtocol = typeof SSOProtocol[keyof typeof SSOProtocol];
