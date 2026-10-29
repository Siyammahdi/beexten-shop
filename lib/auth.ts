import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

export const SESSION_COOKIE = "beexten_admin";
const MAX_AGE = 60 * 60 * 24 * 7;

function sign(value: string) {
  return createHmac("sha256", process.env.SESSION_SECRET!).update(value).digest("base64url");
}

function sameDigest(a: string, b: string) {
  const digest = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(digest(a), digest(b));
}

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && sameDigest(input, expected!);
}

export async function createSession() {
  const expires = String(Date.now() + MAX_AGE * 1000);
  (await cookies()).set(SESSION_COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAdmin() {
  await connection();
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!value) return false;
  const [expires, signature = ""] = value.split(".");
  return sameDigest(signature, sign(expires)) && Number(expires) > Date.now();
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
