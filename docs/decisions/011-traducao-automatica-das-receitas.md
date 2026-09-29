# 011: Tradução automática das receitas

**Status:** aceita · setembro de 2026 · substitui o item "Tradução dos nomes e instruções" da lista "Fora do escopo"
do roadmap

## Contexto

A TheMealDB só tem receitas em inglês. O roadmap deixava a tradução de fora ("gera erros e custo de API") e
traduzia só unidades, categorias e origens. Depois de usar o app, a decisão foi que **todas as receitas devem
aparecer em português**. O app não tem back-end, então a tradução precisa ser chamada do celular, sem chave secreta.

## Decisão

- Serviço: o endpoint gratuito do Google Tradutor (`translate.googleapis.com/translate_a/t`), sem chave, que aceita
  vários textos por requisição (POST) e devolve as traduções na mesma ordem. Fica isolado em
  `shared/api/translate.ts`: trocar de serviço é mexer num arquivo só.
- **O que é traduzido:** nome da receita, cada passo (depois do `splitSteps`, para os passos continuarem separados),
  nome dos ingredientes e o texto das medidas. Na tela de detalhe e no modo cozinha vai tudo numa requisição; nos
  cards, só os nomes.
- **Medidas:** número e unidade continuam como a API manda ("2 tbsp"), e só o resto muda de idioma ("2 dentes").
  Assim porções, conversão métrica e soma na lista continuam funcionando. As palavras de medida mais comuns saem de
  um **dicionário próprio**, porque o tradutor erra sem contexto ("cloves" viraria "cravo", e não "dentes").
- **Busca em português:** o termo é traduzido para o inglês (com correções fixas, como "massa" → "pasta") e o app
  busca pelos dois termos, juntando os resultados.
- **Cache:** cada texto traduzido fica salvo no celular (até 3 000 textos), então a mesma receita não é traduzida de
  novo, nem sem internet.
- **Falha:** se o tradutor não responder, a receita aparece em inglês com o aviso "Não foi possível traduzir agora"
  e um botão "Traduzir". Nada quebra.
- Os timers entendem tempos em português ("25 a 30 minutos", "meia hora") e continuam entendendo inglês.

## Consequências

- O app passa a chamar um segundo serviço além da TheMealDB. O RNF15 continua valendo no que importa: nenhum dado
  pessoal sai do celular. Vão para o tradutor só textos de receitas e o termo buscado.
- O endpoint não é oficial: pode mudar ou limitar requisições. O cache reduz o uso, e a queda para o inglês garante
  que o app continua funcionando. Para uma versão publicada, o caminho é um serviço oficial (Google Cloud
  Translation, DeepL) atrás de um back-end próprio, ou a tradução no aparelho (ML Kit), que exige um development
  build.
- A tradução automática pode errar termos de cozinha. O dicionário de medidas e as correções da busca cobrem os
  erros mais comuns e podem crescer com o uso.
- Favoritos e itens da lista salvos antes da tradução continuam com o nome em inglês até serem salvos de novo.
