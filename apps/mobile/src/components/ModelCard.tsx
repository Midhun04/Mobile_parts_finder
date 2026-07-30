import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MobileModelWithBrand } from '@mpf/shared';
import { formatModelName } from '../utils/format';
import type { AppColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  model: MobileModelWithBrand;
  onPress: () => void;
};

export function ModelCard({ model, onPress }: Props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${formatModelName(model)}${model.modelNumber ? `, model ${model.modelNumber}` : ''}`}
    >
      <View style={styles.icon}>
        <View style={styles.phone}>
          <View style={styles.phoneSpeaker} />
          <View style={styles.phoneScreen} />
          <View style={styles.phoneButton} />
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>{model.brand.name}</Text>
        <Text style={styles.title}>{model.name}</Text>
        {model.modelNumber ? (
          <Text style={styles.subtitle}>Model: {model.modelNumber}</Text>
        ) : null}
      </View>
      <View style={styles.chevronCircle}>
        <Text style={styles.chevron}>›</Text>
      </View>
    </Pressable>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  phone: {
    width: 20,
    height: 32,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingTop: 5,
  },
  phoneSpeaker: {
    position: 'absolute',
    top: 2,
    width: 6,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: colors.primary,
  },
  phoneScreen: {
    width: 13,
    height: 20,
    borderRadius: 1,
    backgroundColor: colors.primaryLight,
  },
  phoneButton: {
    marginTop: 1.5,
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
  },
  eyebrow: {
    marginBottom: 2,
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textSecondary,
  },
  chevronCircle: {
    width: 32,
    height: 32,
    marginLeft: 8,
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    marginTop: -2,
    fontSize: 23,
    color: colors.primary,
    lineHeight: 25,
  },
});
