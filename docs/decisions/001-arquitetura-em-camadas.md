# 001: Arquitetura em camadas

**Status:** aceita · setembro de 2026

## Contexto

O Modo Cozinha vai crescer por 10 semanas, com funcionalidades que se cruzam: a tela de detalhes usa favoritos,
porções e lista de compras ao mesmo tempo. Com pastas genéricas na raiz (`components/`, `hooks/`, `utils/`),
qualquer arquivo acaba importando qualquer outro e fica difícil saber onde cada coisa mora.

## Decisão

Organizar o código por funcionalidade em 6 camadas, inspiradas no Feature-Sliced Design:
`app → screens → widgets → features → entities → shared`.

- Uma camada só importa as que estão abaixo dela.
- Em `screens`, `widgets` e `features`, um módulo não importa outro da mesma camada.
- Todo módulo expõe uma API pública em `index.ts`; imports entre módulos usam o alias `@/`.
- Regras de negócio ficam em funções puras em `lib/`, sem React, e com testes.
- As regras são verificadas pelo ESLint (`no-restricted-imports`) e o CI bloqueia o merge se falharem.

Adaptações para o mobile:

- A camada `pages` do roadmap se chama `screens`.
- `src/app` é também a pasta de rotas do Expo Router. Os arquivos de rota têm uma linha e reexportam uma tela.
- O widget `app-layout` não existe: a barra de abas do Expo Router cumpre esse papel.

## Consequências

- Cada arquivo tem um lugar óbvio, e um módulo pode ser apagado ou reescrito sem efeitos colaterais escondidos.
- Quando duas features precisam conversar, a tela de cima as combina por props. Isso gera um pouco mais de
  código na tela, em troca de features independentes.
- Arquivos de rota precisam de `export default`, exceção liberada no ESLint só para `src/app`.
- Nenhum arquivo que não seja rota pode ficar em `src/app`.
