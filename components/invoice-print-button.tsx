"use client";

export function InvoicePrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm font-medium text-canvas transition hover:bg-ink/85"
    >
      Print / save PDF
    </button>
  );
}
