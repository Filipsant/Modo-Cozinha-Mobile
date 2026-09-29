import AsyncStorage from '@react-native-async-storage/async-storage';
import { HttpResponse, http } from 'msw';

import { TRANSLATE_API_URL } from '@/shared/config';
import { server } from '@/shared/testing';

import { clearTranslationCache, translateTexts } from './translate';

const toPortuguese = { from: 'en', to: 'pt' };

describe('translateTexts', () => {
  it('traduz vários textos numa requisição só, na mesma ordem', async () => {
    let requests = 0;
    server.use(
      http.post(TRANSLATE_API_URL, async ({ request }) => {
        requests++;
        const texts = new URLSearchParams(await request.text()).getAll('q');
        return HttpResponse.json(texts.map((text) => `pt:${text}`));
      }),
    );

    const result = await translateTexts(['soy sauce', 'brown sugar', 'soy sauce'], toPortuguese);

    expect(result).toEqual(['pt:soy sauce', 'pt:brown sugar', 'pt:soy sauce']);
    expect(requests).toBe(1);
  });

  it('não traduz de novo o que já está no cache, nem textos vazios', async () => {
    const received: string[][] = [];
    server.use(
      http.post(TRANSLATE_API_URL, async ({ request }) => {
        const texts = new URLSearchParams(await request.text()).getAll('q');
        received.push(texts);
        return HttpResponse.json(texts.map((text) => text.toUpperCase()));
      }),
    );

    await translateTexts(['garlic'], toPortuguese);
    const result = await translateTexts(['garlic', 'onion', ''], toPortuguese);

    expect(result).toEqual(['GARLIC', 'ONION', '']);
    expect(received).toEqual([['garlic'], ['onion']]);
  });

  it('guarda as traduções no celular para a próxima vez que o app abrir', async () => {
    await translateTexts(['Teriyaki Chicken Casserole'], toPortuguese);
    clearTranslationCache();
    server.use(http.post(TRANSLATE_API_URL, () => HttpResponse.error()));

    expect(await translateTexts(['Teriyaki Chicken Casserole'], toPortuguese)).toEqual([
      'Caçarola de Frango Teriyaki',
    ]);
    expect(await AsyncStorage.getItem('modo-cozinha:translations')).toContain('Caçarola');
  });

  it('lança o erro quando o serviço falha, para quem chama mostrar o original', async () => {
    server.use(http.post(TRANSLATE_API_URL, () => new HttpResponse(null, { status: 429 })));

    await expect(translateTexts(['salt'], toPortuguese)).rejects.toThrow('status 429');
  });

  it('divide textos longos em mais de uma requisição', async () => {
    let requests = 0;
    server.use(
      http.post(TRANSLATE_API_URL, async ({ request }) => {
        requests++;
        return HttpResponse.json(new URLSearchParams(await request.text()).getAll('q'));
      }),
    );

    await translateTexts(['a'.repeat(3000), 'b'.repeat(3000)], toPortuguese);

    expect(requests).toBe(2);
  });
});
