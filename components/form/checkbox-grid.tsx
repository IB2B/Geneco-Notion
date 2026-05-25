"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface CheckboxGridProps<T extends string> {
  options: readonly T[];
  value: T[];
  onChange: (next: T[]) => void;
  name?: string;
  ariaLabel?: string;
  columns?: 1 | 2;
}

export function CheckboxGrid<T extends string>({
  options,
  value,
  onChange,
  name,
  ariaLabel,
  columns = 1,
}: CheckboxGridProps<T>) {
  const groupId = useId();
  const toggle = (opt: T) => {
    const set = new Set(value);
    if (set.has(opt)) set.delete(opt);
    else set.add(opt);
    onChange(Array.from(set));
  };
  return (
    <ul
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "grid gap-2",
        columns === 2 ? "sm:grid-cols-2" : "grid-cols-1",
      )}
    >
      {options.map((opt) => {
        const id = `${groupId}-${opt}`;
        const checked = value.includes(opt);
        return (
          <li key={opt}>
            <label
              htmlFor={id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-[10px] border bg-surface px-3.5 py-2.5 text-[14.5px] leading-5",
                "transition-[border-color,background-color] duration-150",
                checked
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border-strong text-fg hover:border-border-focus",
              )}
            >
              <input
                id={id}
                type="checkbox"
                name={name}
                value={opt}
                checked={checked}
                onChange={() => toggle(opt)}
                className="size-4 accent-primary"
              />
              <span>{opt}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
