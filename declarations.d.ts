/**
 * Arquivos de imagem e som importados no código viram um número (o id do asset no Metro).
 * Fica na raiz, e não em src/, porque o formato de módulo exige export default.
 */
declare module '*.svg' {
  const source: number;
  export default source;
}

declare module '*.wav' {
  const source: number;
  export default source;
}
