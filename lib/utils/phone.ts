/**
 * Normalize a user-entered phone number into E.164-ish international form,
 * defaulting to the Italian country code (+39) when the user has clearly
 * entered an Italian number without it. Used server-side before persisting
 * to Notion so the stored value is consistent regardless of how the user
 * typed it on the form.
 *
 * Rules (applied in order):
 *   1. Already prefixed with `+`           → keep, drop other punctuation.
 *   2. Prefixed with `00`                  → replace with `+`.
 *   3. Starts with `39` (length 11-12)     → prepend `+`.
 *   4. Starts with `3` and exactly 10 digits (Italian mobile)
 *                                          → prepend `+39`.
 *   5. Starts with `0` and 8-11 digits long (Italian landline)
 *                                          → prepend `+39`.
 *   6. Anything else                       → return the stripped digits
 *                                            without a `+` (preserves
 *                                            unexpected formats rather
 *                                            than mangling them).
 */
export function normalizeItalianPhone(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;

  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/[^\d]/g, "");
  if (!digits) return trimmed;

  if (hasPlus) return `+${digits}`;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (digits.startsWith("39") && (digits.length === 11 || digits.length === 12)) {
    return `+${digits}`;
  }
  if (digits.startsWith("3") && digits.length === 10) return `+39${digits}`;
  if (digits.startsWith("0") && digits.length >= 8 && digits.length <= 11) {
    return `+39${digits}`;
  }
  return digits;
}
