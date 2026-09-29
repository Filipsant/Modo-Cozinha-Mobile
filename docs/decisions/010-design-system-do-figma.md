# 010: Design system do Figma no React Native

**Status:** aceita · setembro de 2026

## Contexto

O design do Figma ("Modo Cozinha — Design System & Componentes" e as telas mobile de 390 px) foi feito com
tokens, a fonte Plus Jakarta Sans e ícones Material Symbols. React Native não tem CSS nem SVG nativo, e o plano
gratuito do Figma limitou a leitura automática às telas de biblioteca de componentes e Início.

## Decisão

- **Tokens** em `shared/theme/tokens.ts`: cores do Figma (roxo #7752D5, fundo #F8F9FD, textos #191C1F/#494453),
  tema escuro com os mesmos nomes, grade de 8 px, raios 6/8/12/16 e a escala tipográfica (32, 24, 20, 16, 14).
- **Fonte:** Plus Jakarta Sans pelo `@expo-google-fonts`, um arquivo por peso (no Android, `fontWeight` não escolhe
  o peso de uma fonte personalizada). A tela de abertura espera a fonte carregar.
- **Ícones:** os SVGs exportados do Figma ficam em `shared/ui/icons/` sem alteração e são desenhados pelo
  `expo-image` com `tintColor`, para seguir o tema. Ícones de telas ainda não exportadas usam Material Icons
  (`@expo/vector-icons`), da mesma família visual; trocar um ícone é mudar uma linha em `icons/registry.ts`.
- Onde o design e a acessibilidade discordam, vale a WCAG AA que o próprio design system exige: o cinza de
  legenda #7A7485 (4,3:1 sobre o fundo) virou #6E6879 (5,1:1).
- Elementos do protótipo sem dado real não foram copiados como estavam: o "Simulador de Estados UX" (os estados
  aparecem de verdade), o selo "cozinhar offline" (o app precisa de internet para buscar; no lugar dele fica o
  "Surpreenda-me"), o tempo de preparo e a descrição em português nos cards (a API não fornece).

## Consequências

- Nenhuma cor, fonte ou tamanho está escrito à mão nos componentes: o tema escuro funciona sozinho.
- As telas Detalhe, Modo Cozinha, Lista, Favoritos e Não encontrada foram montadas com os componentes da biblioteca
  do Figma e devem ser conferidas com os frames exportados assim que estiverem em `docs/design/`.
