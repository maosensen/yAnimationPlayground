import { z } from "zod";

/**
 * Zod-validated environment variables — the single place `process.env` is
 * read. Import `env` from here everywhere else; never touch `process.env`
 * directly in app code.
 *
 * Validation runs on first import. `next.config.ts` imports this module so a
 * bad or missing variable fails the build / dev startup immediately instead
 * of surfacing as a runtime bug.
 *
 * Adding a variable:
 * 1. Add it to the right schema below (server / client / shared).
 * 2. List it in `runtimeEnv` — Next.js only inlines `NEXT_PUBLIC_*` vars
 *    referenced as literal `process.env.X`, so this map must stay explicit.
 * 3. Document it in `.env.example`.
 */

/** Server-only variables — never exposed to the browser bundle. */
const serverSchema = z.object({
  /** pino log level override; defaults are handled in `@/lib/logger`. */
  LOG_LEVEL: z
    .enum(["trace", "debug", "info", "warn", "error", "fatal"])
    .optional(),
});

/** Client-safe variables — must be prefixed with `NEXT_PUBLIC_`. */
const clientSchema = z.object({
  /** Absolute site origin, used for metadata and absolute links. */
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:4394"),
});

/** Available on both server and client (inlined by Next.js). */
const sharedSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const runtimeEnv = {
  LOG_LEVEL: process.env.LOG_LEVEL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NODE_ENV: process.env.NODE_ENV,
};

const isServer = typeof window === "undefined";

const schema = isServer
  ? serverSchema.extend(clientSchema.shape).extend(sharedSchema.shape)
  : clientSchema.extend(sharedSchema.shape);

const parsed = schema.safeParse(runtimeEnv);

if (!parsed.success) {
  // The logger depends on this module, so plain output is all we have here.
  throw new Error(
    `Invalid environment variables:\n${z.prettifyError(parsed.error)}`,
  );
}

type Env = z.infer<typeof serverSchema> &
  z.infer<typeof clientSchema> &
  z.infer<typeof sharedSchema>;

/**
 * Server-only vars are absent from the client bundle; the proxy turns an
 * accidental client-side read into a loud error instead of a silent
 * `undefined`.
 */
export const env = new Proxy(parsed.data as Env, {
  get(target, prop) {
    if (typeof prop !== "string") return undefined;
    if (
      !isServer &&
      !(prop in clientSchema.shape) &&
      !(prop in sharedSchema.shape)
    ) {
      throw new Error(
        `Attempted to access server-only environment variable "${prop}" on the client`,
      );
    }
    return Reflect.get(target, prop);
  },
});
