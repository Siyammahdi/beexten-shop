"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "@/app/admin/actions";

export function SubmitButton({ children, pendingText }: { children: React.ReactNode; pendingText: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 text-sm font-medium text-canvas transition hover:bg-ink/85 disabled:opacity-60"
    >
      {pending ? pendingText : children}
    </button>
  );
}

export function FormError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
      {error}
    </p>
  );
}

export function DeleteButton({
  action,
  name,
  value,
  label,
  confirmText,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  name: string;
  value: string | number;
  label: string;
  confirmText: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
      className="flex flex-col items-end gap-2"
    >
      <input type="hidden" name={name} value={value} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center rounded-full px-5 text-sm font-medium text-red-600 ring-1 ring-inset ring-red-200 transition hover:bg-red-50 disabled:opacity-60"
      >
        {pending ? "Deleting…" : label}
      </button>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
