import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View, type DimensionValue } from 'react-native';

import { useReduceMotion } from '@/shared/lib';
import { useTheme } from '@/shared/theme';

export interface SkeletonBlockProps {
  width?: DimensionValue;
  height: number;
  rounded?: boolean;
}

/** Retângulo cinza que "pulsa" enquanto o conteúdo carrega. Parado se o sistema pede menos movimento. */
export function SkeletonBlock({ width = '100%', height, rounded = false }: SkeletonBlockProps) {
  const { colors, radius } = useTheme();
  const reduceMotion = useReduceMotion();
  // Criado uma vez só: o useState com função guarda o mesmo Animated.Value entre renderizações.
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (reduceMotion) {
      opacity.setValue(1);
      return;
    }

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.45, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity, reduceMotion]);

  return (
    <Animated.View
      style={{
        width,
        height,
        opacity,
        borderRadius: rounded ? radius.full : radius.md,
        backgroundColor: colors.surfaceVariant,
      }}
    />
  );
}

/** Esqueleto no formato do card de receita (foto de 176 px, etiquetas, título e botão). */
export function SkeletonCard() {
  const { colors, spacing, radius, shadows } = useTheme();

  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[styles.card, shadows.card, { backgroundColor: colors.surface, borderRadius: radius.xl }]}
    >
      <SkeletonBlock height={176} />
      <View style={{ padding: spacing.md, gap: spacing.sm }}>
        <View style={[styles.row, { gap: spacing.sm }]}>
          <SkeletonBlock width={64} height={22} />
          <SkeletonBlock width={56} height={22} />
        </View>
        <SkeletonBlock width="70%" height={24} />
        <SkeletonBlock width="90%" height={16} />
        <View style={{ paddingTop: spacing.sm }}>
          <SkeletonBlock height={48} rounded />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
});
