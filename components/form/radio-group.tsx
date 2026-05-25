"use client";

import { forwardRef, useId, type ChangeEventHandler } from "react";
import { cn } from "@/lib/utils";

interface RadioGroupProps<T extends string> {
  options: readonly T[];
  value: T | "";
  onChange: ChangeEventHandler<HTMLInputElement>;
  name: string;
  ariaLabel?: string;
  invalid?: boolean;
  columns?: 1 | 2;
}

function RadioGroupInner<T extends string>(
  { options, value, onChange, name, ariaLabel, invalid, columns = 1 }: RadioGroupProps<T>,
  ref: React.Ref<HTMLDivElement>,
) {
  const id = useId();
  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-invalid={invalid || undefined}
      className={cn(
        "grid gap-2",
        columns === 2 ? "sm:grid-cols-2" : "grid-cols-1",
      )}
    >
      {options.map((opt) => {
        const optId = `${id}-${opt}`;
        const checked = value === opt;
        return (
          <label
            key={opt}
            htmlFor={optId}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-[10px] border bg-surface px-3.5 py-2.5 text-[14.5px] leading-5",
              "transition-[border-color,background-color] duration-150",
              checked
                ? "border-primary bg-primary-soft text-primary"
                : "border-border-strong text-fg hover:border-border-focus",
            )}
          >
            <input
              id={optId}
              type="radio"
              name={name}
              value={opt}
              checked={checked}
              onChange={onChange}
              className="size-4 accent-primary"
            />
            <span>{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

export const RadioGroup = forwardRef(RadioGroupInner) as <T extends string>(
  props: RadioGroupProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => ReturnType<typeof RadioGroupInner>;
