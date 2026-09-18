# Camada `features`

Cada módulo é **uma ação de valor para o usuário**, com interface, estado e lógica próprios.

**Pode importar:** `entities` e `shared`.
**Não pode importar:** `app`, `screens`, `widgets` nem **outra feature**. Quando duas features precisam
conversar, quem junta as duas é a tela, passando dados por props.

| Módulo              | O que faz                             | Biblioteca mobile prevista                         | Etapa |
| ------------------- | ------------------------------------- | -------------------------------------------------- | ----- |
| `browse-recipes/`   | Busca, filtros por categoria e origem | TanStack Query                                     | 2 e 3 |
| `favorite-recipe/`  | Favoritar e listar favoritos          | Zustand + AsyncStorage                             | 3     |
| `adjust-measures/`  | Porções e sistema de medidas          | Zustand + AsyncStorage                             | 4     |
| `cooking-steps/`    | Passo a passo, teclado e gestos       | `react-native-gesture-handler`                     | 5     |
| `kitchen-timers/`   | Timers detectados no texto            | `expo-notifications`, `expo-audio`, `expo-haptics` | 5     |
| `screen-wake-lock/` | Tela sempre ligada                    | `expo-keep-awake`                                  | 5     |
| `shopping-list/`    | Lista somada e compartilhável         | `Share` do React Native, `expo-clipboard`          | 6     |
| `theme-switcher/`   | Tema claro e escuro                   | `Appearance` do React Native                       | 7     |

## Segmentos dentro de cada módulo

Cada módulo só cria os segmentos de que precisa:

```
features/favorite-recipe/
├── ui/        # componentes React Native (FavoriteButton.tsx)
├── model/     # stores Zustand, tipos e hooks de estado (favoritesStore.ts)
├── api/       # chamadas e queries, quando a feature busca dados
├── lib/       # funções puras, sem React (+ testes)
└── index.ts   # API pública: só o que sai daqui pode ser importado de fora
```

Os módulos ainda não existem: cada um nasce na etapa em que é usado.
