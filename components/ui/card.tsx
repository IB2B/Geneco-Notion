import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-border bg-surface shadow-[var(--shadow-card)]",
        className,
      )}
      {...rest}
    />
  );
}

export function CardSection({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "border-b border-border last:border-b-0 px-6 py-6 sm:px-8 sm:py-8",
        className,
      )}
    >
      {title && (
        <header className="mb-5">
          <h2 className="font-display text-[17px] font-semibold leading-6 text-fg">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-[14px] leading-5 text-fg-muted">
              {description}
            </p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
