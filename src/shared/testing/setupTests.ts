import AsyncStorage from '@react-native-async-storage/async-storage';

import { clearTranslationCache } from '@/shared/api';

import { server } from './msw/server';

// Módulos nativos não existem no Jest: usamos os mocks que as próprias bibliotecas publicam.
jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock(
  'react-native-safe-area-context',
  () => jest.requireActual('react-native-safe-area-context/jest/mock').default,
);
// O expo-audio não publica mock e usa a classe nativa AudioPlayer ao ser importado.
// Só as duas funções do alarme dos timers são usadas no app.
jest.mock('expo-audio', () => ({
  createAudioPlayer: () => ({ play: jest.fn(), remove: jest.fn() }),
  setAudioModeAsync: () => Promise.resolve(),
}));

// Qualquer requisição sem resposta simulada quebra o teste: nenhum teste depende da internet.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(async () => {
  server.resetHandlers();
  clearTranslationCache();
  await AsyncStorage.clear();
});

afterAll(() => server.close());
