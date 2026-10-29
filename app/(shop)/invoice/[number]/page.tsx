import { Suspense } from "react";
import { notFound } from "next/navigation";
import { InvoiceViewer } from "@/components/invoice-viewer";
import { getInvoiceForNumber } from "@/lib/order-invoice";

export default function CustomerInvoicePage({
  params,
  searchParams,
}: PageProps<"/invoice/[number]">) {
  return (
    <Suspense fallback={<div className="mx-auto h-96 max-w-3xl animate-pulse rounded-3xl bg-well px-5 py-10 sm:px-8" />}>
      <Invoice params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Invoice({
  params,
  searchParams,
}: Pick<PageProps<"/invoice/[number]">, "params" | "searchParams">) {
  const { number } = await params;
  const rawEmail = (await searchParams).email;
  const email = typeof rawEmail === "string" ? rawEmail : rawEmail?.[0];
  const html = await getInvoiceForNumber(number, email);
  if (!html) notFound();

  return <InvoiceViewer html={html} />;
}
