import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, tokenStore } from "@/lib/api";
import { login, me, setAuthToken, normalizeRoles } from "@tapestry/api-client";

export function useLogout() {
  const qc = useQueryClient();

  return () => {
    tokenStore.clear();
    setAuthToken(api, null);

    // Clear cached user so AuthGate flips immediately
    qc.removeQueries({ queryKey: ["me"], exact: true });
  };
}
// auth-hooks.ts
export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const token = tokenStore.get();
      if (!token) return null;          // <- no token: no request, not an error
      return me(api);                   // <- token: hit /auth/me
    },
    retry: false,
    staleTime: 60_000
  });
}
export function useLogin() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const res = await login(api, input.email, input.password);
      console.log(res);
      tokenStore.set(res.token);
      setAuthToken(api, res.token);
      return res;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function logout() {
  tokenStore.clear();
  setAuthToken(api, null);
}
