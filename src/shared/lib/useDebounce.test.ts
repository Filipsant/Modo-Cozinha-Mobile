import { act, renderHook } from '@testing-library/react-native';

import { useDebounce } from './useDebounce';

interface Props {
  value: string;
}

function renderDebounce(initialValue: string) {
  return renderHook<string, Props>(({ value }) => useDebounce(value, 400), {
    initialProps: { value: initialValue },
  });
}

describe('useDebounce', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('só entrega o valor novo depois do atraso', async () => {
    const { result, rerender } = await renderDebounce('chi');

    await rerender({ value: 'chicken' });
    expect(result.current).toBe('chi');

    await act(() => jest.advanceTimersByTime(399));
    expect(result.current).toBe('chi');

    await act(() => jest.advanceTimersByTime(1));
    expect(result.current).toBe('chicken');
  });

  it('reinicia a contagem a cada mudança', async () => {
    const { result, rerender } = await renderDebounce('a');

    await rerender({ value: 'ab' });
    await act(() => jest.advanceTimersByTime(300));
    await rerender({ value: 'abc' });
    await act(() => jest.advanceTimersByTime(300));

    expect(result.current).toBe('a');

    await act(() => jest.advanceTimersByTime(100));
    expect(result.current).toBe('abc');
  });
});
