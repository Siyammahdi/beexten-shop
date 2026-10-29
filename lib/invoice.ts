import { formatPrice } from "./shop";

export type InvoiceLine = { name: string; price: number; quantity: number };

export type InvoiceData = {
  number: string;
  createdAt: Date;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: InvoiceLine[];
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatInvoiceDate(date: Date) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export function buildInvoiceHtml(data: InvoiceData) {
  const rows = data.items
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.name)}</td>
          <td class="num">${item.quantity}</td>
          <td class="num">${escapeHtml(formatPrice(item.price))}</td>
          <td class="num">${escapeHtml(formatPrice(item.price * item.quantity))}</td>
        </tr>`,
    )
    .join("");

  const shippingLabel =
    data.shipping === 0 ? "Free" : escapeHtml(formatPrice(data.shipping));

  return `
<div class="invoice-document">
  <header class="invoice-header">
    <div>
      <p class="invoice-brand">beexten<span class="invoice-muted">.</span></p>
      <p class="invoice-tagline">Well-made things for everyday life</p>
    </div>
    <div class="invoice-meta">
      <p class="invoice-title">Tax invoice</p>
      <p><strong>Order #${escapeHtml(data.number)}</strong></p>
      <p>${escapeHtml(formatInvoiceDate(data.createdAt))}</p>
    </div>
  </header>

  <div class="invoice-columns">
    <section>
      <h2>Bill to</h2>
      <p><strong>${escapeHtml(data.name)}</strong></p>
      <p>${escapeHtml(data.address)}</p>
      <p>${escapeHtml(data.city)} ${escapeHtml(data.postalCode)}</p>
      <p>${escapeHtml(data.email)}</p>
      <p>${escapeHtml(data.phone)}</p>
    </section>
    <section>
      <h2>Payment</h2>
      <p><strong>Cash on delivery</strong></p>
      <p>Amount due when the order is delivered.</p>
    </section>
  </div>

  <table class="invoice-table">
    <thead>
      <tr>
        <th>Item</th>
        <th class="num">Qty</th>
        <th class="num">Unit price</th>
        <th class="num">Amount</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <dl class="invoice-totals">
    <div><dt>Subtotal</dt><dd>${escapeHtml(formatPrice(data.subtotal))}</dd></div>
    <div><dt>Shipping</dt><dd>${shippingLabel}</dd></div>
    <div class="invoice-grand"><dt>Total</dt><dd>${escapeHtml(formatPrice(data.total))}</dd></div>
  </dl>

  <p class="invoice-footer">Thank you for shopping with beexten. Questions? hello@beexten.com</p>
</div>`.trim();
}
