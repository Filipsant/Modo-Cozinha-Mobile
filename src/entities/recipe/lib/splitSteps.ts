/** Linha que é só um marcador: "step 1", "STEP 2", "3", "4.". */
const STEP_MARKER = /^(step\s*\d+|\d+)\s*[.:)-]?$/i;
/** Marcador no começo da linha: "STEP 1: Aqueça...", "1. Aqueça...", "* Enquanto isso...". */
const STEP_PREFIX = /^(step\s*\d+\s*[.:)-]?\s*|\d+[.)]\s+|\*\s*)/i;
/** Fim de frase seguido de nova frase. Não quebra "1.5 cups", porque exige espaço depois do ponto. */
const SENTENCE_END = /([.!?])\s+(?=[A-Z0-9"'(])/g;

function splitSentences(text: string): string[] {
  return text
    .replace(SENTENCE_END, '$1\n')
    .split('\n')
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

/**
 * Divide as instruções em passos para o modo cozinha: por linha e, se vier um bloco único, por frase.
 * Remove os marcadores "step 1" que algumas receitas trazem em linhas soltas.
 */
export function splitSteps(instructions: string): string[] {
  const lines = instructions
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !STEP_MARKER.test(line))
    .map((line) => line.replace(STEP_PREFIX, '').trim())
    .filter(Boolean);

  const [onlyLine] = lines;
  return lines.length === 1 && onlyLine ? splitSentences(onlyLine) : lines;
}
