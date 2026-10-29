import "server-only";
import { setDefaultAutoSelectFamilyAttemptTimeout } from "node:net";
import { neon } from "@neondatabase/serverless";

// On networks without IPv6, Node's 250ms per-address timeout expires before the
// IPv4 connection to Neon completes, failing every query with ETIMEDOUT.
setDefaultAutoSelectFamilyAttemptTimeout(1000);

export const sql = neon(process.env.DATABASE_URL!);

export function isDbError(error: unknown, code: string) {
  return typeof error === "object" && error !== null && "code" in error && error.code === code;
}

export const UNIQUE_VIOLATION = "23505";
export const FOREIGN_KEY_VIOLATION = "23503";
export const CHECK_VIOLATION = "23514";
