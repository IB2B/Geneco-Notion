import { forwardRef, type LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...rest }, ref) => (
    <label
      ref={ref}
      className={cn("block text-[13px] font-medium text-fg leading-5", className)}
      {...rest}
    >
      {children}
      {required && <span aria-hidden className="ml-0.5 text-accent">*</span>}
    </label>
  ),
);
Label.displayName = "Label";
