import { clamp } from './clamp';

describe('clamp', () => {
  it.each([
    [25, 20],
    [0, 1],
    [6, 6],
  ])('clamp(%d, 1, 20) → %d', (value, expected) => {
    expect(clamp(value, 1, 20)).toBe(expected);
  });
});
