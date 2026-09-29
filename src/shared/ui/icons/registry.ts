import type MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';

import cancel from './cancel.svg';
import checklist from './checklist.svg';
import close from './close.svg';
import favoriteFilled from './favorite-filled.svg';
import favorite from './favorite.svg';
import lightMode from './light-mode.svg';
import logo from './logo.svg';
import moreHoriz from './more-horiz.svg';
import restaurant from './restaurant.svg';
import schedule from './schedule.svg';
import search from './search.svg';
import skillet from './skillet.svg';
import tips from './tips.svg';

type MaterialName = ComponentProps<typeof MaterialIcons>['name'];

/** Ícone exportado do Figma: o SVG original e o tamanho que ele tem no design. */
interface SvgIcon {
  kind: 'svg';
  source: number;
  width: number;
  height: number;
}

/** Ícone das telas que ainda não foram exportadas do Figma: Material Icons, a mesma família visual. */
interface MaterialIcon {
  kind: 'material';
  name: MaterialName;
  size: number;
}

export const ICONS = {
  // Exportados do Figma (tela Início, node 1:641). Tamanhos exatos do design.
  cancel: { kind: 'svg', source: cancel, width: 16.667, height: 16.667 },
  checklist: { kind: 'svg', source: checklist, width: 20, height: 15.075 },
  close: { kind: 'svg', source: close, width: 9.333, height: 9.333 },
  favorite: { kind: 'svg', source: favorite, width: 20, height: 18.35 },
  favoriteFilled: { kind: 'svg', source: favoriteFilled, width: 20, height: 18.35 },
  lightMode: { kind: 'svg', source: lightMode, width: 14.667, height: 14.667 },
  logo: { kind: 'svg', source: logo, width: 21.3, height: 17 },
  moreHoriz: { kind: 'svg', source: moreHoriz, width: 13.333, height: 3.333 },
  restaurant: { kind: 'svg', source: restaurant, width: 15, height: 20 },
  schedule: { kind: 'svg', source: schedule, width: 12.5, height: 12.5 },
  /** O SVG já inclui a margem esquerda de 14 px do campo de busca. */
  search: { kind: 'svg', source: search, width: 30.5, height: 16.5 },
  skillet: { kind: 'svg', source: skillet, width: 17.75, height: 14.167 },
  tips: { kind: 'svg', source: tips, width: 16.875, height: 16.5 },

  // Material Icons, até os SVGs das outras telas serem exportados.
  add: { kind: 'material', name: 'add', size: 24 },
  arrowBack: { kind: 'material', name: 'arrow-back', size: 24 },
  check: { kind: 'material', name: 'check', size: 20 },
  chevronLeft: { kind: 'material', name: 'chevron-left', size: 28 },
  chevronRight: { kind: 'material', name: 'chevron-right', size: 28 },
  cloudOff: { kind: 'material', name: 'cloud-off', size: 20 },
  darkMode: { kind: 'material', name: 'dark-mode', size: 16 },
  delete: { kind: 'material', name: 'delete-outline', size: 22 },
  error: { kind: 'material', name: 'error-outline', size: 22 },
  info: { kind: 'material', name: 'info-outline', size: 20 },
  listAlt: { kind: 'material', name: 'list-alt', size: 22 },
  lightbulb: { kind: 'material', name: 'lightbulb-outline', size: 20 },
  pause: { kind: 'material', name: 'pause', size: 22 },
  play: { kind: 'material', name: 'play-arrow', size: 22 },
  playCircle: { kind: 'material', name: 'play-circle-outline', size: 22 },
  remove: { kind: 'material', name: 'remove', size: 24 },
  searchOff: { kind: 'material', name: 'search-off', size: 32 },
  share: { kind: 'material', name: 'share', size: 22 },
  shuffle: { kind: 'material', name: 'shuffle', size: 20 },
  sort: { kind: 'material', name: 'sort', size: 20 },
  taskAlt: { kind: 'material', name: 'task-alt', size: 22 },
  timer: { kind: 'material', name: 'timer', size: 20 },
  warning: { kind: 'material', name: 'warning-amber', size: 22 },
  wbSunny: { kind: 'material', name: 'wb-sunny', size: 20 },
} satisfies Record<string, SvgIcon | MaterialIcon>;

export type IconName = keyof typeof ICONS;
