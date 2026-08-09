import pino from "pino";
import { env } from "@/lib/env";

const isDev = env.NODE_ENV !== "production";
const isBrowser = typeof window !== "undefined";

/**
 * Shared logger instance.
 *
 * - Server + dev: pretty-printed via pino-pretty
 * - Server + prod: structured JSON (pipe to your log aggregator)
 * - Browser: structured object logs to console
 *
 * Override the level with the `LOG_LEVEL` env var.
 */
export const logger = pino({
  level: (isBrowser ? undefined : env.LOG_LEVEL) ?? (isDev ? "debug" : "info"),
  ...(isDev && !isBrowser
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss.l",
            ignore: "pid,hostname",
          },
        },
      }
    : {}),
  browser: {
    asObject: true,
  },
});
