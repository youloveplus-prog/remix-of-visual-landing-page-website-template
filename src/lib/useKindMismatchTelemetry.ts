import { useEffect, useRef } from "react";
import {
  logKindMismatchRedirect,
  type AnyContentKind,
  type DetailRoute,
} from "./contentRouting";

/**
 * Fires exactly one `kind-mismatch-redirect` telemetry event per navigation
 * (i.e. per unique `slug` + `to` pair). Safe to call unconditionally on
 * every render — internal ref dedupes StrictMode double-invokes and any
 * re-renders that happen before <Navigate> unmounts the page.
 */
export function useKindMismatchTelemetry(
  from: DetailRoute,
  to: string | null,
  kind: AnyContentKind | null | undefined,
  slug: string,
): void {
  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!to || !kind || !slug) return;
    const key = `${from}|${slug}|${to}`;
    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;
    logKindMismatchRedirect({ from, to, kind, slug });
  }, [from, to, kind, slug]);
}
