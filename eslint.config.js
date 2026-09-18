// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier/flat');

/**
 * Camadas da mais alta para a mais baixa. Uma camada só importa as que estão depois dela.
 * `sameLayer: false` proíbe um módulo de importar outro módulo da mesma camada.
 */
const LAYERS = [
  { name: 'app', sameLayer: true },
  { name: 'screens', sameLayer: false },
  { name: 'widgets', sameLayer: false },
  { name: 'features', sameLayer: false },
  { name: 'entities', sameLayer: true },
  { name: 'shared', sameLayer: true },
];

const layerGroup = (name) => [`@/${name}`, `@/${name}/**`];

const PUBLIC_API = {
  group: ['@/*/*/**'],
  message:
    'Importe pela API pública do módulo (o index.ts): use "@/features/favorite-recipe", não um arquivo interno.',
};

const LEAVING_MODULE = {
  group: ['../../**'],
  message: 'Para sair do módulo, use o alias @/ apontando para a API pública, não caminhos relativos.',
};

const TESTING_ONLY = {
  group: layerGroup('shared/testing'),
  message: '@/shared/testing só pode ser importado por arquivos de teste.',
};

const TEST_FILES = ['**/*.test.ts', '**/*.test.tsx'];

function layerRestrictions(index) {
  const layer = LAYERS[index];
  const patterns = [PUBLIC_API, LEAVING_MODULE];

  for (const upper of LAYERS.slice(0, index)) {
    patterns.push({
      group: layerGroup(upper.name),
      message: `A camada "${layer.name}" não pode importar a camada "${upper.name}", que está acima dela.`,
    });
  }

  if (!layer.sameLayer) {
    patterns.push({
      group: layerGroup(layer.name),
      message: `Um módulo de "${layer.name}" não importa outro módulo de "${layer.name}". Quem combina os dois é a camada de cima; dentro do próprio módulo use imports relativos.`,
    });
  }

  return patterns;
}

const layerConfigs = LAYERS.flatMap((layer, index) => {
  const files = [`src/${layer.name}/**/*.{ts,tsx}`];
  const patterns = layerRestrictions(index);

  return [
    {
      files,
      ignores: TEST_FILES,
      rules: { 'no-restricted-imports': ['error', { patterns: [...patterns, TESTING_ONLY] }] },
    },
    {
      files: TEST_FILES.map((pattern) => `src/${layer.name}/${pattern}`),
      rules: { 'no-restricted-imports': ['error', { patterns }] },
    },
  ];
});

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', '.expo/*', 'coverage/*'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'import/no-default-export': 'error',
    },
  },
  {
    // O Expo Router exige export default nos arquivos de rota.
    files: ['src/app/**/*.{ts,tsx}'],
    rules: { 'import/no-default-export': 'off' },
  },
  ...layerConfigs,
  prettierConfig,
]);
