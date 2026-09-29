/// <reference types="node" />
/**
 * Coleta todas as medidas únicas da TheMealDB (search.php?f=a até f=z) e salva em
 * src/shared/testing/fixtures/measures.json, para testar o parser com dados reais.
 *
 * Rodar com: node scripts/collect-measures.ts   (Node 24 entende TypeScript direto)
 */
import { writeFile } from 'node:fs/promises';

const API = 'https://www.themealdb.com/api/json/v1/1';
const OUTPUT = 'src/shared/testing/fixtures/measures.json';
const MAX_INGREDIENTS = 20;

type Meal = Record<string, string | null>;

async function mealsByLetter(letter: string): Promise<Meal[]> {
  const response = await fetch(`${API}/search.php?f=${letter}`);
  const json = (await response.json()) as { meals: Meal[] | null };
  return json.meals ?? [];
}

async function main() {
  const measures = new Set<string>();
  let mealCount = 0;

  for (const letter of 'abcdefghijklmnopqrstuvwxyz') {
    const meals = await mealsByLetter(letter);
    mealCount += meals.length;

    for (const meal of meals) {
      for (let index = 1; index <= MAX_INGREDIENTS; index++) {
        const measure = meal[`strMeasure${index}`]?.trim();
        if (measure) measures.add(measure);
      }
    }
  }

  const sorted = [...measures].sort((a, b) => a.localeCompare(b));
  await writeFile(OUTPUT, `${JSON.stringify(sorted, null, 2)}\n`);
  console.log(`${sorted.length} medidas únicas de ${mealCount} receitas salvas em ${OUTPUT}`);
}

void main();
