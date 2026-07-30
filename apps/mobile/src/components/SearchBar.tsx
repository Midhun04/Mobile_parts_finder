import { StyleSheet, TextInput, View, Pressable, Text } from 'react-native';
import type { AppColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  autoFocus?: boolean;
};

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Search model or part number',
  autoFocus = false,
}: Props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.wrap}>
      <View style={styles.inputWrap}>
        <View style={styles.searchIcon} accessibilityElementsHidden>
          <View style={styles.searchIconCircle} />
          <View style={styles.searchIconHandle} />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          autoFocus={autoFocus}
          style={styles.input}
          accessibilityLabel={placeholder}
        />
        {value.length > 0 ? (
          <Pressable
            onPress={() => onChangeText('')}
            style={({ pressed }) => [styles.clearButton, pressed && styles.clearButtonPressed]}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={8}
          >
            <View style={styles.clearIcon}>
              <View style={[styles.clearLine, styles.clearLineA]} />
              <View style={[styles.clearLine, styles.clearLineB]} />
            </View>
          </Pressable>
        ) : null}
      </View>
      <Pressable
        onPress={onSubmit}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        accessibilityRole="button"
        accessibilityLabel="Search"
      >
        <Text style={styles.buttonText}>Search</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 6,
    borderRadius: 18,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
  inputWrap: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 13,
    fontSize: 15,
    color: colors.text,
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    backgroundColor: colors.surfaceMuted,
  },
  clearButtonPressed: {
    opacity: 0.7,
  },
  clearIcon: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearLine: {
    position: 'absolute',
    width: 12,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.textMuted,
  },
  clearLineA: {
    transform: [{ rotate: '45deg' }],
  },
  clearLineB: {
    transform: [{ rotate: '-45deg' }],
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  searchIconCircle: {
    position: 'absolute',
    left: 1,
    top: 1,
    width: 13,
    height: 13,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 7,
  },
  searchIconHandle: {
    position: 'absolute',
    width: 8,
    height: 2,
    left: 12,
    top: 14,
    borderRadius: 1,
    backgroundColor: colors.primary,
    transform: [{ rotate: '45deg' }],
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 13,
    minHeight: 48,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: colors.primaryDark,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 15,
  },
});
