# 003: Jest no lugar do Vitest

**Status:** aceita · setembro de 2026

## Contexto

O roadmap web usa Vitest. O React Native publica código que precisa de transformações específicas, e o Expo mantém
um preset oficial de testes apenas para o Jest (`jest-expo`).

## Decisão

- **Jest** com o preset `jest-expo`.
- **Testing Library para React Native** (v14, com `render` assíncrono) e `test-renderer` 1.2, a versão indicada
  para React 19.2.
- **MSW** para simular a TheMealDB, recusando qualquer requisição não simulada.
- **`expo-router/testing-library`** para testar as rotas reais, em `__tests__/`, fora de `src/app`.

Ajustes necessários, todos comentados no `jest.config.js`:

- `msw/node` é mapeado direto para o arquivo Node, porque o Jest do React Native resolve pacotes pela condição
  `react-native`, que o MSW declara como indisponível.
- Os pacotes do MSW publicados só como ESM (`.mjs`) são transformados pelo Babel.
- O `tsconfig.json` declara `"types": ["jest"]`, porque o TypeScript 6 não carrega `@types/*` automaticamente.

## Consequências

- A escrita dos testes (`describe`, `it`, `expect`, `getByRole`) é praticamente igual à do roadmap web.
- Funções puras de `lib/` poderiam ser testadas com qualquer um dos dois; só a configuração muda.
- Ao atualizar o MSW, se aparecer `Cannot use import statement outside a module`, o pacote novo deve entrar na
  lista `ESM_PACKAGES` do `jest.config.js`.
