"use client";

import { MinusIcon, PlusIcon } from "./icons";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = Infinity,
  size = "md",
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}) {
  const button = size === "sm" ? "size-8" : "size-12";

  return (
    <div className="inline-flex items-center rounded-full border border-line bg-white">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={`${button} grid place-items-center rounded-full transition hover:bg-well disabled:opacity-30 disabled:hover:bg-transparent`}
      >
        <MinusIcon className="size-4" />
      </button>
      <span className="w-8 text-center text-sm font-medium tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={`${button} grid place-items-center rounded-full transition hover:bg-well disabled:opacity-30 disabled:hover:bg-transparent`}
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
}
