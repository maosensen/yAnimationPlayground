import { isServer, QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Treat data as fresh for 60s — tune per-query as needed
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserClient: QueryClient | undefined;

/**
 * Returns a QueryClient that is:
 * - A fresh instance on every server request (to avoid cross-request leaks)
 * - A single shared instance in the browser (so cache survives navigation)
 *
 * See: https://tanstack.com/query/latest/docs/framework/react/guides/ssr
 */
export function getQueryClient() {
  if (isServer) return makeQueryClient();
  if (!browserClient) browserClient = makeQueryClient();
  return browserClient;
}
