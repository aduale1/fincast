import { describe, expect, it } from 'vitest';
import { formatCents, parseDollarsToCents } from './money';

describe('parseDollarsToCents', () => {
  it('converts whole dollars', () => {
    expect(parseDollarsToCents('12')).toBe(1200);
  });

  it('converts dollars and cents without floating-point error', () => {
    // 0.1 + 0.2 style bugs would show up here as 1229.9999...
    expect(parseDollarsToCents('12.30')).toBe(1230);
    expect(parseDollarsToCents('0.07')).toBe(7);
  });

  it('pads a single decimal digit', () => {
    expect(parseDollarsToCents('5.5')).toBe(550);
  });

  it('ignores dollar signs, commas and spaces', () => {
    expect(parseDollarsToCents(' $1,250.00 ')).toBe(125000);
  });

  it('handles negative amounts', () => {
    expect(parseDollarsToCents('-40.25')).toBe(-4025);
  });

  it.each(['', 'abc', '12.345', '1.2.3', '$'])('rejects invalid input %j', (input) => {
    expect(parseDollarsToCents(input)).toBeNull();
  });
});

describe('formatCents', () => {
  it('formats as Canadian dollars', () => {
    expect(formatCents(123456)).toBe('$1,234.56');
  });

  it('formats zero', () => {
    expect(formatCents(0)).toBe('$0.00');
  });
});
