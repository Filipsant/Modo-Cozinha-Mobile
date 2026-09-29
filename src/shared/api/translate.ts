import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';

import { STORAGE_PREFIX, TRANSLATE_API_URL } from '@/shared/config';

import { fetchJson } from './fetchJson';

export interface TranslateOptions {
  /** Idioma de origem, como "en". */
  from: string;
  /** Idioma de destino, como "pt". */
  to: string;
  signal?: AbortSignal;
}

/** Com o idioma de origem fixo, o serviço devolve só a lista de traduções, na mesma ordem. */
const responseSchema = z.array(z.string());

/** Textos por requisição: o serviço aceita cerca de 5 000 caracteres; ficamos abaixo disso. */
const MAX_CHARS_PER_REQUEST = 4000;
const CACHE_KEY = `${STORAGE_PREFIX}translations`;
/** Limite do cache salvo no celular: os mais antigos saem primeiro. */
const MAX_CACHE_ENTRIES = 3000;

let cache: Map<string, string> | null = null;

async function loadCache(): Promise<Map<string, string>> {
  if (cache) return cache;

  let saved: Record<string, string> = {};
  try {
    saved = JSON.parse((await AsyncStorage.getItem(CACHE_KEY)) ?? '{}') as Record<string, string>;
  } catch {
    // Cache corrompido: começa vazio.
  }
  cache ??= new Map(Object.entries(saved));
  return cache;
}

function saveCache(entries: Map<string, string>): void {
  const recent = [...entries].slice(-MAX_CACHE_ENTRIES);
  AsyncStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(recent))).catch(() => undefined);
}

/** Divide os textos em lotes que cabem numa requisição. */
function toBatches(texts: string[]): string[][] {
  const batches: string[][] = [];
  let current: string[] = [];
  let size = 0;

  for (const text of texts) {
    if (current.length > 0 && size + text.length > MAX_CHARS_PER_REQUEST) {
      batches.push(current);
      current = [];
      size = 0;
    }
    current.push(text);
    size += text.length;
  }
  if (current.length > 0) batches.push(current);
  return batches;
}

async function requestTranslations(
  texts: string[],
  { from, to, signal }: TranslateOptions,
): Promise<string[]> {
  const body = texts.map((text) => `q=${encodeURIComponent(text)}`).join('&');
  const json = await fetchJson(`${TRANSLATE_API_URL}?client=gtx&sl=${from}&tl=${to}`, signal, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body,
  });

  const translations = responseSchema.parse(json);
  if (translations.length !== texts.length) {
    throw new Error(`A tradução devolveu ${translations.length} textos para ${texts.length} pedidos`);
  }
  return translations;
}

/**
 * Traduz vários textos de uma vez, mantendo a ordem. Textos já traduzidos saem do cache, sem internet.
 * Se o serviço falhar, lança o erro: quem chama decide mostrar o texto original.
 */
export async function translateTexts(texts: string[], options: TranslateOptions): Promise<string[]> {
  const entries = await loadCache();
  const keyOf = (text: string) => `${options.from}>${options.to}:${text}`;
  const missing = [...new Set(texts.filter((text) => text.trim() && !entries.has(keyOf(text))))];

  for (const batch of toBatches(missing)) {
    const translations = await requestTranslations(batch, options);
    batch.forEach((text, index) => entries.set(keyOf(text), translations[index] ?? text));
  }
  if (missing.length > 0) saveCache(entries);

  return texts.map((text) => entries.get(keyOf(text)) ?? text);
}

/** Esvazia o cache em memória. Usado pelos testes, para um não herdar as traduções do outro. */
export function clearTranslationCache(): void {
  cache = null;
}
