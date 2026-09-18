# Modo Cozinha Mobile

App de receitas para Android e iOS que ajusta as porções, converte as medidas, monta a lista de compras e guia o
preparo passo a passo com a tela sempre ligada. Versão mobile do Modo Cozinha, feita com React Native e Expo,
usando a API pública [TheMealDB](https://www.themealdb.com/).

> 🚧 Em desenvolvimento. A arquitetura está pronta; as funcionalidades entram a partir da Etapa 1 do roadmap.

## Stack

React Native 0.86 · Expo SDK 57 · Expo Router · TypeScript (strict) · TanStack Query · Zustand · Zod ·
AsyncStorage · Jest · Testing Library · MSW · ESLint · Prettier · GitHub Actions

## Como rodar

Pré-requisitos: Node.js 24 e o app **Expo Go** instalado no celular.

```bash
npm install
npm start
```

Leia o QR code com a câmera (iOS) ou com o Expo Go (Android). O celular e o computador precisam estar na mesma
rede Wi-Fi.

## Comandos

| Comando             | O que faz                                               |
| ------------------- | ------------------------------------------------------- |
| `npm start`         | Servidor do Expo                                        |
| `npm run lint`      | ESLint, incluindo as regras de camadas                  |
| `npm run typecheck` | Verificação de tipos                                    |
| `npm test`          | Testes                                                  |
| `npm run coverage`  | Testes com relatório de cobertura                       |
| `npm run format`    | Formatação com Prettier                                 |
| `npm run build`     | Gera o pacote JavaScript do Android (prova que compila) |

## Arquitetura

Código organizado por funcionalidade em 6 camadas (`app → screens → widgets → features → entities → shared`),
com as regras de dependência garantidas pelo ESLint e verificadas no CI.

- [docs/ARQUITETURA.md](docs/ARQUITETURA.md): camadas, navegação, estado, pastas, testes e como criar um módulo
- [docs/decisions/](docs/decisions/README.md): registros das decisões técnicas
