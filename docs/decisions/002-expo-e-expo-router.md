# 002: Expo e Expo Router

**Status:** aceita · setembro de 2026

## Contexto

O roadmap web usa Vite e React Router. A versão mobile precisa rodar em Android e iOS, ser testada no celular com
facilidade e manter o princípio do roadmap de guardar busca e porções "na URL".

## Decisão

- Usar **Expo SDK 57** com React Native 0.86, sem pastas nativas no repositório (Continuous Native Generation).
- Usar **Expo Router** para a navegação, com rotas definidas por arquivos em `src/app`.
- Navegação principal em **abas inferiores** (`expo-router/js-tabs`), detalhe numa pilha por cima das abas e modo
  cozinha em tela cheia (`presentation: 'fullScreenModal'`).
- Estado da "URL" nos parâmetros da rota (`useLocalSearchParams`), com o scheme `modocozinha://` para deep links.
- As abas usam `expo-router/js-tabs`, e não as abas nativas, que ainda estão marcadas como `unstable` no SDK 57.

## Consequências

- O app roda no celular pelo Expo Go lendo um QR code, sem Android Studio ou Xcode.
- Links como `modocozinha://receita/52772?porcoes=8` abrem o app direto na receita e nas porções certas.
- Bibliotecas nativas precisam ser compatíveis com o SDK; instale sempre com `npx expo install`, que escolhe a
  versão certa.
- `react-dom` precisa ficar na mesma versão do `react` (19.2.3); o `expo-router` o instala para a versão web.
