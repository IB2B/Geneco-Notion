import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...rest }, ref) => (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "block w-full rounded-[10px] border bg-surface px-3.5 py-2.5 text-[15px] text-fg",
        "placeholder:text-fg-subtle",
        "transition-[border-color,box-shadow] duration-150",
        "focus:outline-none focus:ring-4 focus:ring-primary/15",
        invalid
          ? "border-danger focus:border-danger focus:ring-danger/15"
          : "border-border-strong focus:border-primary",
        "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-fg-muted",
        className,
      )}
      {...rest}
    />
  ),
);
Input.displayName = "Input";
