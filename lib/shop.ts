export type Category = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  position: number;
  productCount: number;
};

export type Product = {
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
};

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const FREE_SHIPPING_THRESHOLD = 2000;
export const SHIPPING_FEE = 120;
export const LOW_STOCK_THRESHOLD = 5;

export function shippingFor(subtotal: number) {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

export const IMAGE_HOSTS = ["images.unsplash.com", "res.cloudinary.com"];

export function isAllowedImage(url: string) {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && IMAGE_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
