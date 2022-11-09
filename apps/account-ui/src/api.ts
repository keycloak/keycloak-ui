import { environment } from "./environment";
import { keycloak } from "./keycloak";
import {
  ClientRepresentation,
  CredentialContainer,
  CredentialRepresentation,
  DeviceRepresentation,
  Permission,
  Resource,
  Scope,
  UserRepresentation,
} from "./representations";
import { joinPath } from "./utils/joinPath";
import parse, { Links } from "./utils/parse-links";

export const fetchPersonalInfo = (params: RequestInit) =>
  request<UserRepresentation>("/", params);

export const savePersonalInfo = (info: UserRepresentation) =>
  request("/", { body: JSON.stringify(info), method: "post" });

export const fetchCredentials = async (
  params: RequestInit
): Promise<CredentialContainer[]> => {
  const response = await request<CredentialContainer[]>("/credentials", params);
  return checkResponse(response);
};

export const deleteCredentials = (credential: CredentialRepresentation) =>
  request("/credentials/" + credential.id, {
    method: "delete",
  });

export const fetchDevices = async (
  params: RequestInit
): Promise<DeviceRepresentation[]> => {
  const response = await request<DeviceRepresentation[]>(
    "/sessions/devices",
    params
  );
  return checkResponse(response);
};

export const deleteSession = (id?: string) =>
  request(`"/sessions${id ? `/${id}` : ""}`, {
    method: "delete",
  });

export const fetchApplications = async (
  params: RequestInit
): Promise<ClientRepresentation[]> => {
  const response = await request<ClientRepresentation[]>(
    "/applications",
    params
  );
  return checkResponse(response);
};

export const deleteConcent = (id: string) =>
  request(`/applications/${id}/consent`, { method: "delete" });

export const fetchResources = async (
  params: RequestInit,
  requestParams: Record<string, string>,
  shared: boolean | undefined = false
): Promise<{ data: Resource[]; links: Links }> => {
  const response = await get(
    `/resources${shared ? "/shared-with-me?" : "?"}${new URLSearchParams(
      requestParams
    )}`,
    params
  );

  return {
    data: checkResponse(await response.json()),
    links: parse(response.headers.get("link")),
  };
};

export const fetchRequest = async (
  params: RequestInit,
  resourceId: string,
  pending: boolean | undefined = false
): Promise<Permission[]> => {
  const response = await request<Permission[]>(
    `/resources/${resourceId}/permissions/${pending ? "pending-" : ""}requests`,
    params
  );

  return checkResponse(response);
};

export const fetchPermission = async (
  params: RequestInit,
  resourceId: string
): Promise<Permission[]> => {
  const response = await request<Permission[]>(
    `/resources/${resourceId}/permissions`,
    params
  );
  return checkResponse(response);
};

export const updateRequest = (
  resourceId: string,
  username: string,
  scopes: Scope[] | string[]
) =>
  request(`/resources/${resourceId}/permissions`, {
    method: "put",
    body: JSON.stringify([{ username, scopes }]),
  });

export const updatePermissions = (
  resourceId: string,
  permissions: Permission[]
) =>
  request(`/resources/${resourceId}/permissions`, {
    method: "put",
    body: JSON.stringify(permissions),
  });

export const findUser = (resourceId: string, username: string) =>
  request<string>(`/resources/${resourceId}/user?value=${username}`, {
    method: "get",
  });

function checkResponse<T>(response: T) {
  if (!response) throw new Error("Could not fetch");
  return response;
}

async function get(path: string, params: RequestInit): Promise<Response> {
  const url = joinPath(
    environment.authServerUrl,
    "realms",
    environment.loginRealm,
    "account",
    path
  );

  const response = await fetch(url, {
    ...params,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAccessToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response;
}

async function request<T>(
  path: string,
  params: RequestInit
): Promise<T | undefined> {
  const response = await get(path, params);
  if (response.status !== 204) return response.json();
}

async function getAccessToken() {
  try {
    await keycloak.updateToken(5);
  } catch (error) {
    keycloak.login();
  }

  return keycloak.token;
}
