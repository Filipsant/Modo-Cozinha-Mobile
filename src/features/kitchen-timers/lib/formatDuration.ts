/** Duração para rótulos: 45 → "45 s", 600 → "10 min", 5400 → "1 h 30 min". */
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);

  if (hours > 0) return minutes > 0 ? `${hours} h ${minutes} min` : `${hours} h`;
  if (minutes > 0) return seconds > 0 ? `${minutes} min ${seconds} s` : `${minutes} min`;
  return `${seconds} s`;
}

const pad = (value: number) => String(value).padStart(2, '0');

/** Contagem regressiva: 599 000 ms → "09:59"; 3 905 000 ms → "1:05:05". Arredonda para cima. */
export function formatCountdown(milliseconds: number): string {
  const total = Math.max(0, Math.ceil(milliseconds / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

/** Texto para o leitor de tela: "9 minutos e 59 segundos restantes". */
export function describeRemaining(milliseconds: number): string {
  const total = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  const parts = [];
  if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`);
  if (seconds > 0 || minutes === 0) parts.push(`${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`);
  const isSingular = parts.length === 1 && (minutes === 1 || (minutes === 0 && seconds === 1));
  return `${parts.join(' e ')} ${isSingular ? 'restante' : 'restantes'}`;
}
