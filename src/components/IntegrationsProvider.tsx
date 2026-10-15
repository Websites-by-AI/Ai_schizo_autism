import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { request, type IntegrationStatus } from "../lib/api";

type IntegrationContext = {
  status: IntegrationStatus | null;
  loading: boolean;
  error: string;
  refresh: () => void;
};

const Context = createContext<IntegrationContext | null>(null);

export function IntegrationsProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<IntegrationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const controller = useRef<AbortController | null>(null);
  const refresh = useCallback(() => {
    controller.current?.abort();
    const next = new AbortController();
    controller.current = next;
    setLoading(true);
    setError("");
    request<IntegrationStatus>("/api/status", { signal: next.signal })
      .then(setStatus)
      .catch((reason: unknown) => {
        if (!next.signal.aborted) setError(reason instanceof Error ? reason.message : "وضعیت سرویس دریافت نشد.");
      })
      .finally(() => { if (!next.signal.aborted) setLoading(false); });
  }, []);
  useEffect(() => {
    refresh();
    return () => controller.current?.abort();
  }, [refresh]);
  return <Context.Provider value={{ status, loading, error, refresh }}>{children}</Context.Provider>;
}

export function useIntegrations() {
  const value = useContext(Context);
  if (!value) throw new Error("useIntegrations requires IntegrationsProvider");
  return value;
}
