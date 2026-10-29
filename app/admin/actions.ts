"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, createSession, deleteSession, requireAdmin } from "@/lib/auth";
import {
  CHECK_VIOLATION,
  FOREIGN_KEY_VIOLATION,
  UNIQUE_VIOLATION,
  isDbError,
  sql,
} from "@/lib/db";
import { CATALOG_TAG } from "@/lib/queries";
import { ORDER_STATUSES, isAllowedImage, slugify, type OrderStatus } from "@/lib/shop";

export type FormState = { error?: string; values?: Record<string, string> };

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  if (!checkPassword(String(formData.get("password") ?? ""))) {
    return { error: "Incorrect password." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

export async function saveProduct(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const values = Object.fromEntries(
    ["name", "slug", "category", "price", "stock", "image", "description", "detailedDescription", "highlights"].map(
      (k) => [k, text(formData, k)],
    ),
  );
  values.featured = formData.get("featured") ? "on" : "";
  values.active = formData.get("active") ? "on" : "";
  const fail = (error: string): FormState => ({ error, values });

  const id = Number(formData.get("id")) || null;
  const slug = slugify(values.slug || values.name);
  const price = Number(values.price);
  const stock = Number(values.stock);
  const highlights = values.highlights.split("\n").map((h) => h.trim()).filter(Boolean);

  if (!values.name) return fail("Name is required.");
  if (!slug) return fail("Enter a URL slug using letters or numbers.");
  if (!Number.isFinite(price) || price < 0) return fail("Price must be a positive number.");
  if (!Number.isInteger(stock) || stock < 0) return fail("Stock must be a whole number of 0 or more.");
  if (!isAllowedImage(values.image)) {
    return fail("Image must be an https URL from images.unsplash.com or res.cloudinary.com.");
  }

  const product = [
    values.name, slug, values.category, price, stock, values.image,
    values.description, values.detailedDescription, highlights, values.featured === "on", values.active === "on",
  ];

  try {
    if (id) {
      await sql.query(
        `update products set name = $1, slug = $2, category_slug = $3, price = $4, stock = $5,
           image = $6, description = $7, detailed_description = $8, highlights = $9, featured = $10, active = $11
         where id = $12`,
        [...product, id],
      );
    } else {
      await sql.query(
        `insert into products
           (name, slug, category_slug, price, stock, image, description, detailed_description, highlights, featured, active)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        product,
      );
    }
  } catch (error) {
    if (isDbError(error, UNIQUE_VIOLATION)) return fail(`Another product already uses the slug "${slug}".`);
    if (isDbError(error, FOREIGN_KEY_VIOLATION)) return fail("Choose a valid category.");
    throw error;
  }

  updateTag(CATALOG_TAG);
  redirect("/admin/products");
}

export async function deleteProduct(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  await sql`delete from products where id = ${Number(formData.get("id"))}`;
  updateTag(CATALOG_TAG);
  redirect("/admin/products");
}

export async function saveCategory(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const values = Object.fromEntries(
    ["name", "slug", "tagline", "image", "position"].map((k) => [k, text(formData, k)]),
  );
  const fail = (error: string): FormState => ({ error, values });

  const original = text(formData, "original");
  const slug = original || slugify(values.slug || values.name);
  const position = Number(values.position || 0);

  if (!values.name) return fail("Name is required.");
  if (!slug) return fail("Enter a URL slug using letters or numbers.");
  if (!Number.isInteger(position)) return fail("Position must be a whole number.");
  if (!isAllowedImage(values.image)) {
    return fail("Image must be an https URL from images.unsplash.com or res.cloudinary.com.");
  }

  try {
    if (original) {
      await sql`
        update categories
        set name = ${values.name}, tagline = ${values.tagline}, image = ${values.image}, position = ${position}
        where slug = ${original}`;
    } else {
      await sql`
        insert into categories (slug, name, tagline, image, position)
        values (${slug}, ${values.name}, ${values.tagline}, ${values.image}, ${position})`;
    }
  } catch (error) {
    if (isDbError(error, UNIQUE_VIOLATION)) return fail(`A category with the slug "${slug}" already exists.`);
    throw error;
  }

  updateTag(CATALOG_TAG);
  redirect("/admin/categories");
}

export async function deleteCategory(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    await sql`delete from categories where slug = ${text(formData, "slug")}`;
  } catch (error) {
    if (isDbError(error, FOREIGN_KEY_VIOLATION)) {
      return { error: "Move or delete this category's products before deleting it." };
    }
    throw error;
  }
  updateTag(CATALOG_TAG);
  redirect("/admin/categories");
}

export async function updateOrderStatus(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const status = text(formData, "status") as OrderStatus;
  if (!ORDER_STATUSES.includes(status)) return { error: "Choose a valid status." };

  const [order] = await sql`select status from orders where id = ${id}`;
  if (!order) return { error: "Order not found." };
  if (order.status === status) return {};

  const restock = status === "cancelled" ? 1 : order.status === "cancelled" ? -1 : 0;

  try {
    await sql.transaction([
      ...(restock
        ? [
            sql`
              update products p set stock = p.stock + ${restock} * oi.quantity
              from order_items oi
              where oi.order_id = ${id} and oi.product_id = p.id`,
          ]
        : []),
      sql`update orders set status = ${status} where id = ${id}`,
    ]);
  } catch (error) {
    if (isDbError(error, CHECK_VIOLATION)) {
      return { error: "Not enough stock left to reopen this order." };
    }
    throw error;
  }

  if (restock) updateTag(CATALOG_TAG);
  refresh();
  return {};
}

export async function deleteOrder(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!id) return { error: "Order not found." };

  const [order] = await sql`select status from orders where id = ${id}`;
  if (!order) return { error: "Order not found." };

  const restock = order.status !== "cancelled";

  await sql.transaction([
    ...(restock
      ? [
          sql`
            update products p set stock = p.stock + oi.quantity
            from order_items oi
            where oi.order_id = ${id} and oi.product_id = p.id`,
        ]
      : []),
    sql`delete from orders where id = ${id}`,
  ]);

  if (restock) updateTag(CATALOG_TAG);
  redirect("/admin/orders");
}
