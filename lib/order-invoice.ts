import "server-only";
import { sql } from "./db";
import { buildInvoiceHtml, type InvoiceData } from "./invoice";

type OrderRow = {
  id: number;
  number: string;
  email: string;
  phone: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: Date;
  invoiceHtml: string;
};

async function loadOrder(number: string) {
  const [order] = (await sql`
    select id, number, email, phone, name, address, city,
           postal_code as "postalCode", subtotal::float8 as subtotal,
           shipping::float8 as shipping, total::float8 as total,
           created_at as "createdAt", invoice_html as "invoiceHtml"
    from orders where number = ${number}`) as OrderRow[];
  return order;
}

async function loadItems(orderId: number) {
  return (await sql`
    select name, price::float8 as price, quantity
    from order_items where order_id = ${orderId} order by id`) as InvoiceData["items"];
}

function toInvoiceData(order: OrderRow, items: InvoiceData["items"]): InvoiceData {
  return {
    number: order.number,
    createdAt: order.createdAt,
    name: order.name,
    email: order.email,
    phone: order.phone,
    address: order.address,
    city: order.city,
    postalCode: order.postalCode,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    items,
  };
}

export async function ensureOrderInvoice(orderId: number) {
  const [order] = (await sql`
    select id, number, email, phone, name, address, city,
           postal_code as "postalCode", subtotal::float8 as subtotal,
           shipping::float8 as shipping, total::float8 as total,
           created_at as "createdAt", invoice_html as "invoiceHtml"
    from orders where id = ${orderId}`) as OrderRow[];
  if (!order) return null;

  if (order.invoiceHtml.trim()) return order.invoiceHtml;

  const items = await loadItems(order.id);
  const html = buildInvoiceHtml(toInvoiceData(order, items));
  await sql`update orders set invoice_html = ${html} where id = ${order.id}`;
  return html;
}

export async function getInvoiceForNumber(number: string, email?: string) {
  const order = await loadOrder(number);
  if (!order) return null;
  if (email && order.email.toLowerCase() !== email.trim().toLowerCase()) return null;

  if (order.invoiceHtml.trim()) return order.invoiceHtml;

  const items = await loadItems(order.id);
  const html = buildInvoiceHtml(toInvoiceData(order, items));
  await sql`update orders set invoice_html = ${html} where id = ${order.id}`;
  return html;
}
