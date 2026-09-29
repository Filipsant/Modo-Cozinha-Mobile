import * as Clipboard from 'expo-clipboard';
import { Share } from 'react-native';

import { showToast } from '@/shared/ui';

import type { ShoppingItem } from '../lib/addRecipeToList';
import { formatShoppingList } from '../lib/formatShoppingList';

/** Abre o menu de compartilhar do celular (WhatsApp, e-mail...) com o texto da lista (RF22). */
export async function shareList(items: ShoppingItem[]): Promise<void> {
  try {
    await Share.share({ message: formatShoppingList(items), title: 'Lista de compras' });
  } catch {
    // Sem menu de compartilhar disponível: copia o texto como alternativa.
    await copyList(items);
  }
}

/** Alternativa ao compartilhar: copia a lista para colar onde quiser. */
export async function copyList(items: ShoppingItem[]): Promise<void> {
  await Clipboard.setStringAsync(formatShoppingList(items));
  showToast({ message: 'Lista copiada', variant: 'success' });
}
