"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { saveProduct } from "@/app/admin/actions";
import type { AdminCategory, AdminProduct } from "@/lib/admin";
import { isAllowedImage } from "@/lib/shop";
import { FormError, SubmitButton } from "./forms";
import { Card, inputClass, AdminSelect } from "./ui";

export function ProductForm({
  product,
  categories,
}: {
  product?: AdminProduct;
  categories: AdminCategory[];
}) {
  const [state, formAction] = useActionState(saveProduct, {});
  const v = state.values;
  const initialImage = v?.image ?? product?.image ?? "";
  const [image, setImage] = useState(initialImage);

  const checked = (key: "featured" | "active", fallback: boolean) =>
    v ? v[key] === "on" : fallback;

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-3">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="space-y-6 lg:col-span-2">
        <FormError error={state.error} />
        <Card title="Details">
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <Field label="Name" className="sm:col-span-2">
              <input name="name" required defaultValue={v?.name ?? product?.name} className={inputClass} />
            </Field>
            <Field label="URL slug" hint="Leave empty to generate from the name." className="sm:col-span-2">
              <input name="slug" defaultValue={v?.slug ?? product?.slug} placeholder="e.g. linen-shirt" className={inputClass} />
            </Field>
            <Field label="Description" hint="Short summary shown near the price." className="sm:col-span-2">
              <textarea
                name="description"
                rows={4}
                defaultValue={v?.description ?? product?.description}
                className={`${inputClass} h-auto py-3`}
              />
            </Field>
            <Field
              label="Detailed description"
              hint="Longer copy shown at the bottom of the product page, before related products."
              className="sm:col-span-2"
            >
              <textarea
                name="detailedDescription"
                rows={10}
                defaultValue={v?.detailedDescription ?? product?.detailedDescription}
                className={`${inputClass} h-auto py-3`}
              />
            </Field>
            <Field label="Highlights" hint="One per line, shown as a checklist on the product page." className="sm:col-span-2">
              <textarea
                name="highlights"
                rows={3}
                defaultValue={v?.highlights ?? product?.highlights.join("\n")}
                className={`${inputClass} h-auto py-3`}
              />
            </Field>
          </div>
        </Card>

        <Card title="Image">
          <div className="grid gap-5 p-6 sm:grid-cols-[1fr_160px]">
            <Field label="Image URL" hint="https link from images.unsplash.com or res.cloudinary.com.">
              <input
                name="image"
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className={inputClass}
              />
            </Field>
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-well">
              {isAllowedImage(image) ? (
                <Image src={image} alt="" fill sizes="160px" className="object-cover" />
              ) : (
                <p className="grid h-full place-items-center p-4 text-center text-xs text-muted">
                  Preview appears here
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card title="Pricing & stock">
          <div className="space-y-5 p-6">
            <Field label="Price (BDT)">
              <input
                name="price"
                type="number"
                min="0"
                step="1"
                required
                defaultValue={v?.price ?? product?.price}
                className={inputClass}
              />
            </Field>
            <Field label="Stock">
              <input
                name="stock"
                type="number"
                min="0"
                step="1"
                required
                defaultValue={v?.stock ?? product?.stock ?? 0}
                className={inputClass}
              />
            </Field>
          </div>
        </Card>

        <Card title="Organisation">
          <div className="space-y-5 p-6">
            <Field label="Category">
              <AdminSelect
                key={v?.category}
                name="category"
                required
                defaultValue={v?.category ?? product?.categorySlug}
                wrapperClassName="mt-1.5"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </AdminSelect>
            </Field>
            <Toggle name="active" label="Visible in store" defaultChecked={checked("active", product?.active ?? true)} />
            <Toggle name="featured" label="Feature on home page" defaultChecked={checked("featured", product?.featured ?? false)} />
          </div>
        </Card>

        <div className="[&>button]:w-full">
          <SubmitButton pendingText="Saving…">{product ? "Save changes" : "Create product"}</SubmitButton>
        </div>
      </div>
    </form>
  );
}

export function Field({
  label,
  hint,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

function Toggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <span className="text-sm font-medium">{label}</span>
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span className="relative h-6 w-11 shrink-0 rounded-full bg-line transition peer-checked:bg-ink peer-focus-visible:ring-4 peer-focus-visible:ring-ink/10 after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:shadow-sm after:transition peer-checked:after:translate-x-5" />
    </label>
  );
}
