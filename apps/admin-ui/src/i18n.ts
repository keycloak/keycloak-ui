import i18n, { init, use, InitOptions, ResourceStore } from "i18next";
import HttpBackend, { LoadPathOption } from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import type KeycloakAdminClient from "@keycloak/keycloak-admin-client";

import environment from "./environment";
import { getAuthorizationHeaders } from "./utils/getAuthorizationHeaders";
import { addTrailingSlash } from "./util";

export const DEFAULT_LOCALE = "en";
const OVERRIDES_NS = "overrides";

/**
 * Helper type to define internal operations of ResourceStore, which we have to access.
 */
interface ResourceStoreInternal extends ResourceStore {
  getResource(
    lng: string,
    ns: string,
    key?: any,
    originalOptions?: Pick<InitOptions, "keySeparator" | "ignoreJSONStructure">
  ): any;
}

export async function initI18n(adminClient: KeycloakAdminClient) {
  const options = await initOptions(adminClient);
  await init(options);

  addInterceptorForGetResource();
}

/**
 * Intercept the "getResource" function of the resource store, in order to apply the "overrides" from realm localization.
 *
 * An alternative would be to use a postProcessor, but to make that work, almost all the default processing logic
 * would need to be re-implemented here.
 * Several functionality cannot be easily supported with a postProcessor:
 * <ul>
 *     <li>The key might or might not contain the namespace, thus key parsing would need to be re-implemented.</li>
 *     <li>In case of plurals, the key will not contain the "_one" or "_other" suffix - would need to be re-implemented</li>
 *     <li>For the "overrides", interpolation (replacing placeholders) would need to be applied.</li>
 *     <li>Probably more ...</li>
 * </ul>
 */
function addInterceptorForGetResource() {
  const functionNameGetResource = "getResource";
  const i18nStore = i18n.store as ResourceStoreInternal;
  const originalGetResource = i18nStore[functionNameGetResource];
  const interceptGetResource: any = (
    lng: string,
    ns: string,
    key?: any,
    originalOptions?: Pick<InitOptions, "keySeparator" | "ignoreJSONStructure">
  ) => {
    // key undefined means this is just a check whether a resource bundle exists
    if (key === undefined) {
      return originalGetResource.apply(i18nStore, [lng, ns]);
    }

    const options = originalOptions !== undefined ? originalOptions : {};

    const realmLocalizationKey = ns + ":" + key;
    const override = originalGetResource.apply(i18nStore, [
      lng,
      OVERRIDES_NS,
      realmLocalizationKey,
      options,
    ]);
    if (ns === OVERRIDES_NS) {
      return override;
    }

    return (
      override || originalGetResource.apply(i18nStore, [lng, ns, key, options])
    );
  };
  i18nStore[functionNameGetResource] = interceptGetResource;
}

const initOptions = async (
  adminClient: KeycloakAdminClient
): Promise<InitOptions> => {
  const constructLoadPath: LoadPathOption = (_, namespaces) => {
    if (namespaces[0] === "overrides") {
      return `${addTrailingSlash(adminClient.baseUrl)}admin/realms/${
        adminClient.realmName
      }/localization/{{lng}}`;
    } else {
      return `${environment.resourceUrl}/resources/{{lng}}/{{ns}}.json`;
    }
  };

  return {
    returnNull: false,
    defaultNS: "common",
    fallbackLng: DEFAULT_LOCALE,
    preload: [DEFAULT_LOCALE],
    ns: [
      "common",
      "common-help",
      "dashboard",
      "clients",
      "clients-help",
      "client-scopes",
      "client-scopes-help",
      "groups",
      "realm",
      "roles",
      "users",
      "users-help",
      "sessions",
      "events",
      "realm-settings",
      "realm-settings-help",
      "authentication",
      "authentication-help",
      "user-federation",
      "user-federation-help",
      "identity-providers",
      "identity-providers-help",
      "dynamic",
      OVERRIDES_NS,
    ],
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: constructLoadPath,
      customHeaders: getAuthorizationHeaders(
        await adminClient.getAccessToken()
      ),
    },
  };
};

const configuredI18n = use(initReactI18next).use(HttpBackend);

export default configuredI18n;
