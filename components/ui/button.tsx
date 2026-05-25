import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-[transform,background-color,color,box-shadow] duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-60 active:translate-y-px";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-fg shadow-[0_1px_0_rgb(19_24_21/0.1),inset_0_1px_0_rgb(255_255_255/0.08)] hover:bg-primary-hover",
  secondary:
    "bg-surface text-fg border border-border-strong hover:bg-surface-muted",
  ghost: "bg-transparent text-fg hover:bg-surface-muted",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-sm rounded-[10px]",
  lg: "h-12 px-6 text-base rounded-[12px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className, children, disabled, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...rest}
      >
        {loading && (
          <span
            aria-hidden
            className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
