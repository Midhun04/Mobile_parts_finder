import { Pressable, StyleSheet, Text } from 'react-native';
import { PART_TYPE_ICONS, PART_TYPE_LABELS, type PartType } from '@mpf/shared';
import { colors } from '../theme/colors';

type Props = {
  type: PartType;
  count: number;
  onPress: () => void;
};

export function PartCategoryRow({ type, count, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Text style={styles.icon}>{PART_TYPE_ICONS[type]}</Text>
      <Text style={styles.label}>{PART_TYPE_LABELS[type]}</Text>
      <Text style={styles.count}>{count}</Text>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.85,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  count: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  chevron: {
    fontSize: 26,
    color: colors.textMuted,
    lineHeight: 28,
  },
});
