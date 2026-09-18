# Camada `shared`

Código genérico **sem nenhuma regra de receitas**. Se o arquivo sabe o que é uma receita, ele não mora aqui.

**Pode importar:** apenas `shared`.

Diferente das outras camadas, `shared` é dividida em segmentos, e cada segmento tem seu `index.ts`:

| Segmento   | O que contém                                                                      | No roadmap web era             |
| ---------- | --------------------------------------------------------------------------------- | ------------------------------ |
| `api/`     | `createQueryClient` e a integração do TanStack Query com o ciclo de vida do app   | `app/providers/queryClient.ts` |
| `config/`  | Constantes: URL da API, porções base, limites                                     | igual                          |
| `lib/`     | Utilitários genéricos, como `persistStorage` para os stores Zustand               | igual                          |
| `theme/`   | Cores (claro e escuro), espaçamentos, fontes e `useTheme`                         | `styles/` (Sass)               |
| `ui/`      | Componentes base: `Screen`, `Title` e, na Etapa 1, `Button`, `Chip`, `Toast` etc. | igual                          |
| `testing/` | `renderWithProviders`, servidor MSW e respostas reais da API                      | igual                          |

Importe sempre pelo segmento (`@/shared/ui`), nunca por um arquivo interno (`@/shared/ui/Screen`).
`@/shared/testing` só pode ser importado por arquivos de teste.
