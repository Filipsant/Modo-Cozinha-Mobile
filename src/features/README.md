# Camada `features`

Cada módulo é **uma ação de valor para o usuário**, com interface, estado e lógica próprios.

**Pode importar:** `entities` e `shared`.
**Não pode importar:** `app`, `screens`, `widgets` nem **outra feature**. Quando duas features precisam
conversar, quem junta as duas é a tela, passando dados por props.

| Módulo              | O que faz                                           | Peças principais                                                                  |
| ------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------- |
| `browse-recipes/`   | Busca em português ou inglês e filtros              | `SearchBar`, `CategoryFilter`, `OriginFilter`, `useRecipeResults`, `resolveQuery` |
| `favorite-recipe/`  | Favoritar e ordenar favoritos, salvos no celular    | `FavoriteButton`, `useFavoritesStore`, `sortFavorites`                            |
| `adjust-measures/`  | Porções (1 a 20, no endereço) e sistema de medidas  | `ServingsControl`, `UnitToggle`, `useServings`, `useMeasureFormatter`             |
| `cooking-steps/`    | Um passo por vez, gestos e gaveta de ingredientes   | `StepView`, `ProgressBar`, `IngredientDrawer`, `useStepNavigation`                |
| `kitchen-timers/`   | Timers detectados no texto, em destaque, com alarme | `StartTimerButton`, `TimerBar`, `TimerCard`, `detectTimers`, `useTimerAlarms`     |
| `screen-wake-lock/` | Tela sempre ligada (`expo-keep-awake`)              | `useWakeLock`, `WakeLockBadge`                                                    |
| `shopping-list/`    | Lista somada, marcável e compartilhável             | `AddToListButton`, `ShoppingItemRow`, `useShoppingListStore`, `shareList`         |
| `theme-switcher/`   | Tema claro e escuro, salvo no celular               | `ThemeToggle`, `useApplyThemePreference`                                          |

## Segmentos dentro de cada módulo

Cada módulo só cria os segmentos de que precisa:

```
features/kitchen-timers/
├── ui/        # componentes React Native (TimerBar.tsx)
├── model/     # stores Zustand, hooks e código com módulos nativos (timersStore.ts, alarm.ts)
├── api/       # chamadas e queries, quando a feature busca dados
├── lib/       # funções puras, sem React (+ testes)
├── assets/    # arquivos da própria feature (o som do alarme)
└── index.ts   # API pública: só o que sai daqui pode ser importado de fora
```
