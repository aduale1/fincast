/**
 * Money helpers.
 *
 * Every amount in Fincast is stored and calculated as an integer number of cents.
 * Floating-point numbers cannot represent most decimals exactly
 * (in JavaScript, 0.1 + 0.2 === 0.30000000000000004), and those tiny errors
 * add up over a 90-day forecast. Integers are exact, so we only convert to
 * dollars at the edges: when reading user input and when displaying.
 */

/** A whole number of cents. A type alias documents intent; it does not add runtime checks. */
export type Cents = number;

/**
 * Converts a dollar string typed by a user (for example "12.30" or "1,250") into cents.
 * Returns null when the input is not a valid amount, so callers must handle bad input.
 */
export function parseDollarsToCents(input: string): Cents | null {
  const cleaned = input.trim().replace(/[$,\s]/g, '');
  // Optional minus, digits, optional decimal point with at most two digits.
  if (!/^-?\d+(\.\d{1,2})?$/.test(cleaned)) {
    return null;
  }
  const negative = cleaned.startsWith('-');
  const [whole = '0', fraction = ''] = cleaned.replace('-', '').split('.');
  // Work with strings so we never multiply a float by 100.
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  return negative ? -cents : cents;
}

const cadFormatter = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
});

/** Formats cents for display, for example 123456 -> "$1,234.56". */
export function formatCents(cents: Cents): string {
  return cadFormatter.format(cents / 100);
}
