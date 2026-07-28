import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MobileModelWithBrand } from '@mpf/shared';
import { formatModelName } from '../utils/format';
import { colors } from '../theme/colors';

type Props = {
  model: MobileModelWithBrand;
  onPress: () => void;
};

export function ModelCard({ model, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.icon}>
        <Text style={styles.iconText}>📱</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{formatModelName(model)}</Text>
        {model.modelNumber ? (
          <Text style={styles.subtitle}>Model: {model.modelNumber}</Text>
        ) : null}
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.85,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textSecondary,
  },
  chevron: {
    fontSize: 26,
    color: colors.textMuted,
    marginLeft: 8,
    lineHeight: 28,
  },
});
