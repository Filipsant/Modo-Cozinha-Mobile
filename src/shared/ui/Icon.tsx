import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';

import { ICONS, type IconName } from './icons/registry';

export interface IconProps {
  name: IconName;
  color: string;
  /** Multiplica o tamanho do design (ex.: 1.4 no modo cozinha). */
  scale?: number;
}

/**
 * Ícone decorativo: quem dá nome para o leitor de tela é o botão em volta dele.
 * Os SVGs do Figma são pintados com tintColor, então seguem o tema claro e escuro.
 */
export function Icon({ name, color, scale = 1 }: IconProps) {
  const icon = ICONS[name];

  if (icon.kind === 'material') {
    return (
      <MaterialIcons
        name={icon.name}
        size={icon.size * scale}
        color={color}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
    );
  }

  return (
    <Image
      source={icon.source}
      tintColor={color}
      contentFit="contain"
      style={{ width: icon.width * scale, height: icon.height * scale }}
      accessible={false}
    />
  );
}
