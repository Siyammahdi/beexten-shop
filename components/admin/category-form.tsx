"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { saveCategory } from "@/app/admin/actions";
import type { AdminCategory } from "@/lib/admin";
import { isAllowedImage } from "@/lib/shop";
import { FormError, SubmitButton } from "./forms";
import { Field } from "./product-form";
import { Card, inputClass } from "./ui";

export function CategoryForm({ category }: { category?: AdminCategory }) {
  const [state, formAction] = useActionState(saveCategory, {});
  const v = state.values;
  const [image, setImage] = useState(v?.image ?? category?.image ?? "");

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      {category && <input type="hidden" name="original" value={category.slug} />}
      <FormError error={state.error} />

      <Card>
        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <Field label="Name">
            <input name="name" required defaultValue={v?.name ?? category?.name} className={inputClass} />
          </Field>
          <Field
            label="URL slug"
            hint={category ? "Slugs can't change once created." : "Leave empty to generate from the name."}
          >
            <input
              name="slug"
              defaultValue={v?.slug ?? category?.slug}
              disabled={Boolean(category)}
              placeholder="e.g. outdoor"
              className={`${inputClass} disabled:bg-canvas disabled:text-muted`}
            />
          </Field>
          <Field label="Tagline" className="sm:col-span-2">
            <input name="tagline" defaultValue={v?.tagline ?? category?.tagline} className={inputClass} />
          </Field>
          <Field label="Position" hint="Lower numbers appear first. The first four show on the home page.">
            <input
              name="position"
              type="number"
              step="1"
              defaultValue={v?.position ?? category?.position ?? 0}
              className={inputClass}
            />
          </Field>
        </div>
      </Card>

      <Card title="Cover image">
        <div className="grid gap-5 p-6 sm:grid-cols-[1fr_200px]">
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
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-well">
            {isAllowedImage(image) ? (
              <Image src={image} alt="" fill sizes="200px" className="object-cover" />
            ) : (
              <p className="grid h-full place-items-center p-4 text-center text-xs text-muted">
                Preview appears here
              </p>
            )}
          </div>
        </div>
      </Card>

      <SubmitButton pendingText="Saving…">{category ? "Save changes" : "Create category"}</SubmitButton>
    </form>
  );
}
