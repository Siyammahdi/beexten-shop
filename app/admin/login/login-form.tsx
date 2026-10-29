"use client";

import { useActionState } from "react";
import { login } from "../actions";
import { FormError, SubmitButton } from "@/components/admin/forms";
import { inputClass } from "@/components/admin/ui";

export function LoginForm() {
  const [state, formAction] = useActionState(login, {});

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <FormError error={state.error} />
      <label className="block">
        <span className="text-sm text-muted">Password</span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          className={inputClass}
        />
      </label>
      <div className="[&>button]:w-full">
        <SubmitButton pendingText="Signing in…">Sign in</SubmitButton>
      </div>
    </form>
  );
}
