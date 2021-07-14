export type Environment = {
  /** The realm which should be used when signing into the application. */
  loginRealm: string;
  /** The URL to the root of the auth server. */
  authServerUrl: string;
  /** The URL to the path of the auth server where client requests can be sent. */
  authUrl: string;
  consoleBaseUrl: string;
  resourceUrl: string;
  /** The name of the master realm. */
  masterRealm: string;
  /** The version number of the auth sever (e.g. 14.0.0). */
  resourceVersion: string;
  /** Indicates if the application is running as a Keycloak theme. */
  isRunningAsTheme: boolean;
};

// TODO: See if we can drop this by switching away from hash based routing.
const realm =
  new URLSearchParams(window.location.search).get("realm") ?? "master";

// The default environment, used during development.
const defaultEnvironment: Environment = {
  loginRealm: realm,
  authServerUrl: "TODO",
  authUrl: "http://localhost:8180/auth",
  consoleBaseUrl: "TODO",
  resourceUrl: ".",
  masterRealm: "master",
  resourceVersion: "TODO",
  isRunningAsTheme: false,
};

const ENV_ELEMENT_ID = "environment";

// Merge the default and injected environment variables together.
const environment: Environment = {
  ...defaultEnvironment,
  ...getInjectedEnvironment(),
  isRunningAsTheme: document.getElementById(ENV_ELEMENT_ID) !== null,
};

export default environment;

/**
 * Extracts the environment variables that are passed if the application is running as a Keycloak theme.
 * These variables are injected by Keycloak into the `index.html` as a script tag, the contents of which can be parsed as JSON.
 */
function getInjectedEnvironment(): Record<string, string | number | boolean> {
  const element = document.getElementById(ENV_ELEMENT_ID);

  // If the element cannot be found, return an empty record.
  if (!element?.textContent) {
    return {};
  }

  // Attempt to parse the contents as JSON and return its value.
  try {
    return JSON.parse(element.textContent);
  } catch (error) {
    console.error("Unable to parse environment variables.");
  }

  // Otherwise, return an empty record.
  return {};
}
