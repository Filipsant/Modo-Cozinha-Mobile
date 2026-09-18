import AsyncStorage from '@react-native-async-storage/async-storage';

import { server } from './msw/server';

// Módulos nativos não existem no Jest: usamos os mocks que as próprias bibliotecas publicam.
jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock(
  'react-native-safe-area-context',
  () => jest.requireActual('react-native-safe-area-context/jest/mock').default,
);

// Qualquer requisição sem resposta simulada quebra o teste: nenhum teste depende da internet.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(async () => {
  server.resetHandlers();
  await AsyncStorage.clear();
});

afterAll(() => server.close());
