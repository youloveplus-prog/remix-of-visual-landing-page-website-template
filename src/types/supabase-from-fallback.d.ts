import "@supabase/supabase-js";

declare module "@supabase/supabase-js" {
  interface SupabaseClient {
    /**
     * The runtime client accepts any exposed table/view name. This fallback keeps
     * app code type-checking when the generated schema temporarily contains no
     * public tables after a backend restore/revert.
     */
    from(relation: string): any;
  }
}