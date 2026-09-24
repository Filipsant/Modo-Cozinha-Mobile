# Modelos de código

Versão técnica do [GUIA-DOS-ARQUIVOS.md](GUIA-DOS-ARQUIVOS.md), com os detalhes de cada arquivo e modelos de código
prontos para as próximas etapas. Comece pelo guia simples; volte aqui quando for programar uma etapa.

> **Sobre os modelos deste guia.** Todo arquivo completo marcado como **Modelo (Etapa N)** foi criado dentro do
> projeto, compilado pelo TypeScript, aprovado pelo ESLint (inclusive nas regras de camadas) e testado com Jest antes
> de entrar aqui. Depois foi removido, porque pertence à etapa indicada. Você pode copiá-lo como ponto de partida.
> Blocos marcados como **Trecho** são pequenos e servem só para ilustrar.

## Sumário

1. Anatomia de um componente
2. Arquivos da raiz do projeto
3. `src/app`: rotas
4. `src/screens`: telas
5. `src/widgets`: blocos de tela
6. `src/features`: ações do usuário
7. `src/entities`: conceitos do negócio
8. `src/shared`: código genérico
9. Testes
10. Checklist para cada arquivo novo
11. Mensagens do ESLint e como resolver

---

## 1. Anatomia de um componente

Todo componente do projeto segue a mesma ordem. Assim, em qualquer `.tsx` que você abrir, cada parte está sempre
no mesmo lugar.

**Trecho:**

```tsx
// 1. Imports em três grupos, separados por uma linha em branco:
//    bibliotecas externas → módulos do projeto (@/) → arquivos do próprio módulo (./ ou ../)
import { Pressable, StyleSheet, Text } from 'react-native';

import { MIN_TOUCH_TARGET, useTheme } from '@/shared/theme';

// import { algo } from '../model/algo';

// 2. As props numa interface chamada <NomeDoComponente>Props, exportada
export interface ExemploProps {
  label: string;
  onPress: () => void;
}

// 3. O componente: função com exportação nomeada (nunca export default)
export function Exemplo({ label, onPress }: ExemploProps) {
  // 4. Hooks sempre no topo, antes de qualquer if
  const { colors } = useTheme();

  // 5. Valores derivados e funções de evento
  const text = label.toUpperCase();

  // 6. Retornos antecipados para estados especiais (carregando, erro, vazio), quando houver

  // 7. O JSX
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.button}>
      <Text style={{ color: colors.text }}>{text}</Text>
    </Pressable>
  );
}

// 8. Estilos fixos no fim do arquivo
const styles = StyleSheet.create({
  button: {
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
});
```

### Estilos

- **Valor fixo** (não muda nunca): vai no `StyleSheet.create`, no fim do arquivo.
- **Valor que depende do tema ou de uma prop**: objeto dentro do JSX, combinado num array. O item da direita
  sobrescreve o da esquerda: `style={[styles.label, { color: colors.text }]}`.
- **Nunca escreva cor ou tamanho "na mão"** (`'#fff'`, `16`). Use `useTheme()` ou as constantes de `@/shared/theme`.
  Assim o tema escuro funciona sozinho.
- **Não existe CSS**: não há classes, herança de estilo nem `px`. Os números são "pontos" que o celular ajusta à
  densidade da tela. Todo `View` já é `display: flex` com `flexDirection: 'column'`.

### Acessibilidade

| Situação                                     | Como fazer                                                                                                           |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Algo tocável                                 | `Pressable` com `accessibilityRole="button"` e `accessibilityLabel`                                                  |
| Título da tela                               | Use o componente `Title`, que já tem `accessibilityRole="header"`                                                    |
| Área de toque                                | `minHeight` e `minWidth` iguais a `MIN_TOUCH_TARGET` (44)                                                            |
| Botão que liga e desliga (favorito)          | Rótulo que muda: "Adicionar aos favoritos" / "Remover dos favoritos". O React Native não tem o `aria-pressed` do web |
| Desabilitado ou carregando                   | `accessibilityState={{ disabled, busy }}`                                                                            |
| Anunciar mudança ("12 receitas encontradas") | `AccessibilityInfo.announceForAccessibility(texto)`                                                                  |
| Imagem dentro de um botão                    | O rótulo do botão já descreve; a imagem não precisa de texto próprio                                                 |

### Onde guardar o estado

Faça as perguntas nesta ordem e pare na primeira resposta "sim":

1. **Vem da API?** → `useQuery` com as queries de `entities/*/api`. Nunca copie para `useState`.
2. **Precisa sobreviver a recarregar ou ser compartilhado por link?** → parâmetro da rota (`?porcoes=6`).
3. **Várias telas usam e precisa ficar salvo no celular?** → store Zustand com `persist`.
4. **Várias partes usam, mas não precisa ficar salvo?** → store Zustand sem `persist` (timers).
5. **Só este componente usa?** → `useState`.
6. **Dá para calcular a partir de outro valor?** → calcule durante a renderização. Não guarde.

### Onde colocar o arquivo

| Estou criando...                                              | Vai para                                                 |
| ------------------------------------------------------------- | -------------------------------------------------------- |
| Componente visual genérico (botão, chip, toast)               | `src/shared/ui/`                                         |
| Função genérica que não sabe o que é uma receita              | `src/shared/lib/`                                        |
| Tipo, chamada de API ou regra pura sobre receita ou medida    | `src/entities/<nome>/`                                   |
| Algo que o usuário faz (favoritar, ajustar porções, cozinhar) | `src/features/<nome>/`                                   |
| Bloco grande que junta várias peças e aparece em várias telas | `src/widgets/<nome>/`                                    |
| Uma tela                                                      | `src/screens/<nome>/` + um arquivo de rota em `src/app/` |

---

## 2. Arquivos da raiz do projeto

### `package.json`

**O que é:** a "carteira de identidade" do projeto: nome, bibliotecas e comandos (`scripts`).

**Como mexer:**

- Biblioteca que roda **dentro do app**: `npx expo install nome-da-lib`. O Expo escolhe a versão compatível com o
  SDK 57.
- Ferramenta **só de desenvolvimento** (teste, lint, tipos): `npm install --save-dev nome-da-lib`.
- Neste projeto, com o npm 12, `npx expo install x -- --save-dev` coloca o pacote em `dependencies` por engano.
  Confira o `package.json` depois e mova para `devDependencies` se for ferramenta.
- Depois de instalar qualquer coisa, rode `npx expo install --check` para confirmar a compatibilidade.

**Cuidados:**

- `"main": "expo-router/entry"` diz que o app começa pelo Expo Router. Não mude.
- `react` e `react-dom` precisam ter **exatamente a mesma versão** (hoje 19.2.3).
- `test-renderer` fica em `~1.2.0` porque é a versão feita para o React 19.2. Se o React subir de versão menor, suba
  junto.

### `app.json`

**O que é:** a configuração do app nativo: nome, ícone, identidade na loja e plugins.

| Campo                                     | Para que serve                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------------------ |
| `name`                                    | Nome que aparece embaixo do ícone: "Modo Cozinha"                              |
| `slug`                                    | Nome do projeto nos servidores do Expo                                         |
| `scheme`                                  | Prefixo dos links que abrem o app: `modocozinha://receita/52772`               |
| `version`                                 | Versão que o usuário vê na loja (sobe para 0.1.0 no MVP e 1.0.0 no lançamento) |
| `orientation`                             | Só em pé (`portrait`)                                                          |
| `userInterfaceStyle`                      | `automatic`: segue o tema claro ou escuro do celular                           |
| `ios.bundleIdentifier`, `android.package` | Identidade única do app nas lojas. **Não mude depois de publicar**             |
| `plugins`                                 | Bibliotecas que precisam configurar o app nativo                               |

**Como mexer:** algumas bibliotecas pedem para entrar em `plugins`; a documentação delas avisa. Depois de mudar o
`app.json`, pare e rode `npm start` de novo.

**Trecho (Etapa 5):**

```json
"plugins": ["expo-router", "expo-notifications"]
```

### `tsconfig.json`

**O que é:** as regras do TypeScript.

- `extends: "expo/tsconfig.base"`: herda a configuração recomendada pelo Expo.
- `strict: true`: o modo mais rigoroso. Obriga a tratar `null` e `undefined`.
- `types: ["jest"]`: carrega os tipos de `describe`, `it` e `expect`. O TypeScript 6 não faz isso sozinho.
- `paths`: cria o atalho `@/` → `src/`.
- `include`: além dos seus arquivos, inclui `.expo/types` e `expo-env.d.ts`, que o Expo gera se você ativar as rotas
  tipadas no futuro.

**Quando mexer:** quase nunca.

### `eslint.config.js`

**O que é:** as regras de qualidade, incluindo **as regras da arquitetura**. É o arquivo que impede um import no lugar
errado.

**Como ele está montado, de cima para baixo:**

1. `LAYERS`: a lista das camadas, **da mais alta para a mais baixa**. A ordem é a regra: cada camada só importa as
   que vêm depois dela. `sameLayer: false` proíbe um módulo de importar outro da mesma camada.
2. `layerGroup('features')`: gera os padrões `@/features` e `@/features/**`.
3. `PUBLIC_API`: proíbe `@/camada/modulo/arquivo-interno` (três níveis ou mais).
4. `LEAVING_MODULE`: proíbe `../../`, para ninguém sair do módulo por caminho relativo.
5. `TESTING_ONLY`: proíbe `@/shared/testing` fora de testes.
6. `layerRestrictions(index)`: monta a lista de proibições de uma camada olhando a posição dela em `LAYERS`.
7. `layerConfigs`: dois blocos por camada, um para o código (com `TESTING_ONLY`) e outro para os testes (sem).
8. `module.exports`: a ordem importa, porque o último bloco vence: configuração do Expo → pastas ignoradas → regras
   gerais (`no-explicit-any`, `no-default-export`) → exceção para as rotas → camadas → Prettier por último.

**Como mexer:**

- Ignorar uma pasta nova: adicione em `ignores`.
- **Nunca use `// eslint-disable`** para escapar de uma regra de camada. Se o ESLint reclamar, o arquivo está no lugar
  errado ou o import precisa passar pela camada de cima.

### `jest.config.js`

**O que é:** a configuração dos testes. Cada ajuste tem um comentário explicando o motivo.

| Chave                     | O que faz                                                                      |
| ------------------------- | ------------------------------------------------------------------------------ |
| `preset: 'jest-expo'`     | Configuração oficial do Expo: entende React Native, TypeScript e JSX           |
| `setupFilesAfterEnv`      | Roda `src/shared/testing/setupTests.ts` antes de cada arquivo de teste         |
| `moduleNameMapper`        | O atalho `@/` e o caminho direto do `msw/node`                                 |
| `transform`               | Ensina o Jest a transformar arquivos `.mjs`                                    |
| `transformIgnorePatterns` | Lista do jest-expo + os pacotes do MSW em ESM (`ESM_PACKAGES`)                 |
| `collectCoverageFrom`     | Quais arquivos entram na cobertura (fora `index.ts`, rotas e `shared/testing`) |

**Quando mexer:**

- Apareceu `Cannot use import statement outside a module` citando um pacote dentro de `node_modules`? Adicione o
  nome dele em `ESM_PACKAGES`.
- Na Etapa 4, quando existirem pastas `lib/`, adicione as metas de cobertura do roadmap.

**Trecho (Etapa 4):**

```js
coverageThreshold: {
  global: { lines: 70 },
  './src/entities/**/lib/': { lines: 90 },
  './src/features/**/lib/': { lines: 90 },
},
```

### `.prettierrc` e `.prettierignore`

**O que são:** o estilo de formatação (aspas simples, vírgula no final, linhas de até 110 caracteres) e a lista do
que o Prettier não formata (o `package-lock.json`).

**Como usar:** não formate à mão. Rode `npm run format` antes de commitar, ou ative "Format on Save" no VS Code com a
extensão do Prettier.

### `.gitignore`

**O que é:** o que o Git não guarda: `node_modules`, `.expo`, `dist`, `coverage`, chaves de assinatura e as pastas
nativas `/ios` e `/android`, que o Expo gera sozinho quando precisa.

### `.github/workflows/ci.yml`

**O que é:** o "fiscal" que roda no GitHub a cada push na `main` e a cada pull request, nesta ordem: instalar
(`npm ci`) → formatação → lint → tipos → testes → build do Android. Se um passo falha, os seguintes não rodam e o PR
fica vermelho.

**Quando mexer:** na Etapa 7, para publicar o relatório de cobertura. Adicione um passo novo no fim da lista.

---

## 3. `src/app`: rotas

**Regra de ouro:** tudo o que é `.ts` ou `.tsx` dentro de `src/app` vira uma tela do app. Aqui só entram arquivos de
rota e `_layout.tsx`. Testes, componentes e funções vão para outras pastas.

### `_layout.tsx` (raiz)

**O que faz:** é o "esqueleto" que envolve todas as telas.

- `const queryClient = createQueryClient()`: fica **fora** da função para ser criado uma única vez. Dentro dela, seria
  recriado a cada renderização e o cache seria perdido.
- `useRefetchOnAppFocus()`: recarrega os dados quando o app volta do segundo plano.
- `<QueryClientProvider>`: disponibiliza o cache do TanStack Query para todas as telas.
- `<Stack>`: a pilha de navegação. Cada `Stack.Screen` configura uma rota:
  - `(tabs)` sem cabeçalho, porque as abas têm o próprio layout;
  - `receita/[id]/index` com o título "Receita" e o botão de voltar automático;
  - `receita/[id]/cozinhar` em tela cheia (`fullScreenModal`), sem cabeçalho.
- `<StatusBar style="auto" />`: a barra de hora e bateria acompanha o tema.

**Como mexer:**

- **Novo provider global:** envolva o `QueryClientProvider`. Na Etapa 5, os gestos de deslizar precisam do
  `GestureHandlerRootView`.
- **Mudar o cabeçalho de uma tela da pilha:** edite as `options` do `Stack.Screen` correspondente.
- Nada de lógica de tela aqui.

**Trecho (Etapa 5):**

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// dentro do return:
<GestureHandlerRootView style={styles.root}>
  <QueryClientProvider client={queryClient}>{/* ... */}</QueryClientProvider>
</GestureHandlerRootView>;

// no fim do arquivo:
const styles = StyleSheet.create({ root: { flex: 1 } });
```

### `(tabs)/_layout.tsx`

**O que faz:** a barra de abas inferior com Início, Favoritos e Lista de compras.

- `headerShown: false`: as abas não mostram cabeçalho nativo; cada tela exibe o próprio título grande.
- `tabBarActiveTintColor: colors.primary`: a aba ativa usa a cor principal do tema.
- Cada `Tabs.Screen` tem `name` igual ao nome do arquivo (`index`, `favoritos`, `lista-de-compras`).

**Como mexer (Etapa 1): ícones nas abas.** Instale com `npx expo install @expo/vector-icons`.

**Trecho:**

```tsx
import Ionicons from '@expo/vector-icons/Ionicons';

<Tabs.Screen
  name="favoritos"
  options={{
    title: 'Favoritos',
    tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" color={color} size={size} />,
  }}
/>;
```

**Contador de itens na aba Lista (Etapa 6):** use a opção `tabBarBadge` com o número de itens pendentes, lido do
store da lista de compras.

### Arquivos de rota

| Arquivo                       | Endereço                   | Tela                  |
| ----------------------------- | -------------------------- | --------------------- |
| `(tabs)/index.tsx`            | `/`                        | `HomeScreen`          |
| `(tabs)/favoritos.tsx`        | `/favoritos`               | `FavoritesScreen`     |
| `(tabs)/lista-de-compras.tsx` | `/lista-de-compras`        | `ShoppingListScreen`  |
| `receita/[id]/index.tsx`      | `/receita/52772`           | `RecipeDetailsScreen` |
| `receita/[id]/cozinhar.tsx`   | `/receita/52772/cozinhar`  | `CookingModeScreen`   |
| `+not-found.tsx`              | qualquer endereço inválido | `NotFoundScreen`      |

Todos têm **uma linha só**:

```ts
export { FavoritesScreen as default } from '@/screens/favorites';
```

- O Expo Router exige `export default`; a linha pega a exportação nomeada da tela e a entrega como `default`.
- O nome do **arquivo** está em português porque vira o endereço que o usuário vê. O nome da **tela** está em inglês,
  seguindo a convenção de código.
- Nomes especiais: `_layout` (esqueleto de um grupo), `(grupo)` (agrupa sem mudar o endereço), `[param]` (parte
  variável do endereço), `+not-found` (endereço inexistente).

### Passo a passo: adicionar uma tela nova

Exemplo: uma tela "Sobre" no endereço `/sobre`.

1. Crie a tela em `src/screens/about/AboutScreen.tsx` com `export function AboutScreen()`.
2. Crie `src/screens/about/index.ts` com `export { AboutScreen } from './AboutScreen';`.
3. Crie a rota `src/app/sobre.tsx` com `export { AboutScreen as default } from '@/screens/about';`.
4. Se precisar de um título no cabeçalho, adicione no `_layout.tsx` raiz:
   `<Stack.Screen name="sobre" options={{ title: 'Sobre' }} />`.
5. Adicione uma linha no `__tests__/routes.test.tsx`: `['/sobre', 'Sobre']`.

### Navegar entre telas

**Trecho:**

```tsx
import { Link, useLocalSearchParams, useRouter } from 'expo-router';

// Link: um texto ou botão que leva a outra tela
<Link href="/favoritos">Favoritos</Link>;
<Link href={{ pathname: '/receita/[id]', params: { id: '52772', porcoes: '6' } }}>Abrir receita</Link>;

// Navegação por código, por exemplo depois de um toque
const router = useRouter();
router.push('/receita/52772?porcoes=6'); // abre por cima (o botão voltar funciona)
router.back(); // volta uma tela
router.setParams({ q: 'chicken' }); // muda ?q= sem abrir uma tela nova (busca da Etapa 2)

// Ler o endereço atual
const { id, porcoes } = useLocalSearchParams<{ id: string; porcoes?: string }>();
```

Parâmetros de rota **sempre chegam como texto**. Converta e limite antes de usar:
`clamp(Number(porcoes) || BASE_SERVINGS, MIN_SERVINGS, MAX_SERVINGS)`.

---

## 4. `src/screens`: telas

**O que uma tela faz:** lê os parâmetros da rota, chama os hooks de dados, escolhe o que mostrar em cada estado
(carregando, erro, vazio, pronto) e **compõe** peças das camadas de baixo, passando dados entre elas por props.
**O que ela não faz:** regra de negócio, `fetch` e estilos complexos. Se a tela passar de cerca de 150 linhas, extraia
partes para um widget ou para os módulos de baixo.

Cada tela tem uma pasta com o componente e um `index.ts` que o exporta. O `index.ts` é a "porta de entrada": quem
está fora só enxerga o que passa por ele.

### As telas de hoje

| Arquivo                                  | O que tem hoje                                                                                                                                                                                                        |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `home/HomeScreen.tsx`                    | Título, texto e um `Link` provisório para `/receita/52772?porcoes=4`. `edges={['top']}` porque as abas não têm cabeçalho                                                                                              |
| `recipe-details/RecipeDetailsScreen.tsx` | Lê `id` e `porcoes` com `useLocalSearchParams`. Se `porcoes` não vier, usa `BASE_SERVINGS`. O link "Começar a cozinhar" leva as porções adiante com `{ pathname: '/receita/[id]/cozinhar', params: { id, porcoes } }` |
| `cooking-mode/CookingModeScreen.tsx`     | Tela cheia: `edges` nos quatro lados, para desviar do notch. O botão "Sair" usa `router.back()` e tem `minHeight: MIN_TOUCH_TARGET`                                                                                   |
| `favorites/FavoritesScreen.tsx`          | Título e texto, com `edges={['top']}`                                                                                                                                                                                 |
| `shopping-list/ShoppingListScreen.tsx`   | Título e texto, com `edges={['top']}`                                                                                                                                                                                 |
| `not-found/NotFoundScreen.tsx`           | `<Stack.Screen options={{ title: 'Não encontrada' }} />` muda o cabeçalho de dentro da própria tela; link para `/`                                                                                                    |

### O que cada tela vai receber

| Tela                  | Peças (camada)                                                                                                                                              | Etapas |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `HomeScreen`          | `SearchBar`, `CategoryFilter`, `AreaFilter`, `useRecipeResults` (feature browse-recipes), `RecipeResults` (widget), botão "Surpreenda-me"                   | 2 e 3  |
| `RecipeDetailsScreen` | `FavoriteButton` (favorite-recipe), `ServingsControl` e `UnitToggle` (adjust-measures), `IngredientList` (entity recipe), `AddToListButton` (shopping-list) | 2 a 6  |
| `CookingModeScreen`   | `StepView`, `ProgressBar`, `IngredientDrawer` (cooking-steps), `TimerBar` (kitchen-timers), `WakeLockBadge` (screen-wake-lock)                              | 5      |
| `FavoritesScreen`     | `useFavoritesStore` e `RecipeCard`, ordenação e `Toast` com "Desfazer"                                                                                      | 3      |
| `ShoppingListScreen`  | `ShoppingItemRow`, `ShareButton` (shopping-list), `ConfirmDialog` (shared/ui)                                                                               | 6      |

### Modelo (Etapas 2 e 3): tela de detalhes com dados da API

Mostra os três pilares de uma tela: **ler a rota, buscar os dados e tratar cada estado**, compondo uma entity
(`recipeQueries`) e uma feature (`FavoriteButton`) sem que uma conheça a outra.

```tsx
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, Text } from 'react-native';

import { recipeQueries } from '@/entities/recipe';
import { FavoriteButton } from '@/features/favorite-recipe';
import { useTheme } from '@/shared/theme';
import { Button, Paragraph, Screen, Title } from '@/shared/ui';

export function RecipeDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: recipe, isPending, isError, refetch } = useQuery(recipeQueries.detail(id));
  const { colors, spacing, fontSize } = useTheme();

  if (isPending) {
    return (
      <Screen>
        <ActivityIndicator accessibilityLabel="Carregando receita" />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <Paragraph>Não foi possível carregar a receita. Verifique sua conexão.</Paragraph>
        <Button label="Tentar de novo" onPress={() => refetch()} />
      </Screen>
    );
  }

  if (!recipe) {
    return (
      <Screen>
        <Title>Receita não encontrada</Title>
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: recipe.name, headerRight: () => <FavoriteButton recipe={recipe} /> }} />
      <ScrollView contentContainerStyle={{ gap: spacing.md }}>
        <Title>{recipe.name}</Title>
        {recipe.ingredients.map((ingredient) => (
          <Text key={ingredient.name} style={{ color: colors.text, fontSize: fontSize.md }}>
            {ingredient.measure} {ingredient.name}
          </Text>
        ))}
        <Paragraph>{recipe.instructions}</Paragraph>
      </ScrollView>
    </Screen>
  );
}
```

**Explicação:**

- `useQuery(recipeQueries.detail(id))`: a tela não sabe a URL da API nem o tempo de cache; isso está na entity.
- **Três retornos antecipados** antes do conteúdo: carregando, erro (com "Tentar de novo") e receita inexistente
  (`null`, quando a API responde `{ "meals": null }`). É o RF03 e o RF07 aplicados.
- `<Stack.Screen options={...} />` dentro da tela muda o cabeçalho: o título vira o nome da receita e o
  `FavoriteButton` aparece no canto direito.
- A tela real continua lendo `porcoes` da rota e mantendo o link para o modo cozinha. Este modelo mostra só a parte
  nova.
- `ScrollView` serve para conteúdo de tamanho conhecido. Para listas longas ou infinitas, use `FlatList`.

O teste desta tela está na seção 9.

---

## 5. `src/widgets`: blocos de tela

**O que é um widget:** um bloco grande que junta várias peças (entities e features) e aparece em mais de uma tela.
Ele **recebe os dados por props**: quem busca os dados é a tela.

### Modelo (Etapa 2): `recipe-results/ui/RecipeResults.tsx`

```tsx
import { ActivityIndicator, FlatList, View, useWindowDimensions } from 'react-native';

import { RecipeCard, type RecipeSummary } from '@/entities/recipe';
import { FavoriteButton } from '@/features/favorite-recipe';
import { useTheme } from '@/shared/theme';
import { Button, Paragraph } from '@/shared/ui';

export interface RecipeResultsProps {
  recipes: RecipeSummary[] | undefined;
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  onOpenRecipe: (id: string) => void;
}

/** Junta uma entity (RecipeCard) e uma feature (FavoriteButton) e trata os estados da lista. */
export function RecipeResults({ recipes, isPending, isError, onRetry, onOpenRecipe }: RecipeResultsProps) {
  const { width } = useWindowDimensions();
  const { spacing } = useTheme();
  const columns = width >= 900 ? 4 : width >= 600 ? 3 : 2;

  if (isPending) {
    return <ActivityIndicator accessibilityLabel="Carregando receitas" />;
  }

  if (isError) {
    return (
      <View style={{ gap: spacing.sm }}>
        <Paragraph>Não foi possível carregar as receitas.</Paragraph>
        <Button label="Tentar de novo" onPress={onRetry} />
      </View>
    );
  }

  if (!recipes || recipes.length === 0) {
    return <Paragraph>Nenhuma receita encontrada. Tente outro termo.</Paragraph>;
  }

  return (
    <FlatList
      key={columns}
      data={recipes}
      numColumns={columns}
      keyExtractor={(recipe) => recipe.id}
      columnWrapperStyle={{ gap: spacing.sm }}
      contentContainerStyle={{ gap: spacing.sm }}
      renderItem={({ item }) => (
        <RecipeCard recipe={item} onPress={onOpenRecipe} actions={<FavoriteButton recipe={item} />} />
      )}
    />
  );
}
```

E o `recipe-results/index.ts`:

```ts
export { RecipeResults, type RecipeResultsProps } from './ui/RecipeResults';
```

**Explicação:**

- O widget pode importar a feature `FavoriteButton` porque `widgets` fica **acima** de `features`. O `RecipeCard`,
  que é uma entity, não pode, e por isso recebe o botão pronto pela prop `actions`.
- `onOpenRecipe` vem da tela. O widget não decide para onde navegar.
- `FlatList` só desenha os itens que aparecem na tela, o que importa em listas grandes. `numColumns` monta a grade e
  `key={columns}` é obrigatório: a `FlatList` precisa ser recriada quando o número de colunas muda (ao girar um
  tablet, por exemplo).
- Na Etapa 2, troque o `ActivityIndicator` por 8 `SkeletonCard` e anuncie a quantidade com
  `AccessibilityInfo.announceForAccessibility('12 receitas encontradas')`.

**Trecho: como a `HomeScreen` vai usar o widget (Etapa 2):**

```tsx
const router = useRouter();
const { data, isPending, isError, refetch } = useRecipeResults(); // da feature browse-recipes

<RecipeResults
  recipes={data}
  isPending={isPending}
  isError={isError}
  onRetry={() => refetch()}
  onOpenRecipe={(id) => router.push(`/receita/${id}`)}
/>;
```

---

## 6. `src/features`: ações do usuário

**O que é uma feature:** uma ação de valor para o usuário, com tudo o que ela precisa: componentes (`ui/`), estado
(`model/`), regras puras (`lib/`) e, se buscar dados, `api/`. Uma feature **não importa outra feature**.

### Modelo (Etapa 3): `favorite-recipe`

```
src/features/favorite-recipe/
├── model/
│   ├── favoritesStore.ts
│   └── favoritesStore.test.ts
├── ui/
│   ├── FavoriteButton.tsx
│   └── FavoriteButton.test.tsx
└── index.ts
```

#### `model/favoritesStore.ts`: o estado salvo no celular

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { RecipeSummary } from '@/entities/recipe';
import { persistStorage, storageKey } from '@/shared/lib';

export interface FavoriteRecipe extends RecipeSummary {
  savedAt: number;
}

interface FavoritesState {
  items: FavoriteRecipe[];
  add: (recipe: RecipeSummary) => void;
  remove: (id: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      items: [],

      add: (recipe) =>
        set((state) =>
          state.items.some((item) => item.id === recipe.id)
            ? state
            : { items: [{ ...recipe, savedAt: Date.now() }, ...state.items] },
        ),

      remove: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
    }),
    {
      name: storageKey('favorites'),
      version: 1,
      storage: persistStorage,
    },
  ),
);

/** Seletor pequeno: o componente só renderiza de novo quando ESTA receita muda. */
export function useIsFavorite(id: string): boolean {
  return useFavoritesStore((state) => state.items.some((item) => item.id === id));
}
```

**Explicação:**

- `create<FavoritesState>()(...)`: os **dois pares de parênteses** são exigência do Zustand 5 com TypeScript. O
  primeiro recebe o tipo, o segundo recebe o store.
- **Dados e ações ficam juntos** na mesma interface. As ações usam `set`, que recebe o estado atual e devolve **só o
  que mudou**. Devolver o próprio `state` significa "não mude nada".
- **Nunca altere o array direto** (`state.items.push(...)`). Crie um novo (`[novo, ...state.items]`); é assim que o
  React percebe a mudança.
- `persist(...)` salva no celular. As três opções são obrigatórias no projeto: `name` com `storageKey` (prefixo
  `modo-cozinha:`), `version` (para migrar se o formato mudar) e `storage: persistStorage` (AsyncStorage).
- `useIsFavorite` é um **seletor**: `useFavoritesStore((state) => ...)` devolve só um pedaço do estado. O componente só
  renderiza de novo quando esse pedaço muda. Nunca use `useFavoritesStore()` sem seletor.
- O AsyncStorage é **assíncrono**: ao abrir o app, os favoritos levam alguns milissegundos para carregar. Se uma tela
  mostrar "Nenhum favorito" por um instante, espere `useFavoritesStore.persist.hasHydrated()`.

#### `ui/FavoriteButton.tsx`: o botão

```tsx
import { Pressable, StyleSheet, Text } from 'react-native';

import type { RecipeSummary } from '@/entities/recipe';
import { MIN_TOUCH_TARGET, useTheme } from '@/shared/theme';

import { useFavoritesStore, useIsFavorite } from '../model/favoritesStore';

export interface FavoriteButtonProps {
  recipe: RecipeSummary;
}

export function FavoriteButton({ recipe }: FavoriteButtonProps) {
  const isFavorite = useIsFavorite(recipe.id);
  const add = useFavoritesStore((state) => state.add);
  const remove = useFavoritesStore((state) => state.remove);
  const { colors, fontSize } = useTheme();

  const toggle = () => (isFavorite ? remove(recipe.id) : add(recipe));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      onPress={toggle}
      style={styles.button}
    >
      <Text style={{ color: colors.primary, fontSize: fontSize.xl }}>{isFavorite ? '♥' : '♡'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

**Explicação:**

- `import type { RecipeSummary } from '@/entities/recipe'`: a feature pode usar a entity, porque ela fica abaixo.
  `import type` importa só o tipo, sem código.
- `import ... from '../model/favoritesStore'`: **dentro** do próprio módulo, caminho relativo.
- Cada ação é lida com seu próprio seletor (`(state) => state.add`).
- O rótulo muda conforme o estado. É o que o leitor de tela anuncia, e é por ele que o teste encontra o botão.
- Os coraçõezinhos em texto são provisórios. Na Etapa 1 viram ícones do `@expo/vector-icons`.

#### `index.ts`: a porta de entrada

```ts
export { useFavoritesStore, useIsFavorite, type FavoriteRecipe } from './model/favoritesStore';
export { FavoriteButton, type FavoriteButtonProps } from './ui/FavoriteButton';
```

Só sai daqui o que outras camadas usam. A tela de favoritos vai usar `useFavoritesStore` para listar; a de detalhes,
o `FavoriteButton`.

Os testes desta feature estão na seção 9.

### Mapa das features que vão nascer

Nomes de arquivo previstos pelo roadmap, já no lugar certo:

| Feature            | `ui/`                                               | `model/`                                                | `lib/` (puro, com testes)             |
| ------------------ | --------------------------------------------------- | ------------------------------------------------------- | ------------------------------------- |
| `browse-recipes`   | `SearchBar`, `CategoryFilter`, `AreaFilter`         | `useBrowseParams`, `useRecipeResults`                   | `resolveQuery`                        |
| `favorite-recipe`  | `FavoriteButton`                                    | `favoritesStore`                                        | —                                     |
| `adjust-measures`  | `ServingsControl`, `UnitToggle`                     | `useServings`, `unitSystemStore`, `useMeasureFormatter` | —                                     |
| `cooking-steps`    | `StepView`, `ProgressBar`, `IngredientDrawer`       | `useStepNavigation` (teclado e gestos)                  | —                                     |
| `kitchen-timers`   | `TimerBar`, `StartTimerButton`                      | `timersStore`, `alarm` (som, vibração e notificação)    | `detectTimers`, `formatDuration`      |
| `screen-wake-lock` | `WakeLockBadge`                                     | `useWakeLock` (com `expo-keep-awake`)                   | —                                     |
| `shopping-list`    | `AddToListButton`, `ShoppingItemRow`, `ShareButton` | `shoppingListStore`                                     | `normalizeName`, `formatShoppingList` |
| `theme-switcher`   | `ThemeToggle`                                       | `themeStore`                                            | —                                     |

No roadmap web o `alarm` ficava em `lib/`. Aqui ele vai para `model/`, porque usa bibliotecas nativas
(`expo-audio`, `expo-haptics`, `expo-notifications`) e `lib/` só aceita TypeScript puro.

---

## 7. `src/entities`: conceitos do negócio

**O que é uma entity:** um conceito do negócio (receita, medida) com seus tipos, o acesso aos dados e as regras puras.
Não sabe nada de telas nem de ações do usuário.

### O caminho de um dado, da API até a tela

```
TheMealDB
  → fetchJson (shared/api)            baixa o JSON; erro de HTTP vira HttpError
  → mealsResponseSchema.parse (Zod)   confere o formato; se mudou, erro claro aqui
  → mapMealToRecipe                   converte "strMeal" em "name" etc.
  → Recipe                            o tipo que o resto do app conhece
  → cache do TanStack Query           recipeQueries define chave e tempo de cache
  → useQuery na tela
```

### Modelo (Etapa 2): `recipe`

```
src/entities/recipe/
├── api/
│   ├── recipe.dto.ts          schemas Zod (formato da API)
│   ├── recipe.mapper.ts       API → app
│   ├── recipe.mapper.test.ts
│   ├── mealdbClient.ts        chamadas HTTP
│   └── recipe.queries.ts      chaves e cache do TanStack Query
├── model/recipe.types.ts      tipos do app
├── ui/RecipeCard.tsx
└── index.ts
```

#### `model/recipe.types.ts`: os tipos do app

```ts
export interface Ingredient {
  name: string;
  /** Texto livre da API, ex.: "1/2 cup". O parser da Etapa 4 transforma em número e unidade. */
  measure: string;
}

/** O que os filtros da API devolvem: só id, nome e foto. Categoria e origem são opcionais. */
export interface RecipeSummary {
  id: string;
  name: string;
  thumbnail: string;
  category?: string;
  area?: string;
}

export interface Recipe extends RecipeSummary {
  category: string;
  area: string;
  instructions: string;
  ingredients: Ingredient[];
  youtubeUrl: string | null;
}
```

Nomes claros em inglês, sem nada do formato da API. `Recipe extends RecipeSummary`: toda receita completa também
serve onde se espera um resumo (no card ou nos favoritos, por exemplo).

#### `api/recipe.dto.ts`: o formato da API, validado com Zod

```ts
import { z } from 'zod';

/**
 * Formato cru de uma receita da TheMealDB (DTO = Data Transfer Object).
 * Os ingredientes chegam em 40 campos soltos (strIngredient1..20 e strMeasure1..20);
 * looseObject mantém esses campos extras para o mapper ler.
 */
export const mealDtoSchema = z.looseObject({
  idMeal: z.string(),
  strMeal: z.string(),
  strMealThumb: z.string(),
  strCategory: z.string().nullish(),
  strArea: z.string().nullish(),
  strInstructions: z.string().nullish(),
  strYoutube: z.string().nullish(),
});

/** Toda resposta vem como { meals: [...] } ou { meals: null } quando não há resultado. */
export const mealsResponseSchema = z.object({
  meals: z.array(mealDtoSchema).nullable(),
});

export type MealDto = z.infer<typeof mealDtoSchema>;
```

- `nullish()` aceita `null` e `undefined`, e a TheMealDB usa os dois.
- `z.infer` cria o tipo TypeScript a partir do schema, então você não escreve o tipo duas vezes.
- Este arquivo **não sai do módulo**: fica fora do `index.ts`.

#### `api/recipe.mapper.ts`: da API para o app

```ts
import type { Ingredient, Recipe } from '../model/recipe.types';
import type { MealDto } from './recipe.dto';

const MAX_INGREDIENTS = 20;

function readText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** Converte o formato da API para o formato do app. Nenhum outro arquivo conhece "strMeal". */
export function mapMealToRecipe(dto: MealDto): Recipe {
  const ingredients: Ingredient[] = [];

  for (let index = 1; index <= MAX_INGREDIENTS; index++) {
    const name = readText(dto[`strIngredient${index}`]);
    if (name) {
      ingredients.push({ name, measure: readText(dto[`strMeasure${index}`]) });
    }
  }

  return {
    id: dto.idMeal,
    name: dto.strMeal,
    thumbnail: dto.strMealThumb,
    category: readText(dto.strCategory),
    area: readText(dto.strArea),
    instructions: readText(dto.strInstructions),
    ingredients,
    youtubeUrl: readText(dto.strYoutube) || null,
  };
}
```

É a "camada anticorrupção" do roadmap: se a TheMealDB mudar um nome de campo, só este arquivo muda. `readText` trata
de uma vez os campos vazios, nulos e com espaços sobrando.

#### `api/mealdbClient.ts`: as chamadas HTTP

```ts
import { fetchJson } from '@/shared/api';
import { API_BASE_URL } from '@/shared/config';

import type { Recipe } from '../model/recipe.types';
import { mealsResponseSchema } from './recipe.dto';
import { mapMealToRecipe } from './recipe.mapper';

/** Busca, valida com Zod e converte. Se a API mudar de formato, o erro aparece aqui, não na tela. */
async function getRecipes(path: string, signal?: AbortSignal): Promise<Recipe[]> {
  const json = await fetchJson(`${API_BASE_URL}/${path}`, signal);
  const { meals } = mealsResponseSchema.parse(json);
  return (meals ?? []).map(mapMealToRecipe);
}

export const mealdbClient = {
  search(term: string, signal?: AbortSignal): Promise<Recipe[]> {
    return getRecipes(`search.php?s=${encodeURIComponent(term)}`, signal);
  },

  async getById(id: string, signal?: AbortSignal): Promise<Recipe | null> {
    const [recipe] = await getRecipes(`lookup.php?i=${encodeURIComponent(id)}`, signal);
    return recipe ?? null;
  },
};
```

- É o **único arquivo** que conhece os endereços `search.php`, `lookup.php` etc.
- `encodeURIComponent` protege contra espaços e acentos no termo de busca.
- `signal` permite cancelar: o TanStack Query cancela a busca anterior quando o usuário continua digitando.
- Na Etapa 2 entram `getRandom`; na Etapa 3, `listCategories`, `listAreas`, `filterByCategory` e `filterByArea`.
  Os filtros devolvem só id, nome e foto, então vão precisar de um schema e de um mapper para `RecipeSummary`.

#### `api/recipe.queries.ts`: chaves e cache

```ts
import { queryOptions } from '@tanstack/react-query';

import { mealdbClient } from './mealdbClient';

const FIVE_MINUTES = 5 * 60 * 1000;
const THIRTY_MINUTES = 30 * 60 * 1000;

/**
 * Chave + função + tempo de cache de cada consulta, num lugar só.
 * O `signal` cancela a requisição anterior quando o usuário continua digitando.
 */
export const recipeQueries = {
  search: (term: string) =>
    queryOptions({
      queryKey: ['recipes', 'search', term],
      queryFn: ({ signal }) => mealdbClient.search(term, signal),
      staleTime: FIVE_MINUTES,
      enabled: term.trim().length > 0,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: ['recipes', 'detail', id],
      queryFn: ({ signal }) => mealdbClient.getById(id, signal),
      staleTime: THIRTY_MINUTES,
    }),
};
```

- `queryKey` é o "endereço" do dado no cache. Mesma chave = mesmo dado reaproveitado. Por isso, ao voltar do detalhe
  para a busca, os resultados aparecem na hora.
- `staleTime` segue a tabela do roadmap: busca 5 min, detalhe 30 min, categorias e origens `Infinity`.
- `enabled: false` com busca vazia evita chamar a API sem termo.
- A receita aleatória **não usa cache**: o botão chama `mealdbClient.getRandom()` direto e navega.

#### `ui/RecipeCard.tsx`: o card

```tsx
import type { ReactNode } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/shared/theme';

import type { RecipeSummary } from '../model/recipe.types';

export interface RecipeCardProps {
  recipe: RecipeSummary;
  onPress: (id: string) => void;
  /** Ações de outras features (ex.: botão de favorito), recebidas prontas. O card não as conhece. */
  actions?: ReactNode;
}

export function RecipeCard({ recipe, onPress, actions }: RecipeCardProps) {
  const { colors, spacing, radius, fontSize } = useTheme();
  const details = [recipe.category, recipe.area].filter(Boolean).join(' · ');

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Abrir receita ${recipe.name}`}
        onPress={() => onPress(recipe.id)}
      >
        <Image source={{ uri: `${recipe.thumbnail}/preview` }} style={styles.image} />
        <View style={{ padding: spacing.sm, gap: spacing.xs }}>
          <Text style={[styles.name, { color: colors.text, fontSize: fontSize.md }]}>{recipe.name}</Text>
          {details ? (
            <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm }}>{details}</Text>
          ) : null}
        </View>
      </Pressable>

      {actions ? (
        <View style={[styles.actions, { top: spacing.xs, right: spacing.xs }]}>{actions}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  name: {
    fontWeight: '600',
  },
  actions: {
    position: 'absolute',
  },
});
```

- **A prop `actions`** é o truque do roadmap ("inversão de dependência por composição"): o card fica em `entities` e
  não pode importar a feature de favoritos, então recebe o botão pronto de quem está acima.
- **`onPress` em vez de navegar:** o card não conhece as rotas. Quem o usa decide para onde ir.
- `/preview` no fim da URL pede à TheMealDB a versão pequena da foto, que carrega mais rápido.
- `details ? (...) : null`: no React Native, **todo texto precisa estar dentro de um `<Text>`**, senão o app quebra.
  Com `&&`, se o lado esquerdo for o número `0` (por exemplo, `items.length && ...`), o React tenta desenhar "0" solto
  na tela. O ternário com `null` é sempre seguro, por isso vira o padrão do projeto.
- Na Etapa 2, troque o `Image` do React Native pelo `expo-image` (`npx expo install expo-image`), que tem cache e
  transição suave.

#### `index.ts`: a porta de entrada

```ts
export { mealdbClient } from './api/mealdbClient';
export { recipeQueries } from './api/recipe.queries';
export type { Ingredient, Recipe, RecipeSummary } from './model/recipe.types';
export { RecipeCard, type RecipeCardProps } from './ui/RecipeCard';
```

`recipe.dto.ts` e `recipe.mapper.ts` **não** são exportados: são detalhes internos da entity.

### Etapa 4: `measure`

```
src/entities/measure/
├── model/units.ts              tipo Unit, sinônimos (tablespoons, Tbs → tbsp) e traduções
├── lib/
│   ├── parseMeasure.ts          "1 1/2 tbsp" → { quantity: 1.5, unit: 'tbsp', ... }
│   ├── parseMeasure.test.ts     escreva ANTES da implementação (TDD)
│   ├── scaleMeasure.ts          multiplica pelo fator de porções
│   ├── toMetric.ts              oz e lb → g; cup, tbsp, tsp e fl oz → ml
│   ├── formatMeasure.ts         0,5 → ½; tradução para português
│   └── (um .test.ts para cada)
└── index.ts
```

**Trecho: um formato possível para o resultado do parser.**

```ts
export interface ParsedMeasure {
  quantity: number | null; // 0.5 em "1/2 cup"; null em "to taste"
  quantityMax: number | null; // 2 em "1-2 cloves"
  unit: Unit | null; // 'cup', 'tbsp', 'g'...
  rest: string; // "cloves", "large", "to taste"
  original: string; // o texto original nunca se perde
}
```

Tudo em `lib/` é **TypeScript puro**: nada de React, React Native ou rede. Isso deixa os testes instantâneos e
permite copiar o código para a versão web sem mudanças.

---

## 8. `src/shared`: código genérico

Tudo aqui serve para qualquer app. Se o arquivo sabe o que é uma receita, está no lugar errado.

### `config/index.ts`

Constantes do app: `API_BASE_URL`, `BASE_SERVINGS` (4), `MIN_SERVINGS` (1), `MAX_SERVINGS` (20),
`SEARCH_DEBOUNCE_MS` (400) e `STORAGE_PREFIX` (`modo-cozinha:`).

**Como mexer:** nome em `UPPER_SNAKE_CASE`, com um comentário quando o número não se explica sozinho. Use com
`import { MAX_SERVINGS } from '@/shared/config'`. Nunca repita um desses números em outro arquivo.

### `theme/tokens.ts`

Os "design tokens":

- `ColorPalette`: a interface com os nomes das cores (`primary`, `onPrimary`, `background`, `surface`, `text`,
  `textSecondary`, `border`, `success`, `error`).
- `lightColors` e `darkColors`: os valores em cada tema. **A paleta é provisória** e será definida na Etapa 1.
- `spacing` (4, 8, 16, 24, 32), `radius`, `fontSize` (14, 16, 20, 24, 32).
- `MIN_TOUCH_TARGET` (44) e `COOKING_MIN_FONT_SIZE` (24).

**Como adicionar uma cor:** adicione o nome em `ColorPalette` e o valor nas **duas** paletas. Se esquecer uma, o
TypeScript avisa. Confira o contraste no WebAIM Contrast Checker (mínimo 4,5:1).

### `theme/useTheme.ts`

Lê o tema do celular com `useColorScheme()` e devolve `{ scheme, colors, spacing, radius, fontSize }`. Use em todo
componente que tem cor:

```tsx
const { colors, spacing } = useTheme();
```

Na Etapa 7, a feature `theme-switcher` troca o tema com `Appearance.setColorScheme('dark')`, e este hook percebe
sozinho, sem precisar conhecer a feature.

### `theme/index.ts`

Exporta tudo do tema. Importe sempre de `@/shared/theme`.

### `api/queryClient.ts`

- `createQueryClient()`: cria o cliente com `staleTime` padrão de 5 minutos e **uma** nova tentativa em caso de erro.
- `useRefetchOnAppFocus()`: escuta o `AppState` do React Native. Quando o app volta a ficar ativo, avisa o TanStack
  Query com `focusManager.setFocused(true)`, e os dados velhos são recarregados. No web, o navegador faz isso sozinho.

### Modelo (Etapa 2): `api/fetchJson.ts`

```ts
/** Erro de HTTP com o status, para a tela diferenciar "não encontrada" (404) de "erro de rede". */
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

/** Único lugar do app que chama fetch. Devolve unknown: quem chama valida com Zod. */
export async function fetchJson(url: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new HttpError(response.status, `A requisição falhou com status ${response.status}`);
  }

  return response.json();
}
```

E o `api/index.ts` passa a exportar os dois:

```ts
export { HttpError, fetchJson } from './fetchJson';
export { createQueryClient, useRefetchOnAppFocus } from './queryClient';
```

- Devolver `unknown` (e não `any`) obriga quem chama a validar os dados com Zod antes de usar.
- `fetch` só lança erro quando **não há conexão**. Um 404 ou 500 chega como resposta normal; por isso se confere
  `response.ok`.

### `lib/persistStorage.ts`

- `persistStorage`: o AsyncStorage adaptado para o `persist` do Zustand (`createJSONStorage`).
- `storageKey('favorites')` → `'modo-cozinha:favorites'`.

Use os dois em **todo** store persistido (veja o `favoritesStore` na seção 6).

### Modelo (Etapa 4): `lib/clamp.ts`

```ts
/** Mantém um número dentro de um intervalo: clamp(25, 1, 20) → 20. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
```

E o teste `lib/clamp.test.ts`:

```ts
import { clamp } from './clamp';

describe('clamp', () => {
  it.each([
    [25, 20],
    [0, 1],
    [6, 6],
  ])('clamp(%d, 1, 20) → %d', (value, expected) => {
    expect(clamp(value, 1, 20)).toBe(expected);
  });
});
```

Uma função pura: mesma entrada, mesma saída, sem efeitos colaterais. `it.each` roda o mesmo teste para cada linha da
tabela. Não esqueça de exportar no `lib/index.ts`.

### `ui/Screen.tsx`

O "fundo" de toda tela: cor de fundo do tema, espaçamento interno (`padding`) e espaço entre os filhos (`gap`).

| `edges`                              | Quando usar                                          |
| ------------------------------------ | ---------------------------------------------------- |
| nenhum (padrão)                      | Telas com cabeçalho nativo (detalhe, não encontrada) |
| `['top']`                            | Telas das abas, que não têm cabeçalho                |
| `['top', 'bottom', 'left', 'right']` | Modo cozinha, em tela cheia                          |

`edges` diz de quais bordas a tela deve "fugir" para não ficar embaixo do notch, da câmera ou da barra de gestos.

### `ui/Title.tsx` e `ui/Paragraph.tsx`

- `Title`: fonte de 32, negrito e `accessibilityRole="header"`. O TalkBack e o VoiceOver anunciam como título, e os
  testes o encontram com `getByRole('header', { name: '...' })`.
- `Paragraph`: texto secundário de 16.

### `ui/index.ts`

**Todo componente novo precisa ser exportado aqui**, senão ninguém fora da pasta consegue usá-lo.

### Modelo (Etapa 1): `ui/Button.tsx`

```tsx
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { MIN_TOUCH_TARGET, useTheme } from '@/shared/theme';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: ButtonProps) {
  const { colors, spacing, radius, fontSize } = useTheme();
  const isPrimary = variant === 'primary';
  const isInactive = disabled || loading;

  const backgroundColor = isPrimary ? colors.primary : 'transparent';
  const textColor = isPrimary ? colors.onPrimary : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isInactive, busy: loading }}
      disabled={isInactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor,
          borderColor: colors.primary,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          opacity: isInactive ? 0.5 : pressed ? 0.8 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.label, { color: textColor, fontSize: fontSize.md }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  label: {
    fontWeight: '600',
  },
});
```

- **Variantes** por prop (`variant`), com valor padrão na desestruturação (`variant = 'primary'`).
- `style={({ pressed }) => [...]}`: o `Pressable` aceita uma função que recebe se o dedo está apertando. É o
  equivalente ao `:active` do CSS.
- `loading` troca o texto por um indicador e desabilita o botão, para evitar toque duplo.
- `accessibilityState` avisa o leitor de tela que o botão está desabilitado ou ocupado.

**Outros componentes da Etapa 1**, seguindo o mesmo formato:

| Componente      | Detalhe importante                                                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `IconButton`    | `accessibilityLabel: string` **obrigatório** nas props: um botão só com ícone precisa de nome para o leitor de tela                         |
| `Input`         | `TextInput` com `accessibilityLabel` e botão de limpar                                                                                      |
| `Chip`          | `accessibilityState={{ selected }}`, testável com `toBeSelected()`                                                                          |
| `SkeletonCard`  | Retângulos cinza no formato do card; animação desligada quando o sistema pede menos movimento (`AccessibilityInfo.isReduceMotionEnabled()`) |
| `EmptyState`    | Ícone, título, texto e uma ação opcional                                                                                                    |
| `ErrorMessage`  | Mensagem e botão "Tentar de novo"                                                                                                           |
| `Toast`         | Confirmações e "Desfazer"; anuncie com `AccessibilityInfo.announceForAccessibility`                                                         |
| `ConfirmDialog` | `Modal` do React Native; o botão "voltar" do Android fecha pelo `onRequestClose`                                                            |

**Trecho: props de um botão só com ícone.**

```ts
export interface IconButtonProps {
  icon: ReactNode;
  /** Obrigatório: um botão só com ícone precisa de um nome para o leitor de tela. */
  accessibilityLabel: string;
  onPress: () => void;
}
```

### `testing/setupTests.ts`

Roda antes de cada arquivo de teste:

1. Troca o AsyncStorage e a área segura da tela pelos mocks que as próprias bibliotecas publicam, porque módulos
   nativos não existem no Jest. Dentro de `jest.mock`, use `jest.requireActual` para carregar o mock.
2. `beforeAll`: liga o servidor MSW com `onUnhandledRequest: 'error'`. Qualquer requisição sem resposta simulada
   quebra o teste.
3. `afterEach`: desfaz as respostas trocadas no teste (`server.resetHandlers()`) e limpa o AsyncStorage.
4. `afterAll`: desliga o servidor.

### `testing/renderWithProviders.tsx`

- `createTestQueryClient()`: um cache novo por teste, **sem novas tentativas** (senão um teste de erro esperaria a
  segunda tentativa).
- `renderWithProviders(<Componente />)`: renderiza já dentro do `QueryClientProvider`. Use para componentes que chamam
  `useQuery` e **não** leem a rota. Se a tela lê a rota, use o `renderRouter` (seção 9).

### `testing/msw/handlers.ts` e `testing/msw/server.ts`

- `handlers`: as respostas simuladas que valem para todos os testes. Hoje a lista está vazia.
- `server`: o servidor MSW criado com esses handlers.

**Trecho (Etapa 2): uma resposta global usando uma fixture real.**

```ts
import { HttpResponse, http, type RequestHandler } from 'msw';

import { API_BASE_URL } from '@/shared/config';

import lookupWithVideo from '../fixtures/lookup-com-video.json';

export const handlers: RequestHandler[] = [
  http.get(`${API_BASE_URL}/lookup.php`, () => HttpResponse.json(lookupWithVideo)),
];
```

Dentro de um teste, `server.use(...)` troca uma resposta só para aquele teste (exemplo na seção 9).

### `testing/fixtures/`

Respostas **reais** da TheMealDB salvas em JSON. O `README.md` da pasta lista as 5 para salvar na Etapa 0.

### `testing/index.ts`

Exporta `server`, `createTestQueryClient` e `renderWithProviders`. Só arquivos `.test.ts(x)` podem importar
`@/shared/testing`, e o ESLint garante isso.

---

## 9. Testes

### Onde fica cada teste

| O que testar                 | Onde                                    | Exemplo                         |
| ---------------------------- | --------------------------------------- | ------------------------------- |
| Função pura                  | Ao lado: `lib/clamp.test.ts`            | `clamp`, `parseMeasure`, mapper |
| Store Zustand                | Ao lado: `model/favoritesStore.test.ts` | favoritar, somar na lista       |
| Componente com comportamento | Ao lado: `ui/FavoriteButton.test.tsx`   | tocar e ver o resultado         |
| Tela com a API simulada      | Ao lado: `RecipeDetailsScreen.test.tsx` | carregar, erro, tentar de novo  |
| Rotas do app                 | `__tests__/routes.test.tsx`             | cada endereço abre a tela certa |

Todo teste segue três blocos, separados por uma linha em branco: **preparar**, **agir** e **verificar**.

### Os testes de hoje

- **`__tests__/routes.test.tsx`:** `renderRouter('./src/app', { initialUrl })` monta o app **com as rotas reais**.
  `it.each` roda o mesmo teste para as 6 rotas, procurando o título com `findByRole('header', { name })`. Dois testes
  extras conferem que `?porcoes=6` chega ao detalhe e ao modo cozinha. Fica fora de `src/app` porque lá todo `.tsx`
  vira rota.
- **`src/shared/lib/persistStorage.test.ts`:** confere o prefixo de `storageKey` e salva e lê um valor pelo
  `persistStorage`, usando o AsyncStorage simulado.
- **`src/shared/ui/Title.test.tsx`:** confere que o `Title` é anunciado como título.

### Modelo: teste de store (`favoritesStore.test.ts`)

```ts
import { useFavoritesStore } from './favoritesStore';

const recipe = { id: '52772', name: 'Teriyaki Chicken Casserole', thumbnail: 'https://exemplo/foto.jpg' };

beforeEach(() => {
  useFavoritesStore.setState(useFavoritesStore.getInitialState());
});

describe('favoritesStore', () => {
  it('adiciona a mesma receita uma vez só', () => {
    useFavoritesStore.getState().add(recipe);
    useFavoritesStore.getState().add(recipe);

    expect(useFavoritesStore.getState().items).toHaveLength(1);
  });

  it('remove pelo id', () => {
    useFavoritesStore.getState().add(recipe);
    useFavoritesStore.getState().remove('52772');

    expect(useFavoritesStore.getState().items).toEqual([]);
  });
});
```

- Um store Zustand pode ser usado **fora do React**: `getState()` lê e chama ações; `setState()` altera.
- `beforeEach` com `getInitialState()` zera o store antes de cada teste. Sem isso, um teste herda o que o anterior
  deixou.

### Modelo: teste de componente (`FavoriteButton.test.tsx`)

```tsx
import { render, screen, userEvent } from '@testing-library/react-native';

import { useFavoritesStore } from '../model/favoritesStore';
import { FavoriteButton } from './FavoriteButton';

const recipe = { id: '52772', name: 'Teriyaki Chicken Casserole', thumbnail: 'https://exemplo/foto.jpg' };

beforeEach(() => {
  useFavoritesStore.setState(useFavoritesStore.getInitialState());
});

describe('FavoriteButton', () => {
  it('adiciona e remove dos favoritos, trocando o rótulo', async () => {
    const user = userEvent.setup();
    await render(<FavoriteButton recipe={recipe} />);

    await user.press(screen.getByRole('button', { name: 'Adicionar aos favoritos' }));
    expect(useFavoritesStore.getState().items).toHaveLength(1);

    await user.press(screen.getByRole('button', { name: 'Remover dos favoritos' }));
    expect(useFavoritesStore.getState().items).toHaveLength(0);
    expect(screen.getByRole('button', { name: 'Adicionar aos favoritos' })).toBeOnTheScreen();
  });
});
```

- **`await render(...)`**: na Testing Library v14, `render` é assíncrono. Esquecer o `await` gera erros estranhos.
- **`userEvent`** simula o dedo de verdade (apertar, soltar). Prefira-o ao `fireEvent`.
- **Encontre elementos como o usuário encontra**: pelo papel e pelo nome (`getByRole('button', { name })`), nunca por
  estilo ou `testID`. Se o teste não acha o botão pelo nome, o leitor de tela também não acharia.

### Modelo: teste de tela com a API simulada (`RecipeDetailsScreen.test.tsx`)

```tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { userEvent } from '@testing-library/react-native';
import { renderRouter, screen } from 'expo-router/testing-library';
import { HttpResponse, http } from 'msw';
import type { ReactNode } from 'react';

import { API_BASE_URL } from '@/shared/config';
import { createTestQueryClient, server } from '@/shared/testing';

import { RecipeDetailsScreen } from './RecipeDetailsScreen';

const meal = {
  idMeal: '52772',
  strMeal: 'Teriyaki Chicken Casserole',
  strMealThumb: 'https://exemplo/foto.jpg',
  strInstructions: 'Preheat oven to 350° F.',
  strIngredient1: 'soy sauce',
  strMeasure1: '3/4 cup',
};

function renderDetails() {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderRouter(
    { 'receita/[id]/index': RecipeDetailsScreen },
    { initialUrl: '/receita/52772', wrapper },
  );
}

describe('RecipeDetailsScreen', () => {
  it('mostra ingredientes e instruções vindos da API', async () => {
    server.use(http.get(`${API_BASE_URL}/lookup.php`, () => HttpResponse.json({ meals: [meal] })));

    await renderDetails();

    expect(await screen.findByRole('header', { name: 'Teriyaki Chicken Casserole' })).toBeOnTheScreen();
    expect(screen.getByText('3/4 cup soy sauce')).toBeOnTheScreen();
  });

  it('mostra o erro e tenta de novo', async () => {
    server.use(http.get(`${API_BASE_URL}/lookup.php`, () => new HttpResponse(null, { status: 500 })));
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    await renderDetails();
    const retry = await screen.findByRole('button', { name: 'Tentar de novo' });

    server.use(http.get(`${API_BASE_URL}/lookup.php`, () => HttpResponse.json({ meals: [meal] })));
    await user.press(retry);

    expect(await screen.findByRole('header', { name: 'Teriyaki Chicken Casserole' })).toBeOnTheScreen();
  });
});
```

- `server.use(http.get(...))` escolhe **o que a "API" responde neste teste**: sucesso, erro 500, lista vazia.
- `renderRouter({ 'receita/[id]/index': RecipeDetailsScreen }, ...)` cria um app de mentira com **uma rota só**, para
  a tela conseguir ler o `id` do endereço. O `wrapper` coloca o `QueryClientProvider` em volta.
- `findBy...` **espera** o elemento aparecer, para dados que chegam depois (da API, por exemplo). `getBy...` procura
  na hora.
- `userEvent.setup({ advanceTimers: jest.advanceTimersByTime })`: o `renderRouter` liga os relógios falsos do Jest, e o
  `userEvent` precisa saber disso para não travar.
- Importe o `userEvent` de `@testing-library/react-native`. O `expo-router/testing-library` não o exporta.

### Comandos úteis

| Comando                      | O que faz                                             |
| ---------------------------- | ----------------------------------------------------- |
| `npm test`                   | Roda todos os testes                                  |
| `npm test -- FavoriteButton` | Roda só os arquivos cujo nome contém "FavoriteButton" |
| `npm run test:watch`         | Roda de novo a cada arquivo salvo                     |
| `npm run coverage`           | Mostra quanto do código os testes cobrem              |

### Armadilhas comuns

| Sintoma                                                                 | Causa e solução                                                                                           |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `[MSW] Error: intercepted a request without a matching request handler` | O teste chamou a API sem resposta simulada. Adicione um `server.use(...)`                                 |
| Um teste passa sozinho e falha junto com os outros                      | Estado vazando: zere o store com `setState(getInitialState())` no `beforeEach`                            |
| `Unable to find an element with role...`                                | O elemento não tem `accessibilityRole` ou `accessibilityLabel`; ou o dado ainda não chegou (use `findBy`) |
| Teste com `userEvent` fica parado até dar timeout                       | Faltou `advanceTimers: jest.advanceTimersByTime` num teste com `renderRouter`                             |
| `Cannot use import statement outside a module`                          | Pacote em ESM: adicione o nome em `ESM_PACKAGES` no `jest.config.js`                                      |

---

## 10. Checklist para cada arquivo novo

- [ ] Está na camada certa (tabela "Onde colocar o arquivo", na seção 1).
- [ ] O nome segue o padrão: pasta de módulo em `kebab-case` e inglês; componente em `PascalCase`; hook começa com
      `use`; store termina em `Store`; função pura começa com um verbo (`parseMeasure`); teste termina em `.test.ts(x)`.
- [ ] Exportação nomeada (`export function X`) e exportado no `index.ts` do módulo.
- [ ] Props numa `interface <Nome>Props`.
- [ ] Cores e tamanhos vêm do tema; estilos fixos ficam no `StyleSheet.create`.
- [ ] Tem `accessibilityRole` e `accessibilityLabel` quando é tocável, com área de toque de pelo menos 44.
- [ ] Textos da interface em português do Brasil.
- [ ] Tem teste ao lado: sempre para `lib/` e stores; para componentes com comportamento.
- [ ] `npm run lint`, `npm run typecheck` e `npm test` passam.

---

## 11. Mensagens do ESLint e como resolver

| Mensagem                                                           | O que significa                              | Como resolver                                                        |
| ------------------------------------------------------------------ | -------------------------------------------- | -------------------------------------------------------------------- |
| `A camada "X" não pode importar a camada "Y", que está acima dela` | Você está puxando algo de um andar de cima   | Mova o código para uma camada mais baixa ou receba o valor por props |
| `Um módulo de "features" não importa outro módulo de "features"`   | Duas features se conhecendo                  | A tela (ou um widget) importa as duas e passa os dados por props     |
| `Importe pela API pública do módulo (o index.ts)`                  | Import de um arquivo interno de outro módulo | Exporte no `index.ts` do módulo e importe `@/camada/modulo`          |
| `Para sair do módulo, use o alias @/`                              | Caminho `../../`                             | Troque por `@/camada/modulo`                                         |
| `@/shared/testing só pode ser importado por arquivos de teste`     | Código do app usando ferramenta de teste     | Mova o uso para um `.test.tsx`                                       |
| `Prefer named exports`                                             | `export default` fora das rotas              | `export function Nome()`                                             |
| `Unexpected any. Specify a different type`                         | Tipo `any`                                   | Escreva o tipo; para dado externo use `unknown` e valide com Zod     |
| `Unable to resolve path to module`                                 | Caminho errado ou módulo sem `index.ts`      | Confira o caminho e se o `index.ts` exporta o que você importou      |
