import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPopularBrands, getRecentlyAddedModels } from '../api/compatibilityApi';
import { ModelCard } from '../components/ModelCard';
import { ErrorState, LoadingState } from '../components/QueryState';
import { SearchBar } from '../components/SearchBar';
import type { RootStackParamList } from '../navigation/types';
import type { AppColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = createStyles(colors);
  const [query, setQuery] = useState('');

  const brandsQuery = useQuery({
    queryKey: ['brands', 'popular'],
    queryFn: getPopularBrands,
  });

  const recentQuery = useQuery({
    queryKey: ['mobile-models', 'recent'],
    queryFn: getRecentlyAddedModels,
  });

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigation.navigate('SearchResults', { query: trimmed });
  };

  if (brandsQuery.isLoading || recentQuery.isLoading) {
    return <LoadingState />;
  }

  if (brandsQuery.isError || recentQuery.isError) {
    return (
      <ErrorState
        message={
          brandsQuery.error?.message ||
          recentQuery.error?.message ||
          'Unable to reach the API.'
        }
      />
    );
  }

  const popularBrands = brandsQuery.data ?? [];
  const recentModels = recentQuery.data ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.stickyHeader}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="cover"
          accessibilityLabel="Parts Finder"
        />
        <View style={styles.headerContent}>
          <View style={styles.brandText}>
            <View style={styles.brandName}>
              <Text style={[styles.brandWord, styles.brandParts]}>PARTS</Text>
              <Text style={[styles.brandWord, styles.brandFinder]}>FINDER</Text>
            </View>
            <Text style={styles.brandTagline} numberOfLines={1}>
              Find. Match. Repair.
            </Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              onPress={toggleTheme}
              hitSlop={10}
              style={({ pressed }) => [
                styles.themeToggle,
                pressed && styles.themeTogglePressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              <Text style={styles.themeIcon}>{isDark ? '☀' : '☾'}</Text>
            </Pressable>
            <View style={styles.headerBadge}>
              <View style={styles.headerBadgeDot} />
              <Text style={styles.headerBadgeText}>LIVE</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroGlow} />
          <View style={styles.heroLabel}>
            <View style={styles.heroLabelLine} />
            <Text style={styles.heroLabelText}>SMART PARTS MATCHING</Text>
          </View>

          <View style={styles.searchBlock}>
            <SearchBar value={query} onChangeText={setQuery} onSubmit={handleSearch} />
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>QUICK ACCESS</Text>
              <Text style={styles.sectionTitle}>Popular brands</Text>
            </View>
            <View style={styles.countPill}>
              <Text style={styles.countPillText}>{popularBrands.length}</Text>
            </View>
          </View>
          <View style={styles.brandRow}>
            {popularBrands.map((brand) => (
              <Pressable
                key={brand.id}
                onPress={() =>
                  navigation.navigate('BrandModels', {
                    brandId: brand.id,
                    brandName: brand.name,
                  })
                }
                style={({ pressed }) => [styles.brandChip, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel={`Browse ${brand.name} models`}
              >
                <View style={styles.brandInitial}>
                  <Text style={styles.brandInitialText}>{brand.name.charAt(0)}</Text>
                </View>
                <Text style={styles.brandChipText}>{brand.name}</Text>
              </Pressable>
            ))}
          </View>

          <View style={[styles.sectionHeader, styles.modelsHeader]}>
            <View>
              <Text style={styles.sectionEyebrow}>FRESH IN THE CATALOG</Text>
              <Text style={styles.sectionTitle}>Recently added</Text>
            </View>
            <Text style={styles.resultCount}>{recentModels.length} models</Text>
          </View>
          {recentModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              onPress={() => navigation.navigate('ModelDetails', { modelId: model.id })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.hero,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
    backgroundColor: colors.background,
  },
  hero: {
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 28,
    backgroundColor: colors.hero,
  },
  heroGlow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    right: -100,
    top: -100,
    backgroundColor: colors.heroSoft,
    opacity: 0.72,
  },
  stickyHeader: {
    position: 'relative',
    height: 70,
    backgroundColor: colors.hero,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  logo: {
    position: 'absolute',
    left: 20,
    top: 10,
    width: 48,
    height: 48,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  headerContent: {
    position: 'absolute',
    left: 80,
    right: 20,
    top: 10,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  brandText: {
    flex: 1,
    minWidth: 0,
  },
  brandName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  brandWord: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  brandParts: {
    color: colors.brandBlue,
  },
  brandFinder: {
    color: colors.brandGreen,
  },
  brandTagline: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.55)',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeToggle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  themeTogglePressed: {
    opacity: 0.65,
    transform: [{ scale: 0.94 }],
  },
  themeIcon: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 21,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  headerBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.brandGreen,
  },
  headerBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  heroLabelLine: {
    width: 22,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.primaryLight,
  },
  heroLabelText: {
    color: colors.primaryLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  searchBlock: {
    marginTop: 26,
  },
  body: {
    marginTop: -1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 12,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    backgroundColor: colors.background,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionEyebrow: {
    marginBottom: 4,
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.3,
  },
  countPill: {
    minWidth: 29,
    height: 29,
    paddingHorizontal: 8,
    borderRadius: 15,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countPillText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  brandRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 34,
  },
  brandChip: {
    flexBasis: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingLeft: 7,
    paddingRight: 13,
    paddingVertical: 7,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  brandInitial: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandInitialText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  brandChipText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
  modelsHeader: {
    marginBottom: 16,
  },
  resultCount: {
    marginBottom: 3,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
});
