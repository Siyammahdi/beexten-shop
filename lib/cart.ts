import { useSyncExternalStore } from "react";

export type CartProduct = {
  slug: string;
  name: string;
  price: number;
  image: string;
  categoryName: string;
  stock: number;
};

export type CartLine = CartProduct & { quantity: number };

const STORAGE_KEY = "beexten-cart-v2";
const EMPTY: CartLine[] = [];
const listeners = new Set<() => void>();

let lines: CartLine[] = EMPTY;
let loaded = false;

function isLine(value: unknown): value is CartLine {
  const v = value as CartLine;
  return (
    typeof v?.slug === "string" &&
    typeof v.name === "string" &&
    typeof v.price === "number" &&
    typeof v.image === "string" &&
    Number.isInteger(v.quantity) &&
    v.quantity > 0
  );
}

function read() {
  if (loaded) return lines;
  loaded = true;
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    lines = Array.isArray(parsed) ? parsed.filter(isLine) : EMPTY;
  } catch {
    lines = EMPTY;
  }
  return lines;
}

function write(next: CartLine[]) {
  lines = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    loaded = false;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function addToCart(product: CartProduct, quantity = 1) {
  const current = read();
  const existing = current.find((l) => l.slug === product.slug);
  const nextQuantity = Math.min((existing?.quantity ?? 0) + quantity, product.stock);
  write(
    existing
      ? current.map((l) => (l.slug === product.slug ? { ...product, quantity: nextQuantity } : l))
      : [...current, { ...product, quantity: nextQuantity }],
  );
}

export function updateQuantity(slug: string, quantity: number) {
  const current = read();
  write(
    quantity <= 0
      ? current.filter((l) => l.slug !== slug)
      : current.map((l) => (l.slug === slug ? { ...l, quantity } : l)),
  );
}

export function clearCart() {
  write(EMPTY);
}

export function useCart() {
  const cartLines = useSyncExternalStore(subscribe, read, () => EMPTY);
  const count = cartLines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = cartLines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  return { lines: cartLines, count, subtotal };
}

const noopSubscribe = () => () => {};

export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
