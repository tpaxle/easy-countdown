import { describe, it, expect } from 'vitest';
import { describe as countdownDescribe } from './date';

describe('describe', () => {
  it('converts the remaining time into complete units', () => {
    const start = new Date('2026-01-01T00:00:00Z');
    const end = new Date('2026-01-02T02:03:04Z');

    expect(countdownDescribe(start, end)).toEqual({
      day: 1,
      hour: 2,
      minute: 3,
      second: 4,
    });
  });

  it('returns zeroes for an invalid date', () => {
    expect(countdownDescribe(new Date('invalid'), new Date())).toEqual({
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
    });
  });
});
