import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...rest }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          "block w-full appearance-none rounded-[10px] border bg-surface px-3.5 py-2.5 pr-10 text-[15px] text-fg",
          "transition-[border-color,box-shadow] duration-150",
          "focus:outline-none focus:ring-4 focus:ring-primary/15",
          invalid
            ? "border-danger focus:border-danger focus:ring-danger/15"
            : "border-border-strong focus:border-primary",
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      <svg
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  ),
);
Select.displayName = "Select";
