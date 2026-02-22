export type StorageKind = "local" | "session";

export function createTokenStore(key: string, kind: StorageKind = "local") {
  const getStore = () => (kind === "local" ? window.localStorage : window.sessionStorage);

  return {
    get(): string | null {
      if (typeof window === "undefined") return null;
      return getStore().getItem(key);
    },
    set(token: string) {
      if (typeof window === "undefined") return;
      getStore().setItem(key, token);
    },
    clear() {
      if (typeof window === "undefined") return;
      getStore().removeItem(key);
    },
  };
}
