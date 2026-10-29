import { ChevronDownIcon } from "./icons";

const baseClass =
  "h-11 w-full cursor-pointer appearance-none rounded-xl border border-line bg-white pl-3.5 pr-10 text-sm outline-none transition focus:border-ink focus:ring-4 focus:ring-ink/5";

export function StyledSelect({
  className = "",
  wrapperClassName = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { wrapperClassName?: string }) {
  return (
    <div className={`relative ${wrapperClassName}`}>
      <select {...props} className={`${baseClass} ${className}`} />
      <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
    </div>
  );
}
