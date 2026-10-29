"use client";

import { useRef } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

export function ProductRail({
  header,
  children,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const scroll = (direction: 1 | -1) =>
    rail.current?.scrollBy({ left: direction * rail.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <div>
      <div className="mb-10 flex items-end justify-between gap-6">
        {header}
        <div className="hidden shrink-0 gap-2 sm:flex">
          {([-1, 1] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              onClick={() => scroll(direction)}
              aria-label={direction === 1 ? "Scroll right" : "Scroll left"}
              className="grid size-11 place-items-center rounded-full border border-line bg-white transition hover:border-ink"
            >
              {direction === 1 ? <ArrowRightIcon className="size-4" /> : <ArrowLeftIcon className="size-4" />}
            </button>
          ))}
        </div>
      </div>
      <div
        ref={rail}
        className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8"
      >
        {children}
      </div>
    </div>
  );
}
