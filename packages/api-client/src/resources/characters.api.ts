import type { AxiosInstance } from "axios";
import { ApiListResponse, ListQueryParams, cleanParams } from "../list";

// Characters
export async function listCharacters<T>(api: AxiosInstance, params: ListQueryParams = {}): Promise<ApiListResponse<T>> {
  const res = await api.get("/game/characters", { params: cleanParams(params) });
  return res.data;
}
