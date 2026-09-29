import { act, renderHook } from '@testing-library/react-native';
import { Appearance } from 'react-native';

import { useApplyThemePreference, useThemeStore } from './themeStore';

beforeEach(() => {
  useThemeStore.setState(useThemeStore.getInitialState());
});

describe('themeStore', () => {
  it('segue o sistema por padrão', () => {
    expect(useThemeStore.getState().preference).toBe('system');
  });

  it('aplica a preferência no React Native quando ela muda', async () => {
    const setColorScheme = jest.spyOn(Appearance, 'setColorScheme').mockImplementation(() => undefined);
    await renderHook(() => useApplyThemePreference());
    expect(setColorScheme).toHaveBeenLastCalledWith('unspecified');

    await act(() => useThemeStore.getState().setPreference('dark'));

    expect(setColorScheme).toHaveBeenLastCalledWith('dark');
    setColorScheme.mockRestore();
  });
});
