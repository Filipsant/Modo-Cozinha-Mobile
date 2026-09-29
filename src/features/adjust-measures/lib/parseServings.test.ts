import { parseServings } from './parseServings';

describe('parseServings', () => {
  it.each([
    [undefined, 4],
    ['', 4],
    ['abc', 4],
    ['6', 6],
    ['0', 1],
    ['-3', 1],
    ['25', 20],
    ['8.7', 8],
  ])('%p → %d', (value, expected) => {
    expect(parseServings(value)).toBe(expected);
  });
});
