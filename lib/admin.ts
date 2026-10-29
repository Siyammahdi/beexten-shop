import "server-only";
import { requireAdmin } from "./auth";
import { sql } from "./db";
import { LOW_STOCK_THRESHOLD, type OrderStatus } from "./shop";

export type AdminProduct = {
  id: number;
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  detailedDescription: string;
  highlights: string[];
  featured: boolean;
  active: boolean;
};

export type AdminCategory = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  position: number;
  productCount: number;
};

export type OrderSummary = {
  id: number;
  number: string;
  name: string;
  email: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
  createdAt: Date;
};

export type OrderDetail = OrderSummary & {
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  subtotal: number;
  shipping: number;
  items: { id: number; productId: number | null; name: string; image: string; price: number; quantity: number }[];
};

const ORDER_SUMMARY_SELECT = `
  select o.id, o.number, o.name, o.email, o.status, o.total::float8 as total,
         o.created_at as "createdAt",
         (select coalesce(sum(quantity), 0)::int from order_items where order_id = o.id) as "itemCount"
  from orders o`;

export async function getDashboard() {
  await requireAdmin();

  const [[orders], [products], recentOrders, lowStock] = await Promise.all([
    sql`
      select coalesce(sum(total) filter (where status <> 'cancelled'), 0)::float8 as revenue,
             count(*)::int as total,
             count(*) filter (where status = 'pending')::int as pending
      from orders`,
    sql`
      select count(*)::int as total,
             count(*) filter (where stock <= ${LOW_STOCK_THRESHOLD})::int as "lowStock"
      from products where active`,
    sql.query(`${ORDER_SUMMARY_SELECT} order by o.created_at desc limit 6`),
    sql`
      select id, name, image, stock from products
      where active and stock <= ${LOW_STOCK_THRESHOLD}
      order by stock, name limit 6`,
  ]);

  return {
    revenue: orders.revenue as number,
    orderCount: orders.total as number,
    pendingCount: orders.pending as number,
    productCount: products.total as number,
    lowStockCount: products.lowStock as number,
    recentOrders: recentOrders as OrderSummary[],
    lowStock: lowStock as { id: number; name: string; image: string; stock: number }[],
  };
}

export async function getOrders(status?: OrderStatus) {
  await requireAdmin();
  return (await (status
    ? sql.query(`${ORDER_SUMMARY_SELECT} where o.status = $1 order by o.created_at desc`, [status])
    : sql.query(`${ORDER_SUMMARY_SELECT} order by o.created_at desc`))) as OrderSummary[];
}

export async function getOrderCounts() {
  await requireAdmin();
  const rows = await sql`select status, count(*)::int as count from orders group by status`;
  return Object.fromEntries(rows.map((r) => [r.status, r.count])) as Partial<Record<OrderStatus, number>>;
}

export async function getOrder(id: number) {
  await requireAdmin();
  const [[order], items] = await Promise.all([
    sql`
      select o.id, o.number, o.name, o.email, o.phone, o.address, o.city,
             o.postal_code as "postalCode", o.status, o.created_at as "createdAt",
             o.subtotal::float8 as subtotal, o.shipping::float8 as shipping, o.total::float8 as total
      from orders o where o.id = ${id}`,
    sql`
      select id, product_id as "productId", name, image, price::float8 as price, quantity
      from order_items where order_id = ${id} order by id`,
  ]);
  if (!order) return undefined;
  return {
    ...order,
    items,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
  } as OrderDetail;
}

const ADMIN_PRODUCT_SELECT = `
  select p.id, p.slug, p.name, p.category_slug as "categorySlug", c.name as "categoryName",
         p.price::float8 as price, p.stock, p.image, p.description,
         p.detailed_description as "detailedDescription", p.highlights,
         p.featured, p.active
  from products p
  join categories c on c.slug = p.category_slug`;

export async function getAdminProducts(query?: string) {
  await requireAdmin();
  return (await (query
    ? sql.query(`${ADMIN_PRODUCT_SELECT} where p.name ilike $1 order by p.id desc`, [`%${query}%`])
    : sql.query(`${ADMIN_PRODUCT_SELECT} order by p.id desc`))) as AdminProduct[];
}

export async function getAdminProduct(id: number) {
  await requireAdmin();
  const [product] = await sql.query(`${ADMIN_PRODUCT_SELECT} where p.id = $1`, [id]);
  return product as AdminProduct | undefined;
}

export async function getAdminCategories() {
  await requireAdmin();
  return (await sql`
    select c.slug, c.name, c.tagline, c.image, c.position, count(p.id)::int as "productCount"
    from categories c
    left join products p on p.category_slug = c.slug
    group by c.slug
    order by c.position, c.name`) as AdminCategory[];
}

export async function getAdminCategory(slug: string) {
  return (await getAdminCategories()).find((c) => c.slug === slug);
}
