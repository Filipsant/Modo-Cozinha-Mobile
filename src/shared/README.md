# Camada `shared`

Código genérico **sem nenhuma regra de receitas**. Se o arquivo sabe o que é uma receita, ele não mora aqui.

**Pode importar:** apenas `shared`.

Diferente das outras camadas, `shared` é dividida em segmentos, e cada segmento tem seu `index.ts`:

| Segmento   | O que contém                                                                                                                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api/`     | `fetchJson`, `HttpError`, `createQueryClient`, o recarregamento ao voltar para o app e `translateTexts` (tradução em lote, com cache no celular)                                                                    |
| `config/`  | Constantes: URL da API, porções base e limites, debounce, quantidade de sugestões                                                                                                                                   |
| `lib/`     | `clamp`, `persistStorage`, `useDebounce`, `useNow`, `useReduceMotion`                                                                                                                                               |
| `theme/`   | Tokens do Figma (cores claro e escuro, espaçamentos, raios, tipografia), `useTheme`, `useAppFonts`                                                                                                                  |
| `ui/`      | Componentes do design system: `AppText`, `Button`, `IconButton`, `Chip`, `SearchInput`, `AppBar`, `Tag`, `SegmentedControl`, `Checkbox`, `Skeleton`, `EmptyState`, `ErrorMessage`, `Toast`, `ConfirmDialog`, `Icon` |
| `testing/` | `renderWithProviders`, `renderRouterWithProviders`, servidor MSW e respostas reais da API                                                                                                                           |

Importe sempre pelo segmento (`@/shared/ui`), nunca por um arquivo interno (`@/shared/ui/Button`).
`@/shared/testing` só pode ser importado por arquivos de teste.

Os ícones do Figma ficam em `ui/icons/` (SVG original) e são registrados em `ui/icons/registry.ts`.
