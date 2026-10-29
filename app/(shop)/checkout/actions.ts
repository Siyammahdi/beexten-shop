"use server";

import { randomBytes } from "node:crypto";
import { updateTag } from "next/cache";
import { CHECK_VIOLATION, isDbError, sql } from "@/lib/db";
import { buildInvoiceHtml } from "@/lib/invoice";
import { CATALOG_TAG } from "@/lib/queries";
import { shippingFor } from "@/lib/shop";

export type CheckoutState =
  | { status: "idle" }
  | { status: "error"; message: string; values: Record<string, string> }
  | { status: "success"; number: string; name: string; email: string };

const FIELDS = ["email", "phone", "name", "address", "city", "postal"] as const;

type Item = { slug: string; quantity: number };

function parseItems(raw: FormDataEntryValue | null): Item[] | null {
  try {
    const items = JSON.parse(String(raw));
    const valid =
      Array.isArray(items) &&
      items.length > 0 &&
      items.length <= 50 &&
      items.every(
        (i) =>
          typeof i?.slug === "string" &&
          Number.isInteger(i.quantity) &&
          i.quantity > 0 &&
          i.quantity <= 99,
      );
    return valid ? items : null;
  } catch {
    return null;
  }
}

export async function placeOrder(_: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const values = Object.fromEntries(
    FIELDS.map((f) => [f, String(formData.get(f) ?? "").trim()]),
  ) as Record<(typeof FIELDS)[number], string>;
  const fail = (message: string): CheckoutState => ({ status: "error", message, values });

  if (FIELDS.some((f) => !values[f])) return fail("Please fill in all fields.");
  if (!/^\S+@\S+\.\S+$/.test(values.email)) return fail("Please enter a valid email address.");

  const items = parseItems(formData.get("items"));
  if (!items) return fail("Your cart is empty.");

  type Row = { id: number; slug: string; name: string; image: string; price: number; stock: number };
  const products = (await sql`
    select id, slug, name, image, price::float8 as price, stock
    from products
    where active and slug = any(${items.map((i) => i.slug)})`) as Row[];

  const lines: (Row & { quantity: number })[] = [];
  for (const item of items) {
    const product = products.find((p) => p.slug === item.slug);
    if (!product) {
      return fail("Some items in your cart are no longer available. Please review your cart.");
    }
    if (product.stock < item.quantity) {
      return fail(
        product.stock === 0
          ? `${product.name} just sold out. Please remove it from your cart.`
          : `Only ${product.stock} × ${product.name} left in stock. Please update your cart.`,
      );
    }
    lines.push({ ...product, quantity: item.quantity });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const shipping = shippingFor(subtotal);
  const number = randomBytes(4).toString("hex").toUpperCase();
  const createdAt = new Date();
  const invoiceHtml = buildInvoiceHtml({
    number,
    createdAt,
    name: values.name,
    email: values.email,
    phone: values.phone,
    address: values.address,
    city: values.city,
    postalCode: values.postal,
    subtotal,
    shipping,
    total: subtotal + shipping,
    items: lines.map((l) => ({ name: l.name, price: l.price, quantity: l.quantity })),
  });

  try {
    await sql.transaction([
      ...lines.map(
        (l) => sql`update products set stock = stock - ${l.quantity} where id = ${l.id}`,
      ),
      sql`
        with o as (
          insert into orders
            (number, email, phone, name, address, city, postal_code, subtotal, shipping, total, invoice_html)
          values
            (${number}, ${values.email}, ${values.phone}, ${values.name}, ${values.address},
             ${values.city}, ${values.postal}, ${subtotal}, ${shipping}, ${subtotal + shipping},
             ${invoiceHtml})
          returning id
        )
        insert into order_items (order_id, product_id, name, image, price, quantity)
        select o.id, x.product_id, x.name, x.image, x.price, x.quantity
        from o, unnest(
          ${lines.map((l) => l.id)}::int[],
          ${lines.map((l) => l.name)}::text[],
          ${lines.map((l) => l.image)}::text[],
          ${lines.map((l) => l.price)}::numeric[],
          ${lines.map((l) => l.quantity)}::int[]
        ) as x(product_id, name, image, price, quantity)`,
    ]);
  } catch (error) {
    if (isDbError(error, CHECK_VIOLATION)) {
      return fail("Some items just sold out. Please review your cart.");
    }
    throw error;
  }

  updateTag(CATALOG_TAG);

  return {
    status: "success",
    number,
    name: values.name.split(" ")[0],
    email: values.email,
  };
}
