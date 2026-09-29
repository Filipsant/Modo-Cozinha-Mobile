/// <reference types="node" />
/**
 * Gera o som do alarme dos timers: três bipes curtos de 880 Hz (WAV mono, 16 bits, 22 050 Hz).
 * Gerado por código para não depender de um arquivo de som de terceiros.
 *
 * Rodar com: node scripts/generate-timer-sound.ts
 */
import { mkdir, writeFile } from 'node:fs/promises';

const OUTPUT_DIR = 'src/features/kitchen-timers/assets';
const SAMPLE_RATE = 22050;
const FREQUENCY = 880;
const BEEP_SECONDS = 0.18;
const GAP_SECONDS = 0.12;
const BEEPS = 3;
/** Rampa de 10 ms no começo e no fim de cada bipe, para não estalar. */
const FADE_SECONDS = 0.01;

function samples(): Int16Array {
  const beep = Math.round(BEEP_SECONDS * SAMPLE_RATE);
  const gap = Math.round(GAP_SECONDS * SAMPLE_RATE);
  const fade = Math.round(FADE_SECONDS * SAMPLE_RATE);
  const data = new Int16Array(BEEPS * (beep + gap));

  for (let b = 0; b < BEEPS; b++) {
    const start = b * (beep + gap);
    for (let i = 0; i < beep; i++) {
      const envelope = Math.min(1, i / fade, (beep - i) / fade);
      data[start + i] = Math.round(
        Math.sin((2 * Math.PI * FREQUENCY * i) / SAMPLE_RATE) * envelope * 0.6 * 32767,
      );
    }
  }
  return data;
}

function wav(data: Int16Array): Buffer {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.byteLength, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // tamanho do bloco fmt
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * 2, 28); // bytes por segundo
  header.writeUInt16LE(2, 32); // bytes por amostra
  header.writeUInt16LE(16, 34); // bits por amostra
  header.write('data', 36);
  header.writeUInt32LE(data.byteLength, 40);
  return Buffer.concat([header, Buffer.from(data.buffer)]);
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(`${OUTPUT_DIR}/timer-beep.wav`, wav(samples()));
  console.log(`Som salvo em ${OUTPUT_DIR}/timer-beep.wav`);
}

void main();
