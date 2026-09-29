import { act, userEvent } from '@testing-library/react-native';
import { Stack } from 'expo-router';
import { screen } from 'expo-router/testing-library';
import { Text } from 'react-native';

import { useTimersStore } from '@/features/kitchen-timers';
import { renderRouterWithProviders } from '@/shared/testing';
import { useToastStore } from '@/shared/ui';

import { CookingModeScreen } from './CookingModeScreen';

/** Pilha de navegação, como no _layout do app. */
function StackLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

/** Só para conferir que o fim da receita volta para a tela inicial. */
function HomeStub() {
  return <Text>Tela inicial</Text>;
}

async function renderCooking(url = '/receita/52772/cozinhar?porcoes=4') {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  await renderRouterWithProviders(
    { _layout: StackLayout, index: HomeStub, 'receita/[id]/cozinhar': CookingModeScreen },
    url,
  );
  return { user };
}

async function goToStep(user: ReturnType<typeof userEvent.setup>, step: number) {
  await screen.findByText('Passo 1 de 6');
  for (let current = 1; current < step; current++) {
    await user.press(screen.getByRole('button', { name: 'Próximo passo' }));
  }
}

beforeEach(() => {
  useTimersStore.setState(useTimersStore.getInitialState());
  useToastStore.setState(useToastStore.getInitialState());
});

describe('CookingModeScreen', () => {
  it('mostra um passo por vez com o progresso', async () => {
    const { user } = await renderCooking();

    expect(await screen.findByText('Passo 1 de 6')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Passo anterior' })).toBeDisabled();

    await user.press(screen.getByRole('button', { name: 'Próximo passo' }));

    expect(screen.getByText('Passo 2 de 6')).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: /^Passo 2\. Combine soy sauce/ })).toBeOnTheScreen();
  });

  it('transforma o tempo do texto em timer e avisa quando termina', async () => {
    const { user } = await renderCooking();
    await goToStep(user, 2);

    // Passo 2: "cook for one minute once boiling".
    await user.press(screen.getByRole('button', { name: 'Iniciar timer de 1 min' }));
    expect(screen.getByText('01:00')).toBeOnTheScreen();

    await act(() => jest.advanceTimersByTime(61_000));

    expect(await screen.findByText('Terminou!')).toBeOnTheScreen();
    expect(useTimersStore.getState().timers[0]?.status).toBe('done');
  });

  it('destaca o timer mais urgente e troca o destaque ao tocar em outro', async () => {
    const { user } = await renderCooking();
    await goToStep(user, 6);

    // Passo 6: "cook 15 minutes" e "let stand 5 minutes".
    await user.press(screen.getByRole('button', { name: 'Iniciar timer de 15 min' }));
    await user.press(screen.getByRole('button', { name: 'Iniciar timer de 5 min' }));

    // O de 5 min fica em destaque; o de 15 min vira uma pílula que dá para tocar.
    const pill = screen.getByRole('button', { name: /^Passo 6 · 15 min: 15 minutos restantes$/ });
    await user.press(pill);

    expect(screen.getByRole('button', { name: /^Passo 6 · 5 min: 5 minutos restantes$/ })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Pausar Passo 6 · 15 min' })).toBeOnTheScreen();
  });

  it('ao concluir, mostra o toast e volta para a tela inicial', async () => {
    const { user } = await renderCooking();
    await goToStep(user, 6);

    await user.press(screen.getByRole('button', { name: 'Concluir' }));

    expect(useToastStore.getState().toast).toMatchObject({
      message: 'Receita concluída! Bom apetite.',
      variant: 'success',
    });
    expect(await screen.findByText('Tela inicial')).toBeOnTheScreen();
  });
});
