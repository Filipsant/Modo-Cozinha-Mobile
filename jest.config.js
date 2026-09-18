const expoPreset = require('jest-expo/jest-preset');

/**
 * Pacotes do MSW publicados só como ESM (import/export). O Jest não os lê sem transformar,
 * então eles saem da lista de ignorados do jest-expo.
 */
const ESM_PACKAGES = ['msw', '@mswjs', '@open-draft', 'rettime', 'until-async'];

const [expoIgnoreNodeModules, ...expoOtherIgnores] = expoPreset.transformIgnorePatterns;

/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/src/shared/testing/setupTests.ts'],

  moduleNameMapper: {
    // O mesmo alias @/ do tsconfig.json.
    '^@/(.*)$': '<rootDir>/src/$1',
    // O Jest do React Native resolve pacotes pela condição "react-native", e o MSW declara
    // "msw/node" como indisponível nela. Os testes rodam no Node, então apontamos direto para o arquivo.
    '^msw/node$': '<rootDir>/node_modules/msw/lib/node/index.js',
  },

  transform: {
    // O jest-expo só transforma .js/.ts/.tsx; alguns pacotes do MSW usam .mjs.
    '\\.mjs$': expoPreset.transform['\\.[jt]sx?$'],
  },

  transformIgnorePatterns: [
    expoIgnoreNodeModules.replace('))', `|${ESM_PACKAGES.join('|')}))`),
    ...expoOtherIgnores,
  ],

  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/index.ts', '!src/app/**', '!src/shared/testing/**'],
};
