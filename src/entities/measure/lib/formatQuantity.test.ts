import { formatDecimal, formatQuantity } from './formatQuantity';

describe('formatQuantity', () => {
  it.each([
    [0.25, '¼'],
    [0.33, '⅓'],
    [0.5, '½'],
    [0.67, '⅔'],
    [0.75, '¾'],
    [0.125, '⅛'],
    [1.5, '1½'],
    [2, '2'],
    [2.999, '3'],
    [1.3, '1,3'],
    [0.1, '0,1'],
    [12.4, '12,4'],
    [12.345, '12⅓'],
  ])('%d → %s', (value, expected) => {
    expect(formatQuantity(value)).toBe(expected);
  });
});

describe('formatDecimal', () => {
  it('usa vírgula e corta os zeros', () => {
    expect(formatDecimal(2.5)).toBe('2,5');
    expect(formatDecimal(3)).toBe('3');
    expect(formatDecimal(1.256, 2)).toBe('1,26');
  });
});
