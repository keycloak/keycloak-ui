import { parseResponse } from "./parse-response";
import { UserRepresentation } from "./representations";
import { request } from "./request";

export type CallOptions = {
  signal?: AbortSignal;
};

export type PaginationParams = {
  first: number;
  max: number;
};

export async function getPersonalInfo({
  signal,
}: CallOptions = {}): Promise<UserRepresentation> {
  const response = await request("/", { signal });
  return parseResponse<UserRepresentation>(response);
}
