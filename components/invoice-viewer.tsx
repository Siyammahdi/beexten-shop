"use client";

import { InvoicePrintButton } from "./invoice-print-button";

export function InvoiceViewer({ html }: { html: string }) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <div className="invoice-toolbar mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">Saved invoice for this order.</p>
        <InvoicePrintButton />
      </div>
      <div className="invoice-shell rounded-3xl border border-line bg-white p-8 shadow-sm print:border-0 print:p-0 print:shadow-none">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
