import { normalizeName } from './normalizeName';

describe('normalizeName', () => {
  it.each([
    ['Eggs', 'egg'],
    ['egg', 'egg'],
    ['  Plum   Tomatoes ', 'plum tomato'],
    ['Potatoes', 'potato'],
    ['Raspberries', 'raspberry'],
    ['Peaches', 'peach'],
    ['Milk', 'milk'],
    ['Asparagus', 'asparagus'],
    ['Couscous', 'couscous'],
    ['Garlic Clove', 'garlic clove'],
  ])('%s → %s', (name, expected) => {
    expect(normalizeName(name)).toBe(expected);
  });
});
