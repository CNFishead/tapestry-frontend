import type { AxiosInstance } from "axios";
import type { ApiResponse } from "../fetch";
import type { ApiListResponse, ListQueryParams } from "../list";
import { cleanParams } from "../list";
import type { LibraryResourceSummary } from "../../../types/src";

export async function getLibraryResources(api: AxiosInstance, params?: ListQueryParams): Promise<ApiListResponse<LibraryResourceSummary>> {
  const res = await api.get("/library/resources", {
    params: cleanParams(params || {}),
  });
  return res.data;
}

export async function getLibraryResource(api: AxiosInstance, id: string): Promise<ApiResponse<LibraryResourceSummary>> {
  const res = await api.get(`/library/resources/${encodeURIComponent(id)}`);
  return res.data;
}
