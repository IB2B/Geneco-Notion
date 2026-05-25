"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WizardProgressProps {
  current: number;
  total: number;
}

export function WizardProgress({ current, total }: WizardProgressProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Passo ${current} di ${total}`}
      className="mb-8 flex w-full items-center gap-1.5"
    >
      {Array.from({ length: total }, (_, i) => {
        const stepNumber = i + 1;
        const filled = stepNumber <= current;
        return (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-200",
              filled ? "bg-primary" : "bg-border",
            )}
          />
        );
      })}
    </div>
  );
}

interface WizardStepProps {
  stepNumber: number;
  totalSteps: number;
  title?: string;
  description?: string;
  eyebrow?: string;
  children: ReactNode;
}

export function WizardStep({
  stepNumber,
  totalSteps,
  title,
  description,
  eyebrow,
  children,
}: WizardStepProps) {
  return (
    <div>
      <div className="mb-6">
        {eyebrow && (
          <p className="text-[11.5px] font-medium uppercase tracking-[0.14em] text-accent">
            {eyebrow}
          </p>
        )}
        <p className="mt-1 text-[12.5px] font-medium text-fg-subtle">
          Passo {stepNumber} di {totalSteps}
        </p>
        {title && (
          <h2 className="mt-2 font-display text-[22px] font-semibold leading-7 tracking-tight text-fg sm:text-[24px]">
            {title}
          </h2>
        )}
        {description && (
          <p className="mt-1.5 text-[14px] leading-5 text-fg-muted">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

interface WizardNavProps {
  current: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  nextLabel?: string;
  backLabel?: string;
}

export function WizardNav({
  current,
  total,
  onBack,
  onNext,
  isSubmitting,
  submitLabel = "Invia",
  nextLabel = "Avanti",
  backLabel = "Indietro",
}: WizardNavProps) {
  const isFirst = current === 1;
  const isLast = current === total;
  return (
    <div className="mt-8 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        disabled={isFirst || isSubmitting}
        className={isFirst ? "invisible" : ""}
      >
        <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="none">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {backLabel}
      </Button>
      <Button
        type={isLast ? "submit" : "button"}
        onClick={isLast ? undefined : onNext}
        loading={isSubmitting}
        size="lg"
      >
        {isLast ? submitLabel : nextLabel}
        {!isLast && (
          <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="none">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </Button>
    </div>
  );
}
