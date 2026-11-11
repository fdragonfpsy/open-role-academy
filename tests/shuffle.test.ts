import { describe, expect, it } from 'vitest';
import { seededShuffle } from '../src/lib/shuffle';

describe('seededShuffle', () => {
  it('is deterministic per key and keeps all elements', () => {
    const list = ['a', 'b', 'c', 'd'];
    expect(seededShuffle(list, 'item-1')).toEqual(seededShuffle(list, 'item-1'));
    expect([...seededShuffle(list, 'item-1')].sort()).toEqual(list);
  });
  it('does not always keep the first element in place', () => {
    const list = ['correct', 'x', 'y', 'z'];
    const firsts = new Set(Array.from({ length: 20 }, (_, i) => seededShuffle(list, `k${i}`)[0]));
    expect(firsts.size).toBeGreaterThan(1);
  });
});
