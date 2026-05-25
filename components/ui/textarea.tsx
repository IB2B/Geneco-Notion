import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, rows = 4, ...rest }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(
        "block w-full resize-y rounded-[10px] border bg-surface px-3.5 py-2.5 text-[15px] text-fg",
        "placeholder:text-fg-subtle",
        "transition-[border-color,box-shadow] duration-150",
        "focus:outline-none focus:ring-4 focus:ring-primary/15",
        invalid
          ? "border-danger focus:border-danger focus:ring-danger/15"
          : "border-border-strong focus:border-primary",
        className,
      )}
      {...rest}
    />
  ),
);
Textarea.displayName = "Textarea";
